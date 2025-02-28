import { redirect } from 'next/navigation';
import { auth } from '@/app/auth';
import { getUserByEmail } from '@/lib/user';
import PreferencesForm from '@/components/PreferencesForm';
import ProfileForm from '@/components/ProfileForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { ArrowLeft, User, Settings } from 'lucide-react';

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
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="mx-auto max-w-2xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="size-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2"
            >
              <Settings className="size-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="rounded-lg border p-6">
              <ProfileForm user={user} />
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="rounded-lg border p-6">
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
