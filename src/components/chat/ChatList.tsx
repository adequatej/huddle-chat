import { Chat } from '@/lib/types/chat';
import { cn } from '@/lib/utils';
import { TrainFront, Octagon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import {
  SidebarMenu,
  SidebarSeparator,
  SidebarMenuItem,
  SidebarMenuButton,
} from '../ui/sidebar';
import { useEffect, useState } from 'react';

export default function ChatList({
  selectedChat,
  setSelectedChat,
}: {
  chats: Chat[];
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
}) {
  const [fetchedChats, setFetchedChats] = useState<Chat[]>([]);

  useEffect(() => {
    const chatIds = ['test'];

    if (chatIds.length === 0) return;

    const eventSources: EventSource[] = [];

    chatIds.forEach((chatId) => {
      const eventSource = new EventSource(`/api/chat/${chatId}`);
      eventSource.onmessage = (event) => {
        const newChat = JSON.parse(event.data);
        console.log('New chat:', newChat);
        setFetchedChats((prevChats) => {
          const existingChatIndex = prevChats.findIndex(
            (chat) => chat.chatId === newChat.chatId,
          );

          if (existingChatIndex !== -1) {
            const updatedChats = [...prevChats];
            updatedChats[existingChatIndex] = newChat;
            return updatedChats;
          } else {
            return [...prevChats, newChat];
          }
        });
      };

      eventSource.onerror = (err) => {
        console.error(`SSE error for chatId ${chatId}:`, err);
        eventSource.close();
      };

      eventSources.push(eventSource);
    });

    return () => {
      eventSources.forEach((es) => es.close());
    };
  }, []);

  return (
    <SidebarMenu>
      {fetchedChats.map((item) => (
        <div key={item.chatId}>
          <SidebarSeparator className="bg-accent -translate-x-2" />
          <SidebarMenuItem key={item.chatId} className="mt-1 h-18 min-h-16">
            <SidebarMenuButton
              asChild
              className={cn(
                'h-18 min-h-16',
                selectedChat?.chatId === item.chatId ? 'bg-accent' : '',
              )}
              onClick={() => setSelectedChat(item)}
            >
              <div className="flex w-full items-center justify-between space-x-4">
                <Avatar className="size-12 border md:block">
                  <AvatarImage />
                  <AvatarFallback className="bg-card">
                    {item.chatType === 'vehicle' ? <TrainFront /> : <Octagon />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex w-full justify-between">
                    <h4 className="space-y-1 text-sm font-semibold">
                      {item.chatId}
                    </h4>
                    <span className="text-foreground/75 space-y-1 text-xs">
                      {item.messages[item.messages.length - 1]?.message ||
                        'No messages'}
                    </span>
                  </div>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>
      ))}
    </SidebarMenu>
  );
}
