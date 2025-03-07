import { auth } from '@/app/auth';
import requestMbta from '@/lib/mbta/request';
import { getVehiclesSortedByDistance } from '@/lib/mbta/objectsByDistance';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/types/user';

export async function GET(req: NextRequest) {
  // Get optional long, lat, and acc query parameters
  const lon = req.nextUrl.searchParams.get('lon');
  const lat = req.nextUrl.searchParams.get('lat');
  const acc = req.nextUrl.searchParams.get('acc');
  const routeId = req.nextUrl.searchParams.get('route'); // Allow filtering for specific route

  // Authenticate user
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = session.user as User;

  let routeIds: string[] = [];

  if (routeId) {
    routeIds = [routeId];
  }
  console.log('routeId', routeId);

  // If location parameters are provided, fetch the nearest vehicles
  if (lon !== null && lat !== null && acc !== null) {
    const vehicles = await requestMbta(
      `/vehicles?filter[route_type]=2&filter[revenue]=REVENUE`,
      user,
    );

    // Sort vehicles by distance
    const nearestVehicles = await getVehiclesSortedByDistance(vehicles, {
      lat: Number(lat),
      lon: Number(lon),
      acc: Number(acc),
    });

    if (nearestVehicles.length > 0) {
      routeIds = [...new Set(nearestVehicles.map((v) => v.id))];
    }
  }

  // If no nearby vehicles or location, fetch all commuter rail alerts

  // Fetch alerts for the identified routes
  const queryParams = new URLSearchParams();
  queryParams.append('filter[route_type]', '2'); // Default: Commuter Rail only!
  if (routeIds.length > 0) {
    queryParams.append('filter[route]', routeIds.join(','));
  }

  // Fetch alerts
  // Fetch alerts
  const alerts = await requestMbta(`/alerts?${queryParams.toString()}`, user);

  // 🔥 Filter alerts: Only include DELAYS or SERVICE CHANGES
  const delayAlerts = alerts.filter(
    (alert: { attributes: { effect: string } }) =>
      ['DELAY', 'SERVICE_CHANGE', 'TRACK CHANGE'].includes(
        alert.attributes.effect,
      ),
  );

  return NextResponse.json(delayAlerts);
}
