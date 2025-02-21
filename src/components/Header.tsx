import Image from 'next/image';
import AuthStatus from './AuthStatus';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Button } from './ui/button';
import {
  AlertTriangle,
  FileClock,
  MapPin,
  Menu,
  MessagesSquare,
} from 'lucide-react';

export function Header() {
  return (
    <header className="bg-accent fixed top-0 flex w-full items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Image
          src="/logo.svg"
          alt="Huddle Chat"
          width={32}
          height={32}
          className="invert dark:invert-0"
        />
        <h1 className="hidden text-2xl font-bold tracking-tight sm:block">
          Huddle Chat
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <AuthStatus />
        <nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={'ghost'} size={'icon'}>
                <Menu className="size-auto" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-4">
                  <AuthStatus />
                </SheetTitle>
                <SheetDescription className="mt-10">
                  <ul className="ml-5 space-y-4 text-2xl">
                    <li className="flex cursor-pointer items-center gap-2 hover:underline">
                      <FileClock />
                      <span className="ml-2">Time Table</span>
                    </li>
                    <li className="flex cursor-pointer items-center gap-2 hover:underline">
                      <MessagesSquare />
                      <span className="ml-2">Chat</span>
                    </li>
                    <li className="flex cursor-pointer items-center gap-2 hover:underline">
                      <AlertTriangle />
                      <span className="ml-2">Alerts</span>
                    </li>
                  </ul>
                  <span className="absolute bottom-0 mb-5 flex">
                    <MapPin />
                    <span className="ml-2">[Current Vehicle or Stop]</span>
                  </span>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
