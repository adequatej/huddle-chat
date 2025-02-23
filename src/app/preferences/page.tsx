import { redirect } from 'next/navigation';
import { auth } from '@/app/auth';
import { getUserByEmail } from '@/lib/user';
import PreferencesForm from '@/components/PreferencesForm';

// Simple page to display the preferences form, can add more preferences later
export default async function PreferencesPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/signin');

  const user = await getUserByEmail(session.user.email);
  if (!user) redirect('/signin');

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Your Preferences</h1>
      <PreferencesForm initialPreferences={user.preferences} />
    </div>
  );
}
