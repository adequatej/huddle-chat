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

    // Update preferences including onboarded status
    await updateUserPreferences(session.user.email, {
      ...preferences,
      onboarded: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
    });
  } catch (error) {
    console.error('Failed to complete onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 },
    );
  }
}
