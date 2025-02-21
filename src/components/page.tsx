'use client';
import { useEffect, useState } from 'react';

type Location = {
  latitude: number;
  longitude: number;
};

export default function LocationPage() {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }: GeolocationPosition) => {
          const { latitude, longitude } = coords;
          setLocation({ latitude, longitude });
        },
        (error) => console.error('Geolocation error:', error),
      );
    }
  }, []);

  return (
    <div>
      {location ? (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      ) : (
        <p>Please enable location to use the application</p>
      )}
    </div>
  );
}
