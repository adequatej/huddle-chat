import { auth } from '@/app/auth';
import requestMbta from '@/lib/mbta/request';
import { getStopsSortedByDistance } from '@/lib/mbta/objectsByDistance';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/types/user';

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
  const user = session.user as User;

  const errorMultiplier = 5;
  const minRadius = 0.01; // Half a mile minimum radius

  // Convert accuracy radius to degrees according to MBTA calculations
  const degrees = (
    acc * errorMultiplier * (0.02 / 1609.34) +
    minRadius
  ).toFixed(4);

  // Get current commuter trains
  // Filters:
  // - limit to 5 stops
  // - route type is commuter rail
  // - latitude and longitude are set
  const nearestStops = await requestMbta(
    `/stops?page[limit]=5&filter[latitude]=${lat}&filter[longitude]=${lon}&filter[radius]=${degrees}&filter[route_type]=2`,
    user,
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
