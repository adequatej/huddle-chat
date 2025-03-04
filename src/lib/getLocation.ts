import { UserLocation } from '@/lib/types/location';
import { useState, useEffect } from 'react';

export async function getLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }: GeolocationPosition) => {
          console.log(coords);
          resolve({
            lat: Number(coords.latitude.toFixed(6)),
            lon: Number(coords.longitude.toFixed(6)),
            acc: Math.round(coords.accuracy),
          });
        },
        (error) => {
          reject(error);
        },
      );
    } else {
      reject(new Error('Geolocation is not enabled.'));
    }
  });
}

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    setLocation(null);
    try {
      try {
        const location = await getLocation();
        setLocation(location);
      } catch (error: unknown) {
        setError(error as Error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation()
      .then((location) => {
        setLocation(location);
      })
      .catch((error: Error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { location, error, loading, fetch };
}
