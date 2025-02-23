'use client';

import { useState } from 'react';
import { User } from '@/lib/user';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type PreferencesFormProps = {
  initialPreferences: User['preferences'];
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
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={preferences?.notifications}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                notifications: e.target.checked,
              })
            }
          />
          Enable Notifications
        </label>
      </div>
      <Button type="submit">Save Preferences</Button>
    </form>
  );
}
