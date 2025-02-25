import { auth } from '@/app/auth';
import client from '@/lib/db';
import {
  Chat,
  ChatMessage,
  ChatPostBody,
  MongoDBChatMessage,
} from '@/lib/types/chat';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Check for authenticated user
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id; // Get the user ID
  const chatsCollection = client.db('huddle-chat').collection('chats'); // Get the chats collection

  // Get all chat messages for the user and join with the user collection
  const chatMessages = await chatsCollection
    .aggregate([
      {
        $match: { userId },
      },
      {
        $addFields: {
          userId: { $toObjectId: '$userId' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
      },
    ])
    .toArray();

  // Format the chat messages to match the ChatMessage type
  const formattedMessages = chatMessages
    .map((message) => ({
      chatId: message.chatId,
      chatType: message.chatType,
      messageId: message._id.toString(),
      message: message.message || undefined,
      reaction: message.reaction || undefined,
      replyId: message.replyId || undefined,
      timestamp: message.timestamp,
      user: {
        id: message.user?._id.toString(),
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
        acc[message.chatId].messages.push({
          messageId: message.messageId,
          message: message.message,
          reaction: message.reaction,
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

  return NextResponse.json(chatRooms);
}

// Send a chat message
export async function POST(req: NextRequest) {
  let body: ChatPostBody;
  try {
    body = await req.json();
  } catch (_e) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  // Check for valid request body
  if (!body) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  const { message, reaction, replyId, chatId, chatType } = body;

  // Check for invalid combinations of message, reaction, and replyId
  if (
    !chatId || // Must have chatId
    !chatType || // Must have chatType
    (!message && !reaction) || // Must have message or reaction
    (message && reaction) || // Cannot have both message and reaction
    (reaction && !replyId) // Must have replyId if reaction is present
  ) {
    return NextResponse.json(
      { error: 'Invalid combination of request parameters' },
      { status: 400 },
    );
  }

  // Check for authenticated user
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id; // Get the user ID
  const chatsCollection = client.db('huddle-chat').collection('chats'); // Get the chats collection

  // Insert the chat message into the chats collection
  await chatsCollection.insertOne({
    chatId,
    chatType,
    userId,
    message: message || undefined,
    reaction: reaction || undefined,
    replyId: replyId || undefined,
    timestamp: Date.now(),
    reported: false,
  } as MongoDBChatMessage);

  return NextResponse.json({ success: true });
}
