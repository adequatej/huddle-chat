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

  // Check if the request header indicates an SSE request
  const isSSE = req.headers.get('accept') === 'text/event-stream';

  if (!isSSE) {
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

    return NextResponse.json(chatRooms[0]); // Return the only chat room
  }

  // Stream chat updates

  console.log('opening stream');
  const stream = new ReadableStream({
    async start(controller) {
      const sendMessages = async () => {
        const chatMessages = (await chatsCollection
          .aggregate([
            { $match: { chatId } },
            { $addFields: { userId: { $toObjectId: '$userId' } } },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
              },
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
          ])
          .toArray()) as MongoDBChatMessage[];

        const chatRooms = parseDbMessages(chatMessages);
        const chatData = JSON.stringify(chatRooms[0]);

        controller.enqueue(`data: ${chatData}\n\n`);
      };

      await sendMessages();

      const changeStream = chatsCollection.watch([
        { $match: { 'fullDocument.chatId': chatId } },
      ]);
      changeStream.on('change', async () => {
        await sendMessages();
      });

      // Close the stream when the client disconnects
      const abortHandler = () => {
        console.log('closed stream');
        changeStream.close();
        controller.close();
      };

      req.signal.addEventListener('abort', abortHandler);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
