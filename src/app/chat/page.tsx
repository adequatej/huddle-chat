'use client';
import { useEffect, useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChatSidebar } from '@/components/ChatSidebar';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { useSession } from 'next-auth/react';
import { Chat } from '@/lib/types/chat';
import { User } from '@/lib/types/user';
import ChatContent from '@/components/chat/ChatContent';

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

  const queryInterval = 2000; // 2 second

  useEffect(() => {
    const chatId = selectedChat ? selectedChat.chatId : 'test';

    if (!chatId) return;

    const fetchChats = async () => {
      try {
        const response = await fetch(`/api/chat/${chatId}`);
        if (!response.ok) throw new Error('Failed to fetch chats');
        const newChat: Chat = await response.json();

        const recentNewId =
          newChat.messages[newChat.messages.length - 1].messageId;

        const recentFetchedID = selectedChat
          ? selectedChat.messages[selectedChat.messages.length - 1].messageId
          : null;

        // Only update fetchedChats if the most recent message ID is different
        if (recentNewId !== recentFetchedID) {
          setSelectedChat(newChat);
        }

        //        setSelectedChat(newChat);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    // Initial fetch
    fetchChats();

    const intervalId = setInterval(fetchChats, queryInterval);

    return () => clearInterval(intervalId);
  }, [selectedChat]);

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
