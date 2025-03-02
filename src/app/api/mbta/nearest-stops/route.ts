import { auth } from '@/app/auth';
import requestMbta from '@/lib/mbta/request';
import { MBTAAPISchedule } from '@/lib/types/mbta';
import { NextResponse } from 'next/server';

type MBTAStopAttributes = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  municipality: string;
  platform_name?: string;
  wheelchair_boarding?: number;
};

// Cache for stop info to avoid redundant API calls
const stopCache: Map<string, MBTAStopAttributes> = new Map();

// Fetch stop info (with caching)
async function getStopInfo(stopId: string): Promise<MBTAStopAttributes> {
  if (stopCache.has(stopId)) {
    return stopCache.get(stopId)!; // Return cached stop info
  }

  const response = await requestMbta(`/stops/${stopId}`);
  if (!response || !response.attributes) {
    throw new Error(`Failed to fetch stop info for ID: ${stopId}`);
  }

  stopCache.set(stopId, response.attributes); // Cache response
  return response.attributes;
}

// Fetch schedules for multiple trips in one request
async function fetchBatchSchedules(
  tripIds: string[],
): Promise<MBTAAPISchedule[]> {
  if (tripIds.length === 0) return [];

  const path = `/schedules?filter[trip]=${tripIds.join(',')}`;
  const response = await requestMbta(path);

  return response || [];
}

// Process schedules and get the closest stop sequence
function processSchedules(
  schedules: MBTAAPISchedule[],
  stopId: string,
  date: string,
): MBTAAPISchedule[] {
  if (!schedules.length) return [];

  let closestSchedule = schedules[0];
  let minDiff = Number.MAX_VALUE;

  for (const schedule of schedules) {
    if (!schedule.attributes.departure_time) continue; // Skip if no departure time

    const timeDiff = Math.abs(
      new Date(schedule.attributes.departure_time).getTime() -
        new Date(date).getTime(),
    );
    if (timeDiff < minDiff) {
      closestSchedule = schedule;
      minDiff = timeDiff;
    }
  }

  // Get surrounding stops
  const stopSequence = closestSchedule.attributes.stop_sequence;
  const previousStops = schedules.filter(
    (s) => s.attributes.stop_sequence < stopSequence,
  );
  const nextStops = schedules.filter(
    (s) => s.attributes.stop_sequence > stopSequence,
  );

  return [...previousStops, closestSchedule, ...nextStops];
}

// Main API function
export async function GET() {
  // Authenticate user
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🚆 Fetching current commuter rail vehicles...');

    // Fetch only active commuter rail vehicles
    const vehicles = await requestMbta(
      `/vehicles?filter[route_type]=2&filter[revenue]=REVENUE`,
      session.user,
    );

    if (!vehicles.length) {
      return NextResponse.json({ message: 'No active vehicles found.' });
    }

    // Extract trip IDs for batch request
    // Extract trip IDs for batch request
    const tripIds = vehicles.map(
      (v: { relationships: { trip: { data: { id: string } } } }) =>
        v.relationships.trip.data.id,
    );
    console.log(`🔄 Fetching batch schedules for ${tripIds.length} trips...`);

    // Fetch schedules for all trips at once
    const allSchedules = await fetchBatchSchedules(tripIds);

    // Process schedules for each vehicle
    const vehicleData = await Promise.all(
      vehicles.map(
        async (vehicle: {
          id: string;
          relationships: {
            trip: { data: { id: string } };
            stop: { data: { id: string } };
          };
          attributes: {
            updated_at: string;
            direction_id: number;
            latitude: number;
            longitude: number;
            current_status: string;
          };
        }) => {
          const schedules = allSchedules.filter(
            (s) =>
              s.relationships.trip.data.id ===
              vehicle.relationships.trip.data.id,
          );

          if (!schedules.length) return null;

          // Process schedule for the vehicle's current stop
          const stopId = vehicle.relationships.stop.data.id;
          const processedSchedules = processSchedules(
            schedules,
            stopId,
            new Date().toISOString(),
          );

          // Fetch stop info for the current stop
          const currentStopInfo = await getStopInfo(stopId);

          // Fetch stop info for all scheduled stops in parallel
          const stops = await Promise.all(
            processedSchedules.map(async (schedule) => {
              const stopDetails = await getStopInfo(
                schedule.relationships.stop.data.id,
              );
              return {
                id: schedule.id,
                arrivalTime: schedule.attributes.arrival_time,
                departureTime: schedule.attributes.departure_time,
                stopSequence: schedule.attributes.stop_sequence,
                name: stopDetails.name,
                description: stopDetails.description,
                municipality: stopDetails.municipality,
                platformName: stopDetails.platform_name,
                latitude: stopDetails.latitude,
                longitude: stopDetails.longitude,
                wheelchairBoarding: stopDetails.wheelchair_boarding,
              };
            }),
          );

          return {
            id: vehicle.id,
            updatedAt: vehicle.attributes.updated_at,
            directionId: vehicle.attributes.direction_id,
            latitude: vehicle.attributes.latitude,
            longitude: vehicle.attributes.longitude,
            currentStatus: vehicle.attributes.current_status,
            currentStop: {
              id: stopId,
              name: currentStopInfo.name,
              description: currentStopInfo.description,
              municipality: currentStopInfo.municipality,
              platformName: currentStopInfo.platform_name,
              latitude: currentStopInfo.latitude,
              longitude: currentStopInfo.longitude,
            },
            stops,
          };
        },
      ),
    );

    return NextResponse.json(vehicleData.filter(Boolean)); // Remove null results
  } catch (error) {
    console.error('❌ Error fetching vehicle schedules:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve data.' },
      { status: 500 },
    );
  }
}
