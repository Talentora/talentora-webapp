export interface ReceivedChatMessage {
  type: 'text' | 'command';
  content: string;
  timestamp: number;
  sender?: string;
} 