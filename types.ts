export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isSessionActive: boolean;
}

export enum Sender {
  USER = 'user',
  MODEL = 'model'
}
