import { UserLocation } from '../types/location';
import { MBTAVehicle } from '../types/mbta';

// Helper function: Haversine formula to compute the distance (in meters) between two lat/lon points.
function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371000; // Earth's radius in meters
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Function that takes a latitude and longitude, then returns vehicles sorted by distance from that point.
// Each vehicle object is extended with a new 'distance' property (in meters).
export async function getVehiclesSortedByDistance(
  vehiclesData: MBTAVehicle[],
  targetLoc: UserLocation,
) {
  try {
    // Map through the vehicles and compute distance from the target point.
    const vehiclesWithDistance = vehiclesData.map((vehicle: MBTAVehicle) => {
      const attrs = vehicle.attributes;
      const vehicleLat = attrs.latitude;
      const vehicleLon = attrs.longitude;
      const distance = getDistanceFromLatLonInMeters(
        targetLoc.lat,
        targetLoc.lon,
        vehicleLat,
        vehicleLon,
      );
      return {
        ...vehicle,
        distance, // distance in meters
      };
    });
    // Sort vehicles by distance (closest first).
    vehiclesWithDistance.sort(
      (a: { distance: number }, b: { distance: number }) =>
        a.distance - b.distance,
    );
    return vehiclesWithDistance;
  } catch (error) {
    console.error('Error retrieving sorted vehicles:', error);
    return [];
  }
}

export async function getStopsSortedByDistance(
  stopsData: MBTAVehicle[],
  targetLoc: UserLocation,
) {
  try {
    // Map through the stops and compute distance from the target point.
    const stopsWithDistance = stopsData.map((stop: MBTAVehicle) => {
      const attrs = stop.attributes;
      const stopLat = attrs.latitude;
      const stopLon = attrs.longitude;
      const distance = getDistanceFromLatLonInMeters(
        targetLoc.lat,
        targetLoc.lon,
        stopLat,
        stopLon,
      );
      return {
        ...stop,
        distance, // distance in meters
      };
    });
    // Sort stops by distance (closest first).
    stopsWithDistance.sort(
      (a: { distance: number }, b: { distance: number }) =>
        a.distance - b.distance,
    );
    return stopsWithDistance;
  } catch (error) {
    console.error('Error retrieving sorted stops:', error);
    return [];
  }
}
