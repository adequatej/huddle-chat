'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { Session } from 'next-auth';

function AvatarDropdown({ session }: { session: Session }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-10">
          <AvatarImage src={session?.user?.image || ''} />
          <AvatarFallback>
            {session?.user?.name?.charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem variant={'destructive'} onSelect={() => signOut()}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AuthStatus() {
  // Current auth status
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-2">
        <AvatarDropdown session={session} />
        <div className="flex flex-col">
          <p>
            Hello, <b>{session.user.name}</b>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span>Not signed in.</span>
      <Button variant={'secondary'} onClick={() => signIn()}>
        Sign In
      </Button>
    </div>
  );
}
