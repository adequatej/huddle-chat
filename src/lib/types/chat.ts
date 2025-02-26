import { User } from 'next-auth';

export type ChatPostBody = {
  chatId: string;
  chatType: 'vehicle' | 'stop';
  message?: string;
  reaction?: string;
  replyId?: string;
};

export type MongoDBChatMessage = ChatPostBody & {
  messageId?: string;
  timestamp: number;
  userId: string;
  reported: boolean; // Whether the message has been reported
};

export type ChatMessage = ChatPostBody & {
  messageId?: string;
  timestamp: number;
  user: User;
  reported: boolean; // Whether the message has been reported
};
