import { auth } from '@/app/auth';
import requestMbta from '@/lib/mbta/request';
import { MBTAAPIVehicle } from '@/lib/types/mbta';
import { NextResponse } from 'next/server';

export async function GET() {
  // Check for authenticated user
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get current commuter rail vehicles
  // Filters:
  // - route type is commuter rail
  const vehicles = (await requestMbta(
    `/vehicles?filter[route_type]=2&filter[revenue]=REVENUE`,
    session.user,
  )) as MBTAAPIVehicle[];

  return NextResponse.json(
    vehicles.map((vehicle) => ({
      id: vehicle.id,
      ...vehicle.attributes,
    })),
  );
}
