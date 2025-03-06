import { TrainSchedule } from '@/components/TrainSchedule';
import { Header } from '@/components/Header';

export default function TimeTablePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-8 pt-20">
        <TrainSchedule />
      </main>
    </>
  );
}
