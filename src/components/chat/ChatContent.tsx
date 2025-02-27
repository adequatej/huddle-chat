import { Chat, APIMessage } from '@/lib/types/chat';
import { User } from 'next-auth';
import { useEffect } from 'react';
import { SidebarInset, SidebarTrigger } from '../ui/sidebar';
import ChatBox from './ChatBox';
import ChatMessage from './ChatMessage';
import Image from 'next/image';

// Main inset section for chat content
export default function ChatContent({
  user,
  selectedChat,
}: {
  user: User;
  selectedChat: Chat | null;
}) {
  const sendMessage = (message: string, replyId?: string) => {
    const chatId = selectedChat?.chatId;
    const userId = user.id; // This will not work until this branch is merged with feature/register

    // Send the message
    console.table({ chatId, userId, message, replyId });
  };

  // Scroll to the bottom of the chat
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [selectedChat]);

  return (
    <SidebarInset className="relative">
      <SidebarTrigger className="fixed z-10 m-3 scale-130" />
      <div className="relative w-full">
        <h1 className="bg-background fixed z-[5] w-full py-2.5 pl-16 text-2xl font-bold">
          {selectedChat?.chatId || 'Chat'}
        </h1>
      </div>
      <div className="mt-10 mb-15 flex w-full flex-col gap-6 overflow-scroll p-5">
        {selectedChat ? (
          <>
            <ChatBox sendMessage={sendMessage} />
            {selectedChat.messages.map((message: APIMessage) => (
              <ChatMessage
                key={message.messageId}
                user={user}
                message={message}
                replyMessage={selectedChat.messages.find(
                  (m) => m.messageId === message.replyId,
                )}
              />
            ))}
          </>
        ) : (
          <div className="flex flex-col gap-5 pt-20 opacity-75">
            <Image
              src="/logo.svg"
              alt="Chat"
              width={128}
              height={128}
              className="m-auto invert dark:invert-0"
            />
            <h1 className="text-center text-xl">
              Select a chat to get started.
            </h1>
          </div>
        )}
      </div>
    </SidebarInset>
  );
}
