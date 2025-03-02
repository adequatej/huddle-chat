import { auth } from '@/app/auth';
import requestMbta from '@/lib/mbta/request';
import { MBTAAPISchedule, MBTAVehicleAttributes } from '@/lib/types/mbta';
import { NextResponse } from 'next/server';

// Fetch information about a specific stop.
async function getStopInfo(stopId: string) {
  const path = `/stops/${stopId}`;
  return await requestMbta(path);
}

// Fetch scheduled arrival and departure times for commuter rail stops.
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

  const schedulesWithStopId = response.filter(
    (schedule: { relationships: { stop: { data: { id: string } } } }) =>
      schedule.relationships.stop.data.id === stopId,
  );

  console.log('Schedules with stop ID:', schedulesWithStopId);

  // Find the index of the schedule with the lowest difference in time between date and departure time
  const schedulesWithStopIdIndex = schedulesWithStopId.reduce(
    (
      closestIndex: string | number,
      schedule: { attributes: { departure_time: string } },
      currentIndex: number,
    ) => {
      const closestTime = new Date(
        schedulesWithStopId[closestIndex].attributes.departure_time,
      );
      const currentTime = new Date(schedule.attributes.departure_time);
      const dateToCheck = new Date(date);

      const closestDifference = Math.abs(
        closestTime.getTime() - dateToCheck.getTime(),
      );
      const currentDifference = Math.abs(
        currentTime.getTime() - dateToCheck.getTime(),
      );

      return currentDifference < closestDifference
        ? currentIndex
        : closestIndex;
    },
    0,
  );

  const currentStopScheduleIndex = response.findIndex(
    (schedule: { id: string }) =>
      schedule.id === schedulesWithStopId[schedulesWithStopIdIndex].id,
  );

  // Starting at the currentStopSchedule, find all schedules before and after the current stop without the schedule.attribute.stop_sequence rolling over
  const previousStops = [];
  const nextStops = [];
  const currentStopSchedule = response[currentStopScheduleIndex];
  let currentStopSequence = currentStopSchedule.attributes.stop_sequence;

  // Find all schedules before the current stop
  for (let i = currentStopScheduleIndex - 1; i >= 0; i--) {
    if (response[i].attributes.stop_sequence < currentStopSequence) {
      previousStops.unshift(response[i]);
      currentStopSequence = response[i].attributes.stop_sequence;
    } else {
      break;
    }
  }

  // Find all schedules after the current stop
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

export async function GET() {
  // Check for authenticated user
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get current commuter rail vehicles
  // Filters:
  // - route type is commuter rail
  const vehicles = await requestMbta(
    `/vehicles?filter[route_type]=2&filter[revenue]=REVENUE`,
    session.user,
  );

  const vehiclesSchedules = await Promise.all(
    vehicles.map(
      async (vehicle: {
        relationships: {
          route: { data: { id: string } };
          trip: { data: { id: string } };
          stop: { data: { id: string } };
        };
        id: string;
        attributes: MBTAVehicleAttributes;
      }) => {
        const vehicleSchedules = await fetchSchedules(
          vehicle.relationships.route.data.id,
          vehicle.relationships.trip.data.id,
          vehicle.relationships.stop.data.id,
          new Date().toISOString(),
          vehicle.attributes.direction_id,
        );

        const completeSchedule = await Promise.all(
          vehicleSchedules.map(async (schedule: MBTAAPISchedule) => {
            const stopInfo = await getStopInfo(
              schedule.relationships.stop.data.id,
            );

            const obj = {
              id: schedule.id,
              arrivalTime: schedule.attributes.arrival_time,
              departureTime: schedule.attributes.departure_time,
              stopSequence: schedule.attributes.stop_sequence,
              name: stopInfo.attributes.name,
              description: stopInfo.attributes.description,
              municipality: stopInfo.attributes.municipality,
              platformName: stopInfo.attributes.platform_name,
              latitude: stopInfo.attributes.latitude,
              longitude: stopInfo.attributes.longitude,
              wheelchairBoarding: stopInfo.attributes.wheelchair_boarding,
            };

            return obj;
          }),
        );

        return {
          id: vehicle.id,
          updatedAt: vehicle.attributes.updated_at,
          directionId: vehicle.attributes.direction_id,
          latitude: vehicle.attributes.latitude,
          longitude: vehicle.attributes.longitude,
          currentStopSequence: vehicle.attributes.current_stop_sequence,
          currentStatus: vehicle.attributes.current_status,
          stops: completeSchedule,
        };
      },
    ),
  );

  return NextResponse.json(vehiclesSchedules);
}
