import WebSocket from '@tauri-apps/plugin-websocket';
import { createRequest } from './protocol';
import type { WebSocketMessage } from './types';

export class OpenClawClient {
  private ws: WebSocket | null = null;
  private onMessage: ((message: WebSocketMessage) => void) | null = null;

  async connect(
    gatewayUrl: string = 'ws://127.0.0.1:18789',
    onMessage?: (message: WebSocketMessage) => void,
  ): Promise<void> {
    try {
      this.ws = await WebSocket.connect(gatewayUrl);
      this.onMessage = onMessage ?? null;

      this.ws.addListener((rawMessage: unknown) => {
        const wsMessage = this.parseMessage(rawMessage);
        if (!wsMessage) {
          return;
        }

        this.onMessage?.(wsMessage);
      });

      console.log('Connected to OpenClaw Gateway');
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  }

  async sendMessage(content: string): Promise<void> {
    if (!this.ws) {
      throw new Error('WebSocket not connected');
    }

    const message: WebSocketMessage = createRequest('chat.send', {
      content,
      timestamp: Date.now(),
    });

    await this.ws.send(JSON.stringify(message));
  }

  async disconnect(): Promise<void> {
    if (this.ws) {
      await this.ws.disconnect();
      this.ws = null;
    }

    this.onMessage = null;
  }

  private parseMessage(rawMessage: unknown): WebSocketMessage | null {
    try {
      if (typeof rawMessage === 'string') {
        return JSON.parse(rawMessage) as WebSocketMessage;
      }

      if (rawMessage && typeof rawMessage === 'object' && 'data' in rawMessage) {
        const data = (rawMessage as { data: unknown }).data;
        if (typeof data === 'string') {
          return JSON.parse(data) as WebSocketMessage;
        }
        if (data && typeof data === 'object') {
          return data as WebSocketMessage;
        }
      }

      if (rawMessage && typeof rawMessage === 'object') {
        return rawMessage as WebSocketMessage;
      }

      return null;
    } catch (error) {
      console.error('Failed to parse message:', error);
      return null;
    }
  }
}
