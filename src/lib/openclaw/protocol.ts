import type { WebSocketMessage, ConnectParams } from './types';

export const OPENCLAW_PROTOCOL_VERSION = 3;

export const CONNECT_PARAMS: ConnectParams = {
  minProtocol: OPENCLAW_PROTOCOL_VERSION,
  maxProtocol: OPENCLAW_PROTOCOL_VERSION,
  client: {
    id: 'claw-pet',
    version: '1.0.0',
    platform: navigator.platform,
    mode: 'operator'
  },
  role: 'operator',
  scopes: ['operator.read', 'operator.write'],
  locale: 'zh-CN',
  auth: { token: '' }
};

export const GATEWAY_URL = 'ws://127.0.0.1:18789';

export function createRequest(method: string, params?: any): WebSocketMessage {
  return {
    type: 'req',
    id: Math.random().toString(36).substring(2, 15),
    method,
    params
  };
}

export function createResponse(id: string, ok: boolean, payload?: any, error?: any): WebSocketMessage {
  return {
    type: 'res',
    id,
    ok,
    payload,
    error
  };
}

export function createEvent(event: string, payload?: any): WebSocketMessage {
  return {
    type: 'event',
    event,
    payload
  };
}
