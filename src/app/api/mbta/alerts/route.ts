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

  // Authenticate user
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = session.user as User;

  let routeIds: string[] = [];

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

  // If no nearby vehicles or location, sends all alerts
  if (routeIds.length === 0) {
    const alerts = await requestMbta(`/alerts`, user);

    return NextResponse.json(alerts);
  }

  // Fetch alerts for the identified routes
  const params = new URLSearchParams();
  params.append('filter[route]', routeIds.join(','));
  const alerts = await requestMbta(`/alerts?${params.toString()}`, user);

  return NextResponse.json(alerts);
}
