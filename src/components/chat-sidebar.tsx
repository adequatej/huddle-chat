'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarHeader,
} from '@/components/ui/sidebar';

// Menu items.
const items = [
  {
    title: 'Person',
    content: 'Hello',
    url: '#',
    icon: 'PE',
  },
  {
    title: 'Person1',
    content: 'Hello',
    url: '#',
    icon: 'PR',
  },
  {
    title: 'Person2',
    content: 'Hello',
    url: '#',
    icon: 'PS',
  },
  {
    title: 'Person3',
    content: 'Hello',
    url: '#',
    icon: 'PO',
  },
  {
    title: 'Person4',
    content: 'Hello',
    url: '#',
    icon: 'PN',
  },
  {
    title: 'Person5',
    content: 'Hello',
    url: '#',
    icon: 'PN',
  },
  {
    title: 'Person6',
    content: 'Hello',
    url: '#',
    icon: 'PN',
  },
  {
    title: 'Person7',
    content: 'Hello',
    url: '#',
    icon: 'PN',
  },
  {
    title: 'Person8',
    content: 'Hello',
    url: '#',
    icon: 'PN',
  },
  {
    title: 'Person9',
    content: 'Hello',
    url: '#',
    icon: 'PN',
  },
  {
    title: 'Person10',
    content: 'Hello',
    url: '#',
    icon: 'PN',
  },
  {
    title: 'Person11',
    content: 'Hello',
    url: '#',
    icon: 'PN',
  },
  {
    title: 'Person12',
    content: 'Hello',
    url: '#',
    icon: 'PN',
  },
];

export function ChatSidebar() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Sidebar className="bg-accent w-84">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarHeader className="items-center">
              <SidebarGroupLabel className="flex w-20 justify-between space-x-10">
                <Avatar>
                  <AvatarImage src="/logo.svg" />
                  <AvatarFallback className="bg-card">CN</AvatarFallback>
                </Avatar>
                User
              </SidebarGroupLabel>
              <input
                type="text"
                placeholder="Search..."
                className="bg-background text-foreground w-full rounded-lg p-2 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              />
            </SidebarHeader>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title} className="h-18 min-h-16">
                  <SidebarSeparator className="bg-foreground w-" />
                  <SidebarMenuButton asChild className="h-18 min-h-16">
                    <a href={item.url}>
                      <div className="flex w-80 items-center justify-between space-x-4">
                        <Avatar>
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
                          <p className="text-sm">{item.content}</p>
                        </div>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
