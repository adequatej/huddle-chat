'use client';

import { useState } from 'react';
import { UserPreferences } from '@/lib/types/user';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, BellOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type PreferencesFormProps = {
  initialPreferences: UserPreferences;
};

export default function PreferencesForm({
  initialPreferences,
}: PreferencesFormProps) {
  const [preferences, setPreferences] = useState(initialPreferences);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) throw new Error('Failed to save settings');
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Preferences</h2>
          <p className="text-muted-foreground text-sm">
            Manage your notification settings and preferences
          </p>
        </div>
        <Button type="submit" size="sm">
          Save Changes
        </Button>
      </div>

      <Separator className="my-6" />

      <div className="space-y-6">
        <div className="bg-card hover:bg-accent/5 rounded-lg border p-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`rounded-full p-2 ${preferences.notifications ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
              >
                {preferences.notifications ? (
                  <Bell className="size-4" />
                ) : (
                  <BellOff className="size-4" />
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-base font-medium">Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Receive updates about activity and announcements
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.notifications}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  notifications: checked,
                })
              }
            />
          </div>
        </div>
      </div>
    </form>
  );
}
