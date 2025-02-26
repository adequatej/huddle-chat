import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Input } from './ui/input';
import { History, MapPin, Octagon, TrainFront } from 'lucide-react';
import { Chat } from '@/lib/types/chat';
import { cn } from '@/lib/utils';

const chatsDummy: Chat[] = [
  {
    chatId: 'Chat 1',
    chatType: 'vehicle',
    messages: [
      {
        messageId: '1',
        message: "Hey how's it going?",
        reactions: {},
        timestamp: Date.now(),
        user: {
          id: '1',
          name: 'John Doe',
          image: 'https://randomuser.me/api/portraits/',
        },
      },
      {
        messageId: '2',
        message: 'Good, how about you?',
        replyId: '1',
        reactions: {},
        timestamp: Date.now(),
        user: {
          id: '2',
          name: 'Jane Doe',
          image: 'https://randomuser.me/api/portraits/',
        },
      },
      {
        messageId: '3',
        message: "I'm doing well, thanks for asking!",
        reactions: {
          '❤️': 1,
        },
        timestamp: Date.now(),
        user: {
          id: '1',
          name: 'John Doe',
          image: 'https://randomuser.me/api/portraits/',
        },
      },
    ],
  },
  {
    chatId: 'Chat 2',
    chatType: 'stop',
    messages: [
      {
        messageId: '1',
        message:
          "Hey, how are you? This is a really long message that I don't know how to handle in the UI",
        reactions: {},
        timestamp: 1735212761000,
        user: {
          id: '2',
          name: 'Jane Doe',
          image: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
      },
      {
        messageId: '2',
        message: 'I am doing well, thank you!',
        replyId: '1',
        reactions: {
          '❤️': 4,
          '👍': 2,
          '😂': 1,
        },
        timestamp: 1735212762000,
        user: {
          id: '1',
          name: 'John Doe',
          image: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
      },
      {
        messageId: '3',
        message: "Hi everyone! I'm new here.",
        reactions: {},
        timestamp: 1735212763000,
        user: {
          id: '3',
          name: 'Alice Smith',
          image: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
      },
      {
        messageId: '4',
        message: 'Welcome, Alice! Nice to meet you.',
        replyId: '3',
        reactions: {
          '👍': 3,
        },
        timestamp: 1735212764000,
        user: {
          id: '2',
          name: 'Jane Doe',
          image: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
      },
      {
        messageId: '4.5',
        message: 'Hey Alice!',
        replyId: '3',
        reactions: {
          '😊': 1,
        },
        timestamp: 1735212764000,
        user: {
          id: '67be4da06911c1b78d81a327',
          name: 'Daniel Stoiber',
          image: 'https://avatars.githubusercontent.com/u/20031472?v=4',
        },
      },
      {
        messageId: '5',
        message: 'Hello Alice! Welcome aboard.',
        replyId: '3',
        reactions: {
          '❤️': 2,
        },
        timestamp: 1735212765000,
        user: {
          id: '1',
          name: 'John Doe',
          image: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
      },
      {
        messageId: '6',
        message: "Thank you all! I'm excited to be here.",
        replyId: '4',
        reactions: {
          '😊': 4,
        },
        timestamp: 1735212766000,
        user: {
          id: '3',
          name: 'Alice Smith',
          image: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
      },
      {
        messageId: '7',
        message: "Hey team, don't forget about the meeting tomorrow at 10 AM.",
        reactions: {},
        timestamp: 1735212767000,
        user: {
          id: '4',
          name: 'Bob Johnson',
          image: 'https://randomuser.me/api/portraits/men/2.jpg',
        },
      },
      {
        messageId: '8',
        message: 'Thanks for the reminder, Bob.',
        replyId: '7',
        reactions: {
          '👍': 2,
        },
        timestamp: 1735212768000,
        user: {
          id: '1',
          name: 'John Doe',
          image: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
      },
      {
        messageId: '9',
        message: "I'll be there!",
        replyId: '7',
        reactions: {
          '👍': 1,
        },
        timestamp: 1735212769000,
        user: {
          id: '2',
          name: 'Jane Doe',
          image: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
      },
      {
        messageId: '10',
        message: 'Looking forward to it.',
        replyId: '7',
        reactions: {
          '😊': 2,
        },
        timestamp: 1735212770000,
        user: {
          id: '3',
          name: 'Alice Smith',
          image: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
      },
      {
        messageId: '11',
        message: 'Does anyone have the agenda for the meeting?',
        reactions: {},
        timestamp: 1735212771000,
        user: {
          id: '2',
          name: 'Jane Doe',
          image: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
      },
      {
        messageId: '12',
        message: 'I can send it over to you, Jane.',
        replyId: '11',
        reactions: {
          '👍': 1,
        },
        timestamp: 1735212772000,
        user: {
          id: '4',
          name: 'Bob Johnson',
          image: 'https://randomuser.me/api/portraits/men/2.jpg',
        },
      },
    ],
  },
];

function ChatList({
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
                      {item.chatId}
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

export function ChatSidebar({
  selectedChat,
  setSelectedChat,
}: {
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Sidebar className="bg-sidebar-accent">
      <SidebarHeader className="items-center">
        <Input
          type="text"
          placeholder="Search..."
          className="bg-background text-foreground w-full rounded-lg p-2 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground flex gap-1 text-lg">
            <MapPin />
            Current Locations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ChatList
              chats={chatsDummy}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
            />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground flex gap-1 text-lg">
            <History />
            Past Conversations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ChatList
              chats={chatsDummy}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
