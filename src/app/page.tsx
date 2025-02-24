import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, FileClock, MessagesSquare } from 'lucide-react';
import { auth } from './auth';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  return (
    <>
      <Header />
      {/* Desktop landing */}
      <section className="relative hidden md:block">
        <div className="bg-secondary text-secondary-foreground mt-10 hidden h-[600px] w-1/2 max-w-2xl rounded-tr-[40%] rounded-br-[40%] px-10 lg:flex lg:flex-col lg:items-start lg:justify-center">
          <h1 className="animate-slide-in text-5xl font-bold tracking-tight">
            Huddle Chat
          </h1>
          <p className="animate-slide-in my-5 delay-100">
            A chat app for commuters to chat with others in the same station or
            train.
          </p>
          {!!session ? (
            <Button asChild size={'lg'}>
              <Link href="/chat">Start Chatting</Link>
            </Button>
          ) : (
            <Button asChild size={'lg'}>
              <Link href="/signin">Get Started</Link>
            </Button>
          )}
        </div>
        <Image
          src="/insideTrain.jpg"
          alt="Inside a train"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="absolute -z-10"
        />
      </section>

      {/* Mobile landing */}
      <section className="bg-secondary flex flex-col items-center gap-8 rounded-br-3xl rounded-bl-3xl p-10 pt-30 lg:hidden">
        <h1 className="text-secondary-foreground text-3xl font-bold">
          Huddle Chat
        </h1>
        <p className="text-secondary-foreground/80 text-center">
          A chat app for commuters to chat with others in the same station or
          train.
        </p>
        {!!session ? (
          <Button asChild size={'lg'}>
            <Link href="/chat">Start Chatting</Link>
          </Button>
        ) : (
          <Button asChild size={'lg'}>
            <Link href="/signin">Get Started</Link>
          </Button>
        )}
      </section>

      <main className="m-auto my-10 flex max-w-xl flex-col items-center gap-8 sm:items-start md:max-w-[1000px] xl:max-w-[1300px]">
        {/* Features */}
        <section
          id="features"
          className="flex w-full flex-col items-center gap-4"
        >
          <h1 className="text-2xl font-bold">Features</h1>

          <div className="grid w-full gap-4 px-5 md:grid-cols-3 md:gap-8">
            <Card className="bg-popover text-background -z-20 mt-5 w-full">
              <CardHeader className="relative pt-10 text-center text-xl">
                <div className="bg-secondary border-secondary-foreground absolute top-0 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full border">
                  <FileClock className="text-secondary-foreground m-4 size-8" />
                </div>
                <CardTitle className="mt-3">Time Table</CardTitle>
                <CardDescription className="text-background/80">
                  View train times and schedules.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-3" />
                <ul className="ml-6 list-disc">
                  <li>View train times and schedules.</li>
                  <li>See information about your train&apos;s arrival time.</li>
                  <li>View up-to-date seasonal schedules.</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-popover text-background -z-20 mt-5 w-full">
              <CardHeader className="relative pt-10 text-center text-xl">
                <div className="bg-secondary border-secondary-foreground absolute top-0 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full border">
                  <MessagesSquare className="text-secondary-foreground m-4 size-8" />
                </div>
                <CardTitle className="mt-3">Chat</CardTitle>
                <CardDescription className="text-background/80">
                  Chat with others users in the same station or train.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-3" />
                <ul className="ml-6 list-disc">
                  <li>Chat with other users in the same station.</li>
                  <li>Chat with other users in the same train.</li>
                  <li>Connect with other commuters.</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-popover text-background -z-20 mt-5 w-full">
              <CardHeader className="relative pt-10 text-center text-xl">
                <div className="bg-secondary border-secondary-foreground absolute top-0 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full border">
                  <AlertTriangle className="text-secondary-foreground m-4 size-8" />
                </div>
                <CardTitle className="mt-3">Alerts</CardTitle>
                <CardDescription className="text-background/80">
                  Get MBTA alerts, even when you&apos;re chatting!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-3" />
                <ul className="ml-6 list-disc">
                  <li>Receive detailed alerts straight from the MBTA.</li>
                  <li>Get notified of delays and cancellations.</li>
                  <li>Receive alerts about your trip while chatting.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
