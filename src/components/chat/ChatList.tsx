import { APIMessage, Chat } from '@/lib/types/chat';
import { cn } from '@/lib/utils';
import { TrainFront, Octagon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '../ui/sidebar';
import { useEffect, useState } from 'react';

export default function ChatList({
  chats,
  selectedChat,
  setSelectedChat,
}: {
  chats?: Chat[];
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
}) {
  const [activeChats, setActiveChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (chats?.length === 0) return;

    const fetchChats = async () => {
      try {
        if (!chats) {
          const response = await fetch(`/api/chat/`);
          if (!response.ok) throw new Error('Failed to fetch chat');
          const userChats = await response.json();
          setActiveChats(userChats);
        } else {
          const updatedChats: Chat[] = [];

          for (const chat of chats) {
            const response = await fetch(`/api/chat/${chat.chatId}`);
            if (!response.ok) {
              const newRoomMessage: APIMessage = {
                messageId: '0',
                message: 'Be the first to say hi!',
                timestamp: Date.now(),
                user: {
                  id: '0',
                  name: 'System',
                  image: '',
                },
                reactions: {},
              };

              const newRoom: Chat = {
                chatId: chat.chatId,
                chatType: chat.chatType,
                messages: [...chat.messages, newRoomMessage],
              };
              updatedChats.push(newRoom);
            } else {
              const newChat = await response.json();
              updatedChats.push(newChat);
            }
          }
          setActiveChats(updatedChats);
        }
      } catch (error) {
        console.log('Error fetching chat data:', error);
      }
    };

    fetchChats();
  }, [chats]);

  return (
    <SidebarMenu>
      {activeChats.length === 0 && (
        <div className="mt-3 flex w-full flex-col items-center justify-between">
          <h4 className="space-y-1 text-sm font-semibold">No active chats</h4>
          <p className="text-foreground/75 space-y-1 px-15 text-center text-xs">
            Looks like there aren&apos;t any chat rooms available.
          </p>
        </div>
      )}
      {activeChats.map((item) => (
        <div key={item.chatId}>
          {/* <SidebarSeparator className="bg-accent -translate-x-2" /> */}
          <SidebarMenuItem
            key={item.chatId}
            className="mt-1 h-18 min-h-16 rounded-lg"
          >
            <SidebarMenuButton
              asChild
              className={cn(
                'bg-accent/20 hover:bg-accent/65 h-18 min-h-16',
                selectedChat?.chatId === item.chatId ? 'bg-accent/50' : '',
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
                  <div className="flex w-full flex-col justify-between">
                    <h4 className="space-y-1 text-sm font-semibold">
                      {item.chatId}
                    </h4>
                    <p className="text-foreground/75 space-y-1 text-xs">
                      {`${item.messages[
                        item.messages.length - 1
                      ]?.message.slice(
                        0,
                        25,
                      )}${item.messages[item.messages.length - 1]?.message.length >= 25 ? '...' : ''}` ||
                        'No messages'}
                    </p>
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
