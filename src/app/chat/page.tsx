'use client';
import { useEffect, useState } from 'react';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { ChatSidebar } from '@/components/ChatSidebar';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Reply } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from '@/components/Header';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { APIMessage, Chat } from '@/lib/types/chat';
import { ReactionBadge } from '@/components/ReactionBadge';
import { Card } from '@/components/ui/card';
import { User } from '@/lib/types/user';

// Individual chat bubbles
function ChatMessage({
  user,
  message,
  replyMessage,
}: {
  user: User;
  message: APIMessage;
  replyMessage?: APIMessage;
}) {
  const messageOwner = user.id === message.user.id; // This will not work until this branch is merged with feature/register

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        messageOwner ? 'justify-end' : 'justify-start',
      )}
    >
      {/* Left Avatar */}
      {!messageOwner && (
        <Avatar className="size-10 border md:block">
          <AvatarImage src={message.user?.image || ''} />
          <AvatarFallback className="bg-accent">
            {message.user?.name?.[0] || 'N/A'}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message */}
      <div className="flex flex-col gap-1">
        {/* Reply */}
        {message.replyId && (
          <Card className="bg-background relative rounded-lg border p-2 text-xs">
            {/* Push <Reply /> to the end of the parent */}
            <Reply className="absolute right-2 size-5" />
            {replyMessage && (
              <>
                <p className="font-bold">{replyMessage.user.name}</p>
                <p>
                  {replyMessage.message.length > message.message.length
                    ? `${replyMessage.message.slice(
                        0,
                        message.message.length,
                      )}...`
                    : replyMessage.message}
                </p>
              </>
            )}
          </Card>
        )}
        <div
          className={cn(
            'bg-accent max-w-lg rounded-md p-2 break-words',
            messageOwner ? 'text-right' : 'text-left',
          )}
        >
          <p className="text-md font-bold">{message.user.name}</p>
          <p>{message.message}</p>

          {/* This might be something for a <ContextMenu /> */}
          {/* <div className="font-foreground text-xs opacity-75">
            {new Date(message.timestamp).toLocaleString()}
          </div> */}
        </div>

        {/* Reactions */}
        <div className="flex items-center gap-1">
          {Object.keys(message.reactions).length > 0 && (
            <ReactionBadge reactions={message.reactions} />
          )}
        </div>
      </div>

      {/* Right Avatar */}
      {messageOwner && (
        <Avatar className="size-10 border md:block">
          <AvatarImage src={message.user?.image || ''} />
          <AvatarFallback className="bg-accent">
            {message.user?.name?.[0] || 'N/A'}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

// Chat input box
function ChatBox({ sendMessage }: { sendMessage: (message: string) => void }) {
  const { state } = useSidebar(); // Sidebar state
  const [message, setMessage] = useState('');

  return (
    <div
      className={cn(
        'bg-sidebar fixed right-0 bottom-0 z-10 flex items-center justify-end gap-2 p-3 transition-all duration-200 ease-linear',
        state === 'collapsed'
          ? 'left-0'
          : 'left-0 md:left-[var(--sidebar-width)]',
      )}
    >
      <Input
        type="text"
        placeholder="Type a message"
        className="mr-12"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage(message);
          }
        }}
      />
      <Button
        type="submit"
        variant="secondary"
        size="icon"
        className="absolute"
        onClick={() => sendMessage(message)}
      >
        <Send />
      </Button>
    </div>
  );
}

// Main inset section for chat content
function ChatContent({
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

// Main chat page
export default function ChatPage() {
  // Check for sign in status and user
  const { data: session } = useSession();
  const user = session?.user as User;

  // If the user is not signed in, redirect to the sign in page
  useEffect(() => {
    if (session === null) {
      window.location.href = '/signin';
      return;
    }
  }, [session]);

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  // If the session is not loaded, show a loading spinner
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Header />
        <Loader2 className="size-16 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <SidebarProvider>
        <ChatSidebar
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
        <ChatContent user={user} selectedChat={selectedChat} />
      </SidebarProvider>
    </>
  );
}
