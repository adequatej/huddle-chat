import { ObjectId } from 'mongodb';
import { PublicUser, User } from './user';

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
  _id?: ObjectId; // When requesting from MongoDB
  messageId?: string;
  timestamp: number;
  user?: User; // Part of aggregation
  userId: string;
  reported: boolean; // Whether the message has been reported
};

export type ChatMessage = ChatPostBody & {
  messageId: string;
  timestamp: number;
  user: PublicUser;
  reported: boolean; // Whether the message has been reported
};

export type Reactions = { [reaction: string]: number };

export type APIMessage = {
  messageId: string;
  message: string;
  reactions: Reactions;
  replyId?: string;
  timestamp: number;
  user: PublicUser;
};

export type Chat = {
  chatId: string;
  chatType: 'vehicle' | 'stop';
  messages: APIMessage[];
};
