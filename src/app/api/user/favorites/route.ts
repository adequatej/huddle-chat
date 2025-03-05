import { auth } from '@/app/auth';
import { getUserByEmail, updateUserPreferences } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

// Get user's favorite trains
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      favorites: user.preferences?.favoriteTrains || [],
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 },
    );
  }
}

// Update user's favorite trains
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { favorites } = await request.json();

    if (!Array.isArray(favorites)) {
      return NextResponse.json(
        { error: 'Invalid favorites format' },
        { status: 400 },
      );
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user preferences with new favorites
    const preferences = user.preferences || { notifications: false };
    await updateUserPreferences(session.user.email, {
      ...preferences,
      favoriteTrains: favorites,
    });

    return NextResponse.json({ success: true, favorites });
  } catch (error) {
    console.error('Error updating favorites:', error);
    return NextResponse.json(
      { error: 'Failed to update favorites' },
      { status: 500 },
    );
  }
}

// Add or remove a single favorite
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { trainId, action } = await request.json();

    if (!trainId || !['add', 'remove'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 },
      );
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get current favorites or initialize empty array
    const preferences = user.preferences || { notifications: false };
    const currentFavorites = preferences.favoriteTrains || [];

    // Update favorites based on action
    let updatedFavorites: string[];
    if (action === 'add' && !currentFavorites.includes(trainId)) {
      updatedFavorites = [...currentFavorites, trainId];
    } else if (action === 'remove') {
      updatedFavorites = currentFavorites.filter((id) => id !== trainId);
    } else {
      updatedFavorites = currentFavorites;
    }

    // Update user preferences
    await updateUserPreferences(session.user.email, {
      ...preferences,
      favoriteTrains: updatedFavorites,
    });

    return NextResponse.json({
      success: true,
      favorites: updatedFavorites,
    });
  } catch (error) {
    console.error('Error updating favorite:', error);
    return NextResponse.json(
      { error: 'Failed to update favorite' },
      { status: 500 },
    );
  }
}
