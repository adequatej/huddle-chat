import { auth } from '@/app/auth';
import requestMbta from '@/lib/mbta/request';
import { MBTAAPIVehicle } from '@/lib/types/mbta';
import { User } from '@/lib/types/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ routeId: string }> },
) {
  // Check for authenticated user
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = session.user as User;

  // Get routeId from path
  const { routeId } = await params;

  try {
    // Get vehicles for the specified route
    const vehicles = (await requestMbta(
      `/vehicles?filter[route]=${routeId}&filter[revenue]=REVENUE`,
      user,
    )) as (MBTAAPIVehicle & { name: string })[];

    await Promise.all(
      vehicles.map(async (train) => {
        // Get train trip name
        const tripId = train.relationships?.trip.data.id;
        const tripReq = await requestMbta(`/trips/${tripId}`, user);
        console.log('tripReq', tripReq);
        train.name = tripReq.attributes.name || train.id;
      }),
    );

    return NextResponse.json(
      vehicles.map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
        ...vehicle.attributes,
      })),
    );
  } catch (error) {
    console.error(`Error fetching vehicles for route ${routeId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles for route' },
      { status: 500 },
    );
  }
}
