'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

// Made this page to be used to complete the onboarding process if the user is not onboarded
export default function OnboardingPage() {
  const { update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const completeOnboarding = async () => {
    try {
      setIsLoading(true);
      await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: { notifications } }),
      });

      await update();
      router.replace('/');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold">Welcome to Huddle Chat!</h1>
          <p className="text-muted-foreground">Quick setup</p>
        </CardHeader>

        <CardContent>
          <div className="flex items-start space-x-4 rounded-lg border p-4">
            <Bell className="text-primary mt-1 h-5 w-5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="font-medium">
                  Enable Notifications
                </Label>
                <Checkbox
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={(checked) =>
                    setNotifications(checked as boolean)
                  }
                />
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                Get updates about your transit
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={completeOnboarding}
            disabled={isLoading}
          >
            {isLoading ? 'Setting up...' : 'Complete Setup'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
