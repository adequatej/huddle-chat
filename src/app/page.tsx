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
import { Footer } from '@/components/Footer';
import { ReactElement } from 'react';
import { cn } from '@/lib/utils';

const developers = [
  {
    name: 'Jed Geoghegan',
    username: 'adequatej',
    avatar: 'https://avatars.githubusercontent.com/u/124700731',
  },
  {
    name: 'Leo Hirano',
    username: 'notLeoHirano',
    avatar: 'https://avatars.githubusercontent.com/u/66753378',
  },
  {
    name: 'Benson Lin',
    username: 'Zirins',
    avatar: 'https://avatars.githubusercontent.com/u/103547549',
  },
  {
    name: 'Daniel Stoiber',
    username: 'da-stoi',
    avatar: 'https://avatars.githubusercontent.com/u/20031472?v=4',
  },
  {
    name: 'Bryan Suria',
    username: 'BSuria',
    avatar: 'https://avatars.githubusercontent.com/u/93815781',
  },
];

function FeatureCard({
  icon,
  title,
  description,
  features,
}: {
  icon: ReactElement;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <Card className="bg-popover text-background -z-20 mt-8 w-full">
      <CardHeader className="relative pt-10 text-center text-xl">
        <div className="bg-secondary border-secondary-foreground absolute top-0 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full border">
          {icon}
        </div>
        <CardTitle className="mt-3">{title}</CardTitle>
        <CardDescription className="text-background/80">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-3" />
        <ul className="ml-6 list-disc">
          {features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default async function Home() {
  const session = await auth();

  return (
    <>
      <Header />
      {/* Desktop landing */}
      <section className="relative hidden md:block">
        <div className="bg-secondary text-secondary-foreground mt-10 hidden h-[600px] w-1/2 max-w-2xl rounded-tr-[40%] rounded-br-[40%] px-10 lg:flex lg:flex-col lg:items-start lg:justify-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            className="animate-slide-in mb-2"
            width={100}
            height={100}
          />
          <h1 className="animate-slide-in text-5xl font-bold tracking-tight">
            Huddle Chat
          </h1>
          <p className="animate-slide-in my-5 delay-100">
            A chat app for commuters to chat with others in the same station or
            train.
          </p>
          {!!session ? (
            <Button asChild size={'lg'} className="animate-fade-in delay-200">
              <Link href="/chat">Start Chatting</Link>
            </Button>
          ) : (
            <Button asChild size={'lg'} className="animate-fade-in delay-200">
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
        <h1 className="text-secondary-foreground text-center text-5xl font-bold">
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
        <div className="flex w-full flex-col items-center gap-5 md:flex-row">
          {/* About the project */}
          <section
            id="about"
            className="flex w-full flex-col items-center gap-4 p-10"
          >
            <h1 className="text-2xl font-bold">About the Project</h1>
            <p className="indent-8">
              <strong>Huddle Chat</strong> is a chat app for commuters to chat
              with others in the same station or train. It also provides train
              schedules and alerts from the MBTA.
            </p>
            <p>
              After signing in and allowing location permissions, users can chat
              with other on the same train or waiting at the same stop.
            </p>
            <h2 className="mt-4 text-xl font-bold">Technologies Used</h2>
            <div className="flex flex-row gap-4 sm:gap-10">
              <ul className="ml-6 list-disc">
                <li>Typescript</li>
                <li>MongoDB</li>
                <li>Auth.js</li>
                <li>MBTA API</li>
              </ul>
              <ul className="ml-6 list-disc">
                <li>Next.js</li>
                <li>Shadcn/ui</li>
                <li>TailwindCSS</li>
                <li>Lucide</li>
              </ul>
              <ul className="ml-6 list-disc">
                <li>ESLint</li>
                <li>Prettier</li>
                <li>Husky</li>
                <li>And more...</li>
              </ul>
            </div>
          </section>

          {/* About the developers */}
          <section
            id="the-team"
            className="flex w-full flex-col items-center gap-4 p-5"
          >
            <h1 className="text-2xl font-bold">The Team</h1>
            <p className="indent-8">
              The app was created by a team of five students as part of a
              project for the class <em>CS4241</em> as part of the{' '}
              <Link
                href="https://www.wpi.edu/academics/departments/computer-science"
                target="_blank"
                className="text-foreground/75 hover:text-foreground/100 hover:underline"
              >
                WPI Computer Science program
              </Link>
              .
            </p>
            <div className="m-auto my-2 flex flex-col items-center">
              {developers.map((dev, i) => (
                <div
                  className={cn(
                    '-my-2 flex w-full items-center',
                    i % 2 === 0 ? 'mr-18 justify-start' : 'ml-18 justify-end',
                  )}
                  key={i}
                >
                  {i % 2 === 0 && (
                    <Image
                      src={dev.avatar}
                      alt={`${dev.name} (${dev.username})`}
                      width={65}
                      height={65}
                      className="rounded-full border"
                    />
                  )}
                  <p
                    className={cn('mx-4 my-auto', i % 2 === 1 && 'text-right')}
                  >
                    <strong>{dev.name}</strong>
                    <br />
                    <Link
                      href={`https://github.com/${dev.username}`}
                      target="_blank"
                      className="text-foreground/75 hover:text-foreground/100 underline"
                    >
                      {dev.username}
                    </Link>
                  </p>
                  {i % 2 === 1 && (
                    <Image
                      src={dev.avatar}
                      alt={`${dev.name} (${dev.username})`}
                      width={65}
                      height={65}
                      className="rounded-full border"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Features */}
        <section
          id="features"
          className="flex w-full flex-col items-center gap-4"
        >
          <h1 className="text-2xl font-bold">Features</h1>

          <div className="grid w-full gap-4 px-5 md:grid-cols-3 md:gap-8">
            <FeatureCard
              icon={
                <FileClock className="text-secondary-foreground m-4 size-8" />
              }
              title={'Time Table'}
              description={'View train times and schedules.'}
              features={[
                'View train times and schedules.',
                "See information about your train's arrival time.",
                'View up-to-date seasonal schedules.',
              ]}
            />
            <FeatureCard
              icon={
                <MessagesSquare className="text-secondary-foreground m-4 size-8" />
              }
              title={'Chat'}
              description={
                'Chat with others users in the same station or train.'
              }
              features={[
                'Chat with other users in the same station.',
                'Chat with other users in the same train.',
                'Connect with other commuters.',
              ]}
            />
            <FeatureCard
              icon={
                <AlertTriangle className="text-secondary-foreground m-4 size-8" />
              }
              title={'Alerts'}
              description={"Get MBTA alerts, even when you're chatting!"}
              features={[
                'Receive detailed alerts straight from the MBTA.',
                'Get notified of delays and cancellations.',
                'Receive alerts about your trip while chatting.',
              ]}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
