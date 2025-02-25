import Image from 'next/image';
import { Separator } from './ui/separator';
import Link from 'next/link';

export function Footer() {
  return (
    <>
      <div className="px-5">
        <Separator className="w-full" />
      </div>
      <footer className="flex w-full items-center justify-between p-4 px-8">
        <div className="flex items-center gap-2 opacity-75">
          <Image
            src="/logo.svg"
            alt="Huddle Chat"
            width={25}
            height={25}
            className="invert dark:invert-0"
          />
          <h1 className="hidden text-lg font-bold tracking-tight sm:block">
            Huddle Chat
          </h1>
          <span className="text-sm">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-foreground/75 text-sm">
            Made with ❤️ by{' '}
            <Link href="/about" className="hover:text-foreground/100 underline">
              Team H
            </Link>
            .
          </span>
        </div>
      </footer>
    </>
  );
}
