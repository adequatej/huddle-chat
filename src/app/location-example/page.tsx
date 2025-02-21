'use client';
import { useEffect, useState } from 'react';
import { getLocation } from '@/lib/getLocation';
import { UserLocation } from '@/lib/types/location';

export default function LocationPage() {
  const [location, setLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    getLocation()
      .then((data) => {
        setLocation(data);
        console.log('Location data:', data);
      })
      .catch((error) => {
        console.error('Error fetching location:', error);
      });
  }, []);

  return (
    <div>
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
