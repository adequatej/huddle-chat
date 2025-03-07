import { TrainSchedule } from '@/components/TrainSchedule';
import { Header } from '@/components/Header';
import type { Metadata } from 'next';
import { auth } from '../auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Huddle Chat - Time Table',
  description: 'Check the MBTA train schedule through Huddle Chat!',
  openGraph: {
    type: 'website',
    url: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    title: 'Huddle Chat - Time Table',
    description: 'Check the MBTA train schedule through Huddle Chat!',
  },
};

export default async function TimeTablePage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/signin');
  return (
    <>
      <Header />
      <main className="container mx-auto p-8 pt-20">
        <TrainSchedule />
      </main>
    </>
  );
}
