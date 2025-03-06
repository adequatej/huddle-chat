import { auth } from '@/app/auth';
import requestMbta from '@/lib/mbta/request';
import { MBTAAPIRoute } from '@/lib/types/mbta';
import { User } from '@/lib/types/user';
import { NextResponse } from 'next/server';

export async function GET() {
  // Check for authenticated user
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = session.user as User;

  try {
    // Get commuter rail routes
    const routes = (await requestMbta(
      `/routes?filter[type]=2`,
      user,
    )) as MBTAAPIRoute[];

    return NextResponse.json(
      routes.map((route) => ({
        id: route.id,
        name: route.attributes.long_name,
        shortName: route.attributes.short_name,
        description: route.attributes.description,
        color: route.attributes.color,
        textColor: route.attributes.text_color,
        sortOrder: route.attributes.sort_order,
      })),
    );
  } catch (error) {
    console.error('Error fetching routes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routes' },
      { status: 500 },
    );
  }
}
