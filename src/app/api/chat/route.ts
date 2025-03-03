import { auth } from '@/app/auth';
import parseDbMessages from '@/lib/chat/parseDbMessages';
import client from '@/lib/db';
import { ChatPostBody, MongoDBChatMessage } from '@/lib/types/chat';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Check for authenticated user
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id; // Get the user ID
  const chatsCollection = client.db('huddle-chat').collection('chats'); // Get the chats collection

  const userChatIdsAgg = await chatsCollection
    .aggregate([{ $match: { userId } }, { $group: { _id: '$chatId' } }])
    .toArray();

  const userChatIds = userChatIdsAgg.map((doc) => doc._id);

  // Second query: Get all messages for those chats, with user details populated
  const chatMessages = (await chatsCollection
    .aggregate([
      {
        $match: { chatId: { $in: userChatIds } },
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
    .toArray()) as MongoDBChatMessage[];

  const chatRooms = parseDbMessages(chatMessages); // Parse the chat messages

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
