'use client';
import { Chat, APIMessage } from '@/lib/types/chat';
import { useEffect, useState, useRef } from 'react';
import { SidebarInset, SidebarTrigger } from '../ui/sidebar';
import ChatBox from './ChatBox';
import ChatMessage from './ChatMessage';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PublicUser } from '@/lib/types/user';

// Main inset section for chat content
export default function ChatContent({
  user,
  selectedChat,
}: {
  user: PublicUser;
  selectedChat: Chat | null;
}) {
  const [replyMessage, setReplyMessage] = useState<APIMessage>();
  const [chatMessages, setChatMessages] = useState<APIMessage[]>(
    selectedChat?.messages || [],
  );
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatMessages((prevMessages) => {
      if (selectedChat?.messages !== prevMessages) {
        return selectedChat?.messages || [];
      }
      return prevMessages;
    });
  }, [selectedChat]);

  const sendMessage = async (message: string, replyId?: string) => {
    const chatId = selectedChat?.chatId;
    const chatType = selectedChat?.chatType;

    const newMessage: APIMessage = {
      messageId: `${Date.now()}`, // Generate a temporary ID
      user,
      message,
      timestamp: new Date().getTime(),
      reactions: {},
      replyId,
    };

    // Immediately add the new message to the chatMessages state
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    setReplyMessage(undefined);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          chatType,
          message,
          replyId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const updateMessageReactions = (
    messageId: string,
    reactions: Record<string, number>,
  ) => {
    setChatMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.messageId === messageId && msg.reactions !== reactions
          ? { ...msg, reactions }
          : msg,
      ),
    );
  };

  // Polling for new messages and reactions
  useEffect(() => {
    const interval = setInterval(async () => {
      if (selectedChat) {
        try {
          const response = await fetch(`/api/chat/${selectedChat.chatId}`);
          if (response.ok) {
            const updatedChat = await response.json();
            setChatMessages((prevMessages) =>
              updatedChat.messages.map((newMsg: APIMessage) => {
                const existingMsg = prevMessages.find(
                  (msg) => msg.messageId === newMsg.messageId,
                );
                return existingMsg && existingMsg.reactions !== newMsg.reactions
                  ? { ...existingMsg, reactions: newMsg.reactions }
                  : newMsg;
              }),
            );
          }
        } catch (error) {
          console.error('Error fetching updated messages:', error);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedChat]);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages.length]);

  // Detect escape key to clear reply message
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setReplyMessage(undefined);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SidebarInset className="relative">
      <SidebarTrigger className="fixed z-10 m-3 scale-130" />
      <div className="relative w-full">
        <h1 className="bg-background fixed z-[5] w-full py-2.5 pl-16 text-2xl font-bold">
          {selectedChat?.chatId || 'Chat'}
        </h1>
      </div>
      <div
        className={cn(
          'mt-10 flex w-full flex-col gap-6 overflow-x-clip overflow-y-scroll p-5',
          replyMessage ? 'mb-35' : 'mb-15',
        )}
      >
        {selectedChat ? (
          <>
            <ChatBox
              sendMessage={sendMessage}
              replyMessage={replyMessage}
              closeReply={() => setReplyMessage(undefined)}
            />
            {chatMessages.map((message: APIMessage) => (
              <ChatMessage
                key={message.messageId}
                chatDetails={selectedChat}
                user={user}
                message={message}
                replyToMessage={() => setReplyMessage(message)}
                replyMessage={chatMessages.find(
                  (m) => m.messageId === message.replyId,
                )}
                updateMessageReactions={updateMessageReactions}
              />
            ))}
            <div ref={chatEndRef} />
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
