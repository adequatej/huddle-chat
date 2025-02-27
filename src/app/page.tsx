import { Header } from '@/components/Header';
import RequireOnboarding from '@/components/RequireOnboarding';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  FileClock,
  MessagesSquare,
  ArrowRight,
} from 'lucide-react';
import { auth } from './auth';
import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { TechnologiesSection } from '@/components/TechnologiesSection';
import { FeatureCard } from '@/components/FeatureCard';

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

export default async function Home() {
  const session = await auth();

  return (
    <RequireOnboarding>
      <Header />
      {/* Desktop landing */}
      <section className="relative hidden md:block">
        <div className="bg-secondary/95 text-secondary-foreground hover:bg-secondary/90 group mt-10 hidden h-[600px] w-1/2 max-w-2xl rounded-tr-[40%] rounded-br-[40%] px-10 backdrop-blur-sm transition-all duration-500 lg:flex lg:flex-col lg:items-start lg:justify-center">
          <div className="relative">
            <Image
              src="/logo.svg"
              alt="Logo"
              className="animate-slide-in mb-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
              width={100}
              height={100}
            />
            <div className="bg-secondary/20 absolute inset-0 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          <h1 className="animate-slide-in relative text-6xl font-bold tracking-tight">
            Huddle Chat
            <div className="bg-secondary/20 absolute -inset-x-6 -inset-y-3 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
          </h1>
          <p className="animate-slide-in my-8 max-w-md text-lg leading-relaxed opacity-90 transition-opacity delay-100 duration-500 group-hover:opacity-100">
            A chat app for commuters to chat with others in the same station or
            train. Connect, share, and make your commute more engaging.
          </p>
          {!!session ? (
            <Button
              asChild
              size={'lg'}
              className="animate-fade-in group/btn relative overflow-hidden delay-200"
            >
              <Link href="/chat" className="flex items-center gap-2">
                Start Chatting
                <MessagesSquare className="size-5 transition-transform duration-500 group-hover/btn:rotate-12" />
                <div className="absolute inset-0 bg-white/20 opacity-0 blur-xl transition-opacity duration-500 group-hover/btn:opacity-100" />
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              size={'lg'}
              className="animate-fade-in group/btn relative overflow-hidden delay-200"
            >
              <Link href="/signin" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="size-5 transition-transform duration-500 group-hover/btn:translate-x-1" />
                <div className="absolute inset-0 bg-white/20 opacity-0 blur-xl transition-opacity duration-500 group-hover/btn:opacity-100" />
              </Link>
            </Button>
          )}
        </div>
        <Image
          src="/insideTrain.jpg"
          alt="Inside a train"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="absolute -z-10 scale-100 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="from-background/80 via-background/50 absolute inset-0 -z-10 bg-gradient-to-r to-transparent" />
      </section>

      {/* Mobile landing */}
      <section className="bg-secondary mt-16 flex flex-col items-center gap-6 rounded-br-[2.5rem] rounded-bl-[2.5rem] px-6 py-8 md:hidden">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            className="animate-slide-in -mt-4 mb-6 transition-transform duration-500"
            width={70}
            height={70}
            priority
          />

          <h1 className="text-secondary-foreground text-center text-4xl font-bold">
            Huddle Chat
          </h1>

          <p className="text-secondary-foreground/90 mt-4 max-w-sm text-center text-lg">
            A chat app for commuters to chat with others in the same station or
            train.
          </p>
        </div>

        <div className="mt-2 flex w-full max-w-[200px] flex-col items-center gap-3">
          {!!session ? (
            <Button asChild size="default" className="w-full">
              <Link
                href="/chat"
                className="flex items-center justify-center gap-2"
              >
                Start Chatting
                <MessagesSquare className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="default" className="w-full">
              <Link
                href="/signin"
                className="flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      </section>

      <main className="m-auto my-10 flex max-w-xl flex-col items-center gap-8 sm:items-start md:max-w-[1000px] xl:max-w-[1300px]">
        <div className="flex w-full flex-col items-start gap-5 md:flex-row">
          {/* About the project */}
          <section id="about" className="flex w-full flex-col gap-4 p-6">
            <h1 className="mb-2 text-2xl font-bold">About the Project</h1>
            <p className="text-base">
              <strong>Huddle Chat</strong> is a chat app that transforms your
              daily commute by connecting you with fellow travelers in
              real-time. Whether you&apos;re waiting at a station or riding the
              train, our app creates a community space for commuters.
            </p>
            <p className="text-base">
              After signing in and allowing location permissions, you can
              instantly connect with others on your route. The app provides live
              MBTA updates, ensuring you&apos;re always informed about schedules
              and service changes.
            </p>
            <h2 className="mt-6 text-xl font-bold">Our Mission</h2>
            <p className="text-base">
              We believe that commuting shouldn&apos;t be a solitary experience.
              By connecting commuters, we&apos;re building a community that
              makes daily travel more engaging and informative.
            </p>
            <h2 className="mt-6 text-xl font-bold">Privacy & Security</h2>
            <p className="mb-4 text-base">
              Built with modern web technologies and designed for reliability,
              Huddle Chat prioritizes both user experience and privacy. Location
              sharing is used only to connect you with relevant chat rooms, and
              you maintain full control over your visibility settings.
            </p>
          </section>

          {/* Right Column */}
          <div className="flex w-full flex-col gap-8 p-6">
            {/* About the developers */}
            <section id="the-team" className="flex w-full flex-col gap-4">
              <h1 className="text-2xl font-bold">The Team</h1>
              <p className="mb-4 text-base">
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
              <div className="grid grid-cols-3 gap-x-12 gap-y-6">
                {developers.map((dev) => (
                  <div key={dev.username} className="flex items-center gap-4">
                    <Image
                      src={dev.avatar}
                      alt={`${dev.name}`}
                      width={65}
                      height={65}
                      className="rounded-full border"
                    />
                    <div>
                      <p className="text-sm font-medium">{dev.name}</p>
                      <Link
                        href={`https://github.com/${dev.username}`}
                        target="_blank"
                        className="text-foreground/75 hover:text-foreground/100 text-xs hover:underline"
                      >
                        {dev.username}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Technologies Used */}
            <section id="technologies" className="flex w-full flex-col gap-4">
              <h2 className="text-2xl font-bold">Technologies Used</h2>
              <TechnologiesSection />
            </section>
          </div>
        </div>

        {/* Features */}
        <section
          id="features"
          className="flex w-full flex-col items-center gap-6"
        >
          <h1 className="text-2xl font-bold">Features</h1>

          <div className="grid w-full gap-6 px-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<FileClock className="text-background size-6" />}
              title="Time Table"
              description="Real-time schedules and updates"
              features={[
                'View upcoming train arrivals',
                'Track your regular routes',
                'Get schedule changes instantly',
              ]}
            />
            <FeatureCard
              icon={<MessagesSquare className="text-background size-6" />}
              title="Chat"
              description="Connect with fellow commuters"
              features={[
                'Join station chat rooms',
                'Message others on your train',
                'Build commuter connections',
              ]}
            />
            <FeatureCard
              icon={<AlertTriangle className="text-background size-6" />}
              title="Alerts"
              description="Important MBTA updates"
              features={[
                'Get service alerts instantly',
                'Receive delay notifications',
                'Stay informed while chatting',
              ]}
            />
          </div>
        </section>
      </main>
      <Footer />
    </RequireOnboarding>
  );
}
