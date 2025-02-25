'use client';
import { useState } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { ChatSidebar } from '@/components/chat-sidebar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  FileClock,
  MapPin,
  Menu,
  House,
  Send,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Chat() {
  interface item {
    id: string;
    title: string;
    messages: string[];
    url: string;
    icon: string;
  }

  const [selectedChat, setSelectedChat] = useState<item | null>(null);
  const [sentMessage, setSentMessage] = useState<string>('');

  const messageSent = () => {
    if (selectedChat && sentMessage.trim() != '') {
      setSelectedChat({
        ...selectedChat,
        messages: [...selectedChat.messages, sentMessage],
      });
      setSentMessage('');
    }
  };

  return (
    <>
      <SidebarProvider>
        <ChatSidebar setSelectedChat={setSelectedChat} />
        <SidebarInset>
          <header className="bg-accent fixed top-0 flex w-317 items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-10 md:block">
                <AvatarImage />
                <AvatarFallback className="bg-card">
                  {selectedChat?.icon}
                </AvatarFallback>
              </Avatar>
              <span>
                {selectedChat
                  ? selectedChat.title
                  : 'Should autoselect the last person messaged probably'}
              </span>
            </div>
            <div className="x flex items-center gap-4">
              <nav>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant={'ghost'} size={'icon'}>
                      <Menu className="size-auto" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle className="flex flex-col items-center justify-center gap-4">
                        <span>
                          {selectedChat ? selectedChat.title : 'Pick Somebody'}
                        </span>
                        <Avatar className="size-28 md:block">
                          <AvatarImage />
                          <AvatarFallback className="bg-accent text-5xl">
                            {selectedChat?.icon}
                          </AvatarFallback>
                        </Avatar>
                      </SheetTitle>
                      <SheetDescription className="mt-10">
                        <span>Description and Some Buttons</span>
                        <ul className="absolute bottom-20 ml-5 space-y-4 text-2xl">
                          <li className="flex cursor-pointer items-center gap-2 hover:underline">
                            <House />
                            <span className="ml-2">Home</span>
                          </li>
                          <li className="flex cursor-pointer items-center gap-2 hover:underline">
                            <FileClock />
                            <span className="ml-2">Time Table</span>
                          </li>
                          <li className="flex cursor-pointer items-center gap-2 hover:underline">
                            <AlertTriangle />
                            <span className="ml-2">Alerts</span>
                          </li>
                        </ul>
                        <span className="absolute bottom-0 mb-5 flex">
                          <MapPin />
                          <span className="ml-2">
                            [Current Vehicle or Stop]
                          </span>
                        </span>
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </nav>
            </div>
          </header>
          <div className="bg-sidebar fixed bottom-0 flex w-317 items-center justify-end p-3">
            <Input
              type="text"
              placeholder="Type a message"
              value={sentMessage}
              onChange={(e) => setSentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  messageSent();
                }
              }}
            />
            <Button
              type="submit"
              variant="ghost"
              className="absolute"
              onClick={messageSent}
            >
              <Send color="#3e9392" />
            </Button>
          </div>
          <div className="flex-1 space-y-12 p-20">
            {selectedChat ? (
              <>
                <div className="mt-4">
                  {selectedChat.messages.map((message, index) => (
                    <div key={index} className="flex flex-row space-x-2">
                      <Avatar className="size-10 md:block">
                        <AvatarImage />
                        <AvatarFallback className="bg-accent">
                          {selectedChat?.icon}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-accent mb-5 max-w-[30%] rounded-md p-2 break-words">
                        <p className="text-xl">{selectedChat.title}</p>
                        <p>{message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p></p>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
