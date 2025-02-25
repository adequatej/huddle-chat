import { User } from 'next-auth';

type SimpleMessage = {
  message?: string;
  reaction?: string;
  replyId?: string;
};

export type ChatPostBody = SimpleMessage & {
  chatId: string;
  chatType: 'vehicle' | 'stop';
};

export type MongoDBChatMessage = ChatPostBody & {
  messageId?: string;
  timestamp: number;
  userId: string;
  reported: boolean; // Whether the message has been reported
};

export type ChatMessage = ChatPostBody & {
  messageId: string;
  timestamp: number;
  user: User;
  reported: boolean; // Whether the message has been reported
};

export type StrippedMessage = SimpleMessage & {
  messageId: string;
  timestamp: number;
  user: User;
};

export type Chat = {
  chatId: string;
  chatType: 'vehicle' | 'stop';
  messages: StrippedMessage[];
};
