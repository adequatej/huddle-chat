import { auth } from '@/app/auth';
import requestMbta from '@/lib/mbta/request';
import { getStopsSortedByDistance } from '@/lib/mbta/objectsByDistance';
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
  // - limit to 5 stops
  // - route type is commuter rail
  // - latitude and longitude are set
  const nearestStops = await requestMbta(
    `/stops?page[limit]=5&filter[latitude]=${lat}&filter[longitude]=${lon}&filter[route_type]=2`,
    session.user,
  );

  // Sort commuter trains by distance
  const sortedStops = await getStopsSortedByDistance(nearestStops, {
    lat,
    lon,
    acc,
  });

  // Return the closest commuter trains, trimming unused data
  return NextResponse.json(
    sortedStops.map((train) => ({
      id: train.id,
      distance: train.distance,
      attributes: train.attributes,
    })),
  );
}
