import { auth } from '@/app/auth';
import { updateUserPreferences } from '@/lib/user';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { preferences } = await request.json();
    await updateUserPreferences(session.user.email, preferences);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 },
    );
  }
}
