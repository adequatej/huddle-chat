import { auth } from '@/app/auth';
import requestMbta from '@/lib/mbta/request';
import { getVehiclesSortedByDistance } from '@/lib/mbta/objectsByDistance';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Get long, lat, and acc query parameters
  const lon = Number(req.nextUrl.searchParams.get('lon'));
  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const acc = Number(req.nextUrl.searchParams.get('acc'));

  // Check if query parameters are valid
  if (!lon || !lat || !acc || isNaN(lon) || isNaN(lat) || isNaN(acc)) {
    return NextResponse.json(
      { error: 'Invalid query parameters' },
      { status: 400 },
    );
  }

  // Check for authenticated user
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get current commuter trains
  // Filters:
  // - route type is commuter rail
  // - vehicle is in revenue service (not out of service)
  const currCommuterTrains = await requestMbta(
    `/vehicles?filter[route_type]=2&filter[revenue]=REVENUE`,
    session.user,
  );

  // Sort commuter trains by distance
  const nearestCommuterTrains = await getVehiclesSortedByDistance(
    currCommuterTrains,
    { lat, lon, acc },
  );

  // Return the closest commuter trains, trimming unused data
  return NextResponse.json(
    nearestCommuterTrains.map((train) => ({
      id: train.id,
      distance: train.distance,
      attributes: train.attributes,
    })),
  );
}
