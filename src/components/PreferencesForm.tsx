'use client';

import { useState } from 'react';
import { UserPreferences } from '@/lib/types/user';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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

      if (!response.ok) throw new Error('Failed to save preferences');
      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="notifications"
          checked={preferences.notifications}
          onCheckedChange={(checked: boolean) =>
            setPreferences({
              ...preferences,
              notifications: checked,
            })
          }
        />
        <Label htmlFor="notifications">Enable Notifications</Label>
      </div>
      <Button type="submit">Save Preferences</Button>
    </form>
  );
}
