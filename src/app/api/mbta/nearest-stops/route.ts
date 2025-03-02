import { auth } from '@/app/auth';
import requestMbta from '@/lib/mbta/request';
import { getStopsSortedByDistance } from '@/lib/mbta/objectsByDistance';
import { NextRequest, NextResponse } from 'next/server';

interface Prediction {
  attributes: {
    arrival_time?: string;
    departure_time?: string;
  };
  relationships?: {
    route?: { data?: { id?: string } };
    vehicle?: { data?: { id?: string } };
  };
}

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
    console.log('Fetching MBTA stops...');
    const nearestStops = await requestMbta(
      `/stops?page[limit]=5&filter[latitude]=${lat}&filter[longitude]=${lon}&filter[radius]=0.01&filter[route_type]=2`,
      session.user,
    );

    console.log('MBTA API Response:', nearestStops);
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
          );
          const predictionList = Array.isArray(predictions?.data)
            ? predictions.data
            : predictions; // Ensure it's an array
          console.log(
            `🔍 Raw Predictions Response for Stop ${stop.id}:`,
            JSON.stringify(predictions, null, 2),
          );

          // Debugging: Log predictions response
          if (!predictionList || predictionList.length === 0) {
            console.warn(`⚠️ No predictions found for stop ${stop.id}`);
            return {
              ...stop,
              arrivalDepartureTimes: [
                { message: 'No trains currently scheduled' },
              ],
            };
          } else {
            console.log(
              `🚆 Predictions for Stop ${stop.id}:`,
              JSON.stringify(predictions, null, 2),
            );
          }

          // Extract relevant prediction data
          const arrivalDepartureTimes = predictionList.map(
            (prediction: Prediction) => ({
              arrivalTime: prediction.attributes?.arrival_time || 'Unknown',
              departureTime: prediction.attributes?.departure_time || 'Unknown',
              route:
                prediction.relationships?.route?.data?.id || 'Unknown Route',
              vehicle:
                prediction.relationships?.vehicle?.data?.id ||
                'No Vehicle Info',
            }),
          );

          return { ...stop, arrivalDepartureTimes };
        } catch (error) {
          console.error(
            `Failed to fetch predictions for stop ${stop.id}:`,
            error,
          );
          return { ...stop, arrivalDepartureTimes: [] };
        }
      }),
    );

    // Filter stops that have real-time arrival/departure data
    const currentTrains = stopsWithPredictions;

    if (currentTrains.length === 0) {
      return NextResponse.json({
        message: 'No arrival/departure times available',
      });
    }

    return NextResponse.json(currentTrains);
  } catch (error) {
    console.error('Failed to retrieve train stops:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve train stops. Please try again later.' },
      { status: 500 },
    );
  }
}

// get list of routes
// cache routes
// make request to get name of stop
