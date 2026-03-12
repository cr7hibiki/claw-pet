export interface ConnectParams {
  minProtocol: number;
  maxProtocol: number;
  client: {
    id: string;
    version: string;
    platform: string;
    mode: string;
  };
  role: string;
  scopes: string[];
  locale: string;
  auth?: {
    token?: string;
  };
}

export interface WebSocketMessage {
  type: 'req' | 'res' | 'event';
  id?: string;
  method?: string;
  params?: any;
  event?: string;
  payload?: any;
  ok?: boolean;
  error?: any;
}

export interface ChatMessage {
  content: string;
  timestamp: number;
}
