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
import friendlyName from '@/lib/friendlyName';

export default function ChatList({
  chats,
  selectedChat,
  setSelectedChat,
}: {
  chats: Chat[];
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
}) {
  return (
    <SidebarMenu>
      {chats.map((item) => (
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
                      {friendlyName(item.chatId)}
                    </h4>
                    <span className="text-foreground/75 space-y-1 text-xs">
                      31 Minutes Ago
                    </span>
                  </div>
                  <p className="text-sm">
                    {item.messages[item.messages.length - 1].message}
                  </p>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>
      ))}
    </SidebarMenu>
  );
}
