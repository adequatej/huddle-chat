import { UserLocation } from '@/lib/types/location';
import { useState, useEffect } from 'react';

export async function getLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }: GeolocationPosition) => {
          resolve({
            lat: coords.latitude,
            lon: coords.longitude,
            acc: coords.accuracy,
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
