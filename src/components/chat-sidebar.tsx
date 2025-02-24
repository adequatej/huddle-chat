import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';

interface item {
  id: string;
  title: string;
  messages: string[];
  url: string;
  icon: string; // Array of messages
}

const items: item[] = [
  {
    id: '1',
    title: 'Person',
    messages: ['Hello', 'Bye'],
    url: '#',
    icon: 'PE',
  },
  {
    id: '2',
    title: 'Person1',
    messages: [
      'Helloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
      'Bye',
    ],
    url: '#',
    icon: 'PR',
  },
  {
    id: '3',
    title: 'Person2',
    messages: ['Hello', 'Bye'],
    url: '#',
    icon: 'PS',
  },
  {
    id: '4',
    title: 'Person3',
    messages: ['Hello', 'Bye'],
    url: '#',
    icon: 'PO',
  },
  {
    id: '5',
    title: 'Person4',
    messages: ['Hello', 'Bye'],
    url: '#',
    icon: 'PN',
  },
  {
    id: '6',
    title: 'Person5',
    messages: ['Hello', 'Bye'],
    url: '#',
    icon: 'PN',
  },
  {
    id: '7',
    title: 'Person6',
    messages: ['Hello', 'Bye'],
    url: '#',
    icon: 'PN',
  },
  {
    id: '8',
    title: 'Person7',
    messages: ['Hello', 'Bye'],
    url: '#',
    icon: 'PN',
  },
  {
    id: '9',
    title: 'Person8',
    messages: ['Hello', 'Bye'],
    url: '#',
    icon: 'PN',
  },
  {
    id: '10',
    title: 'Person9',
    messages: ['Hello', 'Bye'],
    url: '#',
    icon: 'PN',
  },
  {
    id: '11',
    title: 'Person10',
    messages: ['Hello', 'Bye'],
    url: '#',
    icon: 'PN',
  },
  {
    id: '12',
    title: 'Person11',
    messages: ['Hello', 'Bye'],
    url: '#',
    icon: 'PN',
  },
];

export function ChatSidebar({
  setSelectedChat,
}: {
  setSelectedChat: (item: item) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Sidebar className="bg-sidebar-accent">
      <SidebarHeader className="items-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex w-14 justify-between space-x-10">
                  <Avatar className="size-12 md:block">
                    <AvatarImage />
                    <AvatarFallback className="bg-accent">ME</AvatarFallback>
                  </Avatar>
                </div>
                <span className="">User</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <input
          type="text"
          placeholder="Search..."
          className="bg-background text-foreground w-full rounded-lg p-2 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {filteredItems.map((item) => (
              <SidebarMenuItem key={item.title} className="h-18 min-h-16">
                <SidebarSeparator className="bg-foreground w-" />
                <SidebarMenuButton
                  asChild
                  className="h-18 min-h-16"
                  onClick={() => setSelectedChat(item)}
                >
                  <a href={item.url}>
                    <div className="flex w-80 items-center justify-between space-x-4">
                      <Avatar className="size-12 md:block">
                        <AvatarImage />
                        <AvatarFallback className="bg-card">
                          {item.icon}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex w-full justify-between">
                          <h4 className="space-y-1 text-sm font-semibold">
                            {item.title}
                          </h4>
                          <span className="text-muted-foreground space-y-1 text-xs">
                            31 Minutes Ago
                          </span>
                        </div>
                        <p className="text-sm">{item.messages.at(-1)}</p>
                      </div>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
