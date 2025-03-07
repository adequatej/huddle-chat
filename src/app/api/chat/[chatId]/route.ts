import { auth } from '@/app/auth';
import parseDbMessages from '@/lib/chat/parseDbMessages';
import client from '@/lib/db';
import { MongoDBChatMessage } from '@/lib/types/chat';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  // Check for authenticated user
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { chatId } = await params; // Await params to extract chatId
  const chatsCollection = client.db('huddle-chat').collection('chats'); // Get the chats collection

  // Normal API request: Fetch and return chat messages
  const chatMessages = (await chatsCollection
    .aggregate([
      {
        $match: {
          chatId,
        },
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

  if (chatRooms.length === 0) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  }

  return NextResponse.json(chatRooms[0]); // Return the only chat room
}
