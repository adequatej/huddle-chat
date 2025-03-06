import { redirect } from 'next/navigation';
import { auth } from '@/app/auth';
import { getUserByEmail } from '@/lib/user';
import PreferencesForm from '@/components/PreferencesForm';
import ProfileForm from '@/components/ProfileForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { ArrowLeft, User, Settings } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Huddle Chat - Settings',
  description: 'Update your Huddle Chat profile and preferences.',
  openGraph: {
    type: 'website',
    url: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    title: 'Huddle Chat - Settings',
    description: 'Update your Huddle Chat profile and preferences.',
  },
};

// Simple page to display settings
export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/signin');

  const userFromDb = await getUserByEmail(session.user.email);
  if (!userFromDb) redirect('/signin');

  const user = {
    ...userFromDb,
    _id: userFromDb._id?.toString(),
    createdAt: userFromDb.createdAt?.toISOString(),
  };

  return (
    <div className="container mx-auto p-4 pt-28 sm:p-8">
      <div className="mb-6 flex items-center gap-2 sm:mb-8 sm:gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
      </div>

      <div className="mx-auto max-w-2xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 sm:mb-8">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 text-sm sm:text-base"
            >
              <User className="size-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2 text-sm sm:text-base"
            >
              <Settings className="size-4" />
              <span>Preferences</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 sm:space-y-6">
            <div className="rounded-lg border p-3 sm:p-6">
              <ProfileForm user={user} />
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4 sm:space-y-6">
            <div className="rounded-lg border p-3 sm:p-6">
              <PreferencesForm
                initialPreferences={
                  user.preferences ?? { notifications: false }
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
