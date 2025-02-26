'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This component ensures that the user is onboarded before accessing the main content
export default function RequireOnboarding({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user && session.user.onboarded === false) {
      router.replace('/onboarding');
    }
  }, [session, router]);

  return <>{children}</>;
}
