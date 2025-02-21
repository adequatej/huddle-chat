import { UserLocation } from '@/lib/types/location';

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
          console.error('Geolocation error:', error);
          reject(error);
        },
      );
    } else {
      reject(new Error('Geolocation is not enabled.'));
    }
  });
}
