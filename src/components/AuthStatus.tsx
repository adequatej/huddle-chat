'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function AuthStatus() {
  // Current auth status
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <>
        <Image
          src={session.user.image || ''}
          alt={`${session.user.name}'s avatar`}
          width={50}
          height={50}
          className="border-foreground rounded-full border-2 border-solid"
        />
        <div>
          <p>{session.user.name}</p>
          <p className="italic">{session.user.email}</p>
        </div>
        {/* Simple sign out button */}
        <button
          className="rounded bg-red-500 px-4 py-2 text-white"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </>
    );
  }

  return (
    <>
      <span>Not logged in</span>
      {/* Simple sign in button */}
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white"
        onClick={() => signIn()}
      >
        Sign In
      </button>
    </>
  );
}
