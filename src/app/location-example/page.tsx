'use client';
import LocationGate from '@/components/LocationGate';
import { useLocation } from '@/lib/getLocation';

export default function LocationPage() {
  const { location, error, loading, fetch } = useLocation();

  console.log({ location, error, loading });

  return (
    <div>
      <LocationGate success={fetch} />
      {location ? (
        <p>
          Latitude: {location.lat}, Longitude: {location.lon}, Accuracy:{' '}
          {location.acc}
        </p>
      ) : (
        <p>Please enable location to use the application</p>
      )}
    </div>
  );
}
