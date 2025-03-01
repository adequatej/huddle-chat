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

  try {
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

    // Fetch real-time predictions for each stop with error handling
    const stopsWithPredictions = await Promise.all(
      sortedStops.map(async (stop) => {
        try {
          const predictions = await requestMbta(
            `/predictions?filter[route_type]=2&filter[stop]=${stop.id}`,
            session.user,
          );
          return { ...stop, predictions }; // Attach predictions to stop
        } catch (error) {
          console.error(
            `Failed to fetch predictions for stop ${stop.id}:`,
            error,
          );
          return { ...stop, predictions: [] }; // Return stop with empty predictions instead of crashing
        }
      }),
    );

    return NextResponse.json(stopsWithPredictions);
  } catch (error) {
    console.error('Failed to fetch stops:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve train stops. Please try again later.' },
      { status: 500 },
    );
  }
}
// get list of routes
// Get list of
// cache routes
// make request to get name of stop
