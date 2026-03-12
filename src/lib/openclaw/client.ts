import WebSocket from '@tauri-apps/plugin-websocket';
import type { WebSocketMessage } from './types';

export class OpenClawClient {
  private ws: WebSocket | null = null;
  private heartbeatInterval: number | null = null;

  async connect(gatewayUrl: string = 'ws://127.0.0.1:18789'): Promise<void> {
    try {
      this.ws = await WebSocket.connect(gatewayUrl);

      this.ws.addListener((message: any) => {
        try {
          const wsMessage: WebSocketMessage = JSON.parse(message);
          console.log('Received message:', wsMessage);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
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

    const message: WebSocketMessage = {
      type: 'req',
      id: this.generateId(),
      method: 'chat.send',
      params: {
        content,
        timestamp: Date.now()
      }
    };

    await this.ws.send(JSON.stringify(message));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  async disconnect(): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.ws) {
      await this.ws.disconnect();
    }
  }
}
