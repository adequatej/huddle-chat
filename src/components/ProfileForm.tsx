'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { Separator } from '@/components/ui/separator';
import { Camera, User } from 'lucide-react';

type ProfileFormProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const { update: updateSession } = useSession();
  const [profile, setProfile] = useState({
    name: user.name,
    image: user.image || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) throw new Error('Failed to save profile');

      // Update the session with new user data
      await updateSession({
        ...user,
        name: profile.name,
        image: profile.image,
      });

      toast.success('Profile saved successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Profile</h2>
          <p className="text-muted-foreground text-sm">
            Manage your profile information
          </p>
        </div>
        <Button type="submit" size="sm">
          Save Changes
        </Button>
      </div>

      <Separator className="my-6" />

      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Avatar className="size-24 border-2">
              <AvatarImage src={profile.image} />
              <AvatarFallback className="text-lg">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="bg-background text-muted-foreground absolute -right-2 -bottom-2 rounded-full border p-1.5">
              <Camera className="size-4" />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Profile Picture</Label>
              <div className="flex space-x-2">
                <Input
                  id="image"
                  value={profile.image}
                  onChange={(e) =>
                    setProfile({ ...profile, image: e.target.value })
                  }
                  placeholder="https://example.com/your-image.jpg"
                  className="flex-1"
                />
              </div>
              <p className="text-muted-foreground text-sm">
                Enter a URL for your profile picture
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card hover:bg-accent/5 rounded-lg border p-4 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 text-primary rounded-full p-2">
              <User className="size-4" />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-base font-medium">Display Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                placeholder="Your name"
                required
                className="mt-2"
              />
              <p className="text-muted-foreground text-sm">
                This is how your name will appear to other users
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
