import { redirect } from 'next/navigation';
import { auth } from '@/app/auth';
import { getUserByEmail } from '@/lib/user';
import PreferencesForm from '@/components/PreferencesForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Simple page to display the preferences form, can add more preferences later
export default async function PreferencesPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/signin');

  const user = await getUserByEmail(session.user.email);
  if (!user) redirect('/signin');

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Your Preferences</h1>
      </div>
      <PreferencesForm
        initialPreferences={user.preferences ?? { notifications: false }}
      />
    </div>
  );
}
