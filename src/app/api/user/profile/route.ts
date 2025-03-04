import { auth } from '@/app/auth';
import { updateUserProfile } from '@/lib/user';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { profile } = await request.json();
    await updateUserProfile(session.user.email, profile);

    return new NextResponse(
      JSON.stringify({ message: 'Profile updated successfully' }),
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to update profile:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update profile' }),
      { status: 500 },
    );
  }
}
