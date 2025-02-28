import { TrainSchedule } from '@/components/TrainSchedule';
import { Header } from '@/components/Header';

// Will change to replicate mockup better 
export default function TimeTablePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-8">
        <TrainSchedule />
      </main>
    </>
  );
}
