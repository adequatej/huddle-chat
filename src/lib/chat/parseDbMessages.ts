import { Chat, ChatMessage, MongoDBChatMessage } from '../types/chat';

export default function parseDbMessages(dbMessages: MongoDBChatMessage[]) {
  // Format the chat messages to match the ChatMessage type
  const formattedMessages = dbMessages
    .map((message) => ({
      chatId: message.chatId,
      chatType: message.chatType,
      messageId: message?._id?.toString() || '',
      message: message.message || undefined,
      reaction: message.reaction || undefined,
      replyId: message.replyId || undefined,
      timestamp: message.timestamp,
      user: {
        id: message.user?._id?.toString(),
        name: message.user?.name,
        image: message.user?.image,
      },
    }))
    .sort((a, b) => a.timestamp - b.timestamp) as ChatMessage[];

  // Split chat messages into their chat rooms (removing reported messages)
  const chatRooms: Chat[] = Object.values(
    formattedMessages.reduce(
      (acc, message) => {
        if (message.reported) return acc;
        if (!acc[message.chatId])
          acc[message.chatId] = {
            chatId: message.chatId,
            chatType: message.chatType,
            messages: [],
          };

        if (!message.message && message.reaction) {
          const referencedMessage = acc[message.chatId].messages.find(
            (m) => m.messageId === message.replyId,
          );
          if (referencedMessage) {
            if (!referencedMessage.reactions[message.reaction])
              referencedMessage.reactions[message.reaction] = 0;
            referencedMessage.reactions[message.reaction]++;
          }
          return acc;
        }

        acc[message.chatId].messages.push({
          messageId: message.messageId,
          message: message.message as string,
          reactions: {},
          replyId: message.replyId,
          timestamp: message.timestamp,
          user: message.user,
        });
        return acc;
      },
      {} as {
        [chatId: string]: Chat;
      },
    ),
  );

  return chatRooms;
}
