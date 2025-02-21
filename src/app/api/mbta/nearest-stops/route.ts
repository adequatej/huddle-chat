import { auth } from '@/app/auth';
import requestMbta from '@/lib/mbta/request';
import { getStopsSortedByDistance } from '@/lib/mbta/objectsByDistance';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Get long, lat, and acc query parameters
  const long = Number(req.nextUrl.searchParams.get('lon'));
  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const acc = Number(req.nextUrl.searchParams.get('acc'));

  // Check if query parameters are valid
  if (!long || !lat || !acc || isNaN(long) || isNaN(lat) || isNaN(acc)) {
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
    `/stops?page[limit]=5&filter[latitude]=${lat}&filter[longitude]=${long}&filter[route_type]=2`,
    session.user,
  );

  // Sort commuter trains by distance
  const sortedStops = await getStopsSortedByDistance(nearestStops, {
    lat,
    long,
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
