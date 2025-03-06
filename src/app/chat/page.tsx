'use client';
import { useEffect, useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { useSession } from 'next-auth/react';
import { Chat } from '@/lib/types/chat';
import { PublicUser } from '@/lib/types/user';
import ChatContent from '@/components/chat/ChatContent';

// Main chat page
export default function ChatPage() {
  // Check for sign in status and user
  const { data: session } = useSession();
  const user = session?.user as PublicUser;

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
