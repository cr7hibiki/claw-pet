import { create } from 'zustand';
import { OpenClawClient } from '../lib/openclaw/client';
import { GATEWAY_URL } from '../lib/openclaw/protocol';
import type { WebSocketMessage } from '../lib/openclaw/types';

export interface Message {
  id: string;
  content: string;
  timestamp: number;
  isLatest: boolean;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface AppState {
  connected: boolean;
  connectionStatus: ConnectionStatus;
  currentMessage: string;
  messages: Message[];
  setConnected: (connected: boolean) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setCurrentMessage: (message: string) => void;
  addMessage: (message: Message) => void;
  connectToGateway: () => Promise<void>;
  disconnectFromGateway: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
}

const openClawClient = new OpenClawClient();
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let manualDisconnect = false;

function clearReconnectTimer(): void {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function extractMessageContent(message: WebSocketMessage): string | null {
  const payload = message.payload;

  if (typeof payload === 'string') {
    return payload;
  }

  if (payload && typeof payload === 'object' && 'content' in payload) {
    const content = (payload as { content?: unknown }).content;
    return typeof content === 'string' ? content : null;
  }

  if (message.params && typeof message.params === 'object' && 'content' in message.params) {
    const content = (message.params as { content?: unknown }).content;
    return typeof content === 'string' ? content : null;
  }

  return null;
}

function createLocalMessage(content: string): Message {
  return {
    id: Math.random().toString(36).slice(2),
    content,
    timestamp: Date.now(),
    isLatest: true,
  };
}

export const useStore = create<AppState>((set, get) => ({
  connected: false,
  connectionStatus: 'disconnected',
  currentMessage: '',
  messages: [],

  setConnected: (connected) => set({ connected }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setCurrentMessage: (message) => set({ currentMessage: message }),

  addMessage: (message) =>
    set((state) => {
      const messages = [
        ...state.messages.map((m) => ({ ...m, isLatest: false })),
        { ...message, isLatest: true },
      ];

      return { messages: messages.slice(-100) };
    }),

  connectToGateway: async () => {
    const { connected, connectionStatus } = get();
    if (connected || connectionStatus === 'connecting') {
      return;
    }

    manualDisconnect = false;
    clearReconnectTimer();

    set({ connectionStatus: 'connecting' });

    try {
      await openClawClient.connect(GATEWAY_URL, (message) => {
        const content = extractMessageContent(message);
        if (!content) {
          return;
        }

        get().addMessage(createLocalMessage(content));
        set({ currentMessage: content });
      });

      set({ connected: true, connectionStatus: 'connected' });
    } catch (error) {
      console.error('Connect to Gateway failed:', error);
      set({ connected: false, connectionStatus: 'error' });

      if (!manualDisconnect) {
        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;
          void get().connectToGateway();
        }, 3000);
      }
    }
  },

  disconnectFromGateway: async () => {
    manualDisconnect = true;
    clearReconnectTimer();

    try {
      await openClawClient.disconnect();
    } catch (error) {
      console.error('Disconnect from Gateway failed:', error);
    } finally {
      set({ connected: false, connectionStatus: 'disconnected' });
    }
  },

  sendMessage: async (text) => {
    const content = text.trim();
    if (!content) {
      return;
    }

    get().addMessage(createLocalMessage(content));
    set({ currentMessage: content });

    if (!get().connected) {
      return;
    }

    try {
      await openClawClient.sendMessage(content);
    } catch (error) {
      console.error('Send message failed:', error);
      set({ connectionStatus: 'error', connected: false });
    }
  },
}));
