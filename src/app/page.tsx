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
