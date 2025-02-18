'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function AuthStatus() {
  // Current auth status
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-4">
        <Avatar className="size-10">
          <AvatarImage src={session.user.image || ''} />
          <AvatarFallback>
            {session.user.name?.charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p>
            Hello, <b>{session.user.name}</b>
          </p>
        </div>
        <Button variant={'destructive'} onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span>Not signed in.</span>
      <Button variant={'secondary'} onClick={() => signIn()}>
        Sign In
      </Button>
    </div>
  );
}
