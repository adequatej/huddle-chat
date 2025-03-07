import requestMbta from '@/lib/mbta/request';
import {
  MBTAAPISchedule,
  MBTAAPIVehicle,
  MBTAStopAttributes,
} from '@/lib/types/mbta';
import { NextRequest, NextResponse } from 'next/server';

// Made a local cache for stop info to avoid redundant API calls
const localStopCache: Map<string, MBTAStopAttributes> = new Map();

// Fetch stop info (with caching)
async function getStopInfo(stopId: string): Promise<MBTAStopAttributes> {
  if (localStopCache.has(stopId)) {
    return localStopCache.get(stopId)!; // Return cached stop info
  }

  const response = await requestMbta(`/stops/${stopId}`);
  if (!response || !response.attributes) {
    throw new Error(`Failed to fetch stop info for ID: ${stopId}`);
  }

  localStopCache.set(stopId, response.attributes); // Cache response
  return response.attributes;
}

async function fetchSchedules(
  route: string,
  trip: string,
  stopId: string,
  date: string,
  directionId: number,
) {
  const path = `/schedules?filter[route]=${route}&filter[trip]=${trip}&filter[direction_id]=${directionId}`;
  const response = await requestMbta(path);
  if (!response) {
    console.error('Error fetching schedules');
    return [];
  }

  const targetTime = new Date(date).getTime();
  let currentStopScheduleIndex = -1;
  let smallestDiff = Infinity;

  // Single pass: Made it a single pass and filtered for matching stopId and track the closest departure time
  for (let i = 0; i < response.length; i++) {
    const schedule = response[i];
    if (schedule.relationships?.stop?.data?.id === stopId) {
      const departureTime = new Date(
        schedule.attributes.departure_time,
      ).getTime();
      const diff = Math.abs(departureTime - targetTime);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        currentStopScheduleIndex = i;
      }
    }
  }

  // If no matching schedule is found, return an empty array.
  if (currentStopScheduleIndex === -1) return [];

  const currentStopSchedule = response[currentStopScheduleIndex];
  let currentStopSequence = currentStopSchedule.attributes.stop_sequence;
  const previousStops = [];
  const nextStops = [];

  // Collect previous stops (traverse backwards)
  for (let i = currentStopScheduleIndex - 1; i >= 0; i--) {
    if (response[i].attributes.stop_sequence < currentStopSequence) {
      previousStops.unshift(response[i]);
      currentStopSequence = response[i].attributes.stop_sequence;
    } else {
      break;
    }
  }

  // Collect next stops (traverse forwards)
  currentStopSequence = currentStopSchedule.attributes.stop_sequence;
  for (let i = currentStopScheduleIndex + 1; i < response.length; i++) {
    if (response[i].attributes.stop_sequence > currentStopSequence) {
      nextStops.push(response[i]);
      currentStopSequence = response[i].attributes.stop_sequence;
    } else {
      break;
    }
  }

  return [...previousStops, currentStopSchedule, ...nextStops];
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ vehicleId: string }> },
) {
  // Get vehicleID slug from path
  const { vehicleId } = await params;

  // Get vehicle from MBTA API
  let vehicle: MBTAAPIVehicle;
  try {
    vehicle = await requestMbta(`/vehicles/${vehicleId}`);
  } catch (error) {
    return NextResponse.json({ error: `${error}` }, { status: 404 });
  }

  // Check if vehicle exists
  if (!vehicle) {
    return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
  }

  // Get vehicles schedules
  const schedules = await fetchSchedules(
    vehicle.relationships.route.data.id,
    vehicle.relationships.trip.data.id,
    vehicle.relationships.stop.data.id,
    new Date().toISOString(),
    vehicle.attributes.direction_id,
  );

  const completeSchedule = await Promise.all(
    schedules.map(async (schedule: MBTAAPISchedule) => {
      const stopInfo = await getStopInfo(schedule.relationships.stop.data.id);

      const obj = {
        id: schedule.id,
        arrivalTime: schedule.attributes.arrival_time,
        departureTime: schedule.attributes.departure_time,
        stopSequence: schedule.attributes.stop_sequence,
        name: stopInfo.name,
        description: stopInfo.description,
        municipality: stopInfo.municipality,
        platformName: stopInfo.platform_name,
        latitude: stopInfo.latitude,
        longitude: stopInfo.longitude,
        wheelchairBoarding: stopInfo.wheelchair_boarding,
      };

      return obj;
    }),
  );

  // Get train trip name
  const tripId = vehicle.relationships?.trip.data.id;
  const tripReq = await requestMbta(`/trips/${tripId}`);
  const vehicleName = tripReq.attributes.name || vehicle.id;

  return NextResponse.json({
    vehicle: {
      name: vehicleName,
      ...vehicle.attributes,
    },
    currentStatus: vehicle.attributes.current_status,
    currentStop: completeSchedule.find(
      (schedule) =>
        schedule.stopSequence === vehicle.attributes.current_stop_sequence,
    ),
    stops: completeSchedule,
  });
}
