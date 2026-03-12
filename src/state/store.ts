import { create } from 'zustand';

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
  sendMessage: (text: string) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  connected: false,
  connectionStatus: 'disconnected',
  currentMessage: '',
  messages: [],

  setConnected: (connected) => set({ connected }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setCurrentMessage: (message) => set({ currentMessage: message }),

  addMessage: (message) => set((state) => {
    const messages = [
      ...state.messages.filter(m => !m.isLatest).map(m => ({ ...m, isLatest: false })),
      { ...message, isLatest: message.isLatest }
    ];
    return { messages: messages.slice(-100) };
  }),

  connectToGateway: async () => {
    // 在阶段 2 实现
    console.log('Connect to Gateway placeholder');
  },

  sendMessage: async (text) => {
    // 在阶段 2 实现
    console.log('Send message placeholder:', text);
  }
}));
