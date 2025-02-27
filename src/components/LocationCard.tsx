'use client';
import { MapPin, MapPinOff } from 'lucide-react';
import { useLocation } from '@/lib/getLocation';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type LocationError = Error & { code?: number };

export default function LocationCard({ success }: { success?: () => void }) {
  const [retryCount, setRetryCount] = useState(0);
  const [locationAvailable, setLocationAvailable] = useState(false);

  const { location, error, loading, fetch } = useLocation() as {
    location: { lat: number; lon: number; acc: number } | null;
    error: LocationError;
    loading: boolean;
    fetch: () => void;
  };

  // Execute success callback when location is available
  useEffect(() => {
    if (location && !locationAvailable) {
      setLocationAvailable(true);
      if (success) success();
    }
  }, [location, success, locationAvailable]);

  // Show loading icon while fetching location, and error icon if denied
  const Icon = useMemo(() => {
    if (loading) {
      const BouncingPin = ({ ...props }) => (
        <MapPin className={cn(props.className, 'animate-bounce delay-500')} /> // Bouncing pin
      );
      return BouncingPin;
    }
    if (error && error.code === 1) return MapPinOff; // Location denied
    return MapPin; // Location found
  }, [loading, error]);

  // Show different title and description based on loading, error, and location
  const title = useMemo(() => {
    if (loading) return 'Getting location...'; // Fetching location
    if (error && error.code === 1) return 'Denied access'; // Location denied
    if (location) return 'Location Found'; // Location found
    return 'No Location Access';
  }, [loading, error, location]);

  // Show different title and description based on loading, error, and location
  const description = useMemo(() => {
    if (loading) return 'Please press allow to be able to use chat features.'; // Fetching location
    if (error && error.code === 1)
      return "Please update your location permissions in your browser's site settings."; // Location denied
    if (location)
      return `Lat: ${location.lat}, Lon: ${location.lon}, Accuracy: ${location.acc}`; // Location found
    return 'Location access is required to use chat features.';
  }, [loading, error, location]);

  return (
    <Card className="max-w-sm rounded-lg">
      <CardContent className="flex flex-row gap-4 py-4">
        <div className="my-auto flex-shrink-0">
          <Icon className="size-12 opacity-50" />
        </div>
        <div className="flex flex-grow flex-col gap-2">
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-foreground/75 text-xs">{description}</p>
          {error &&
            error.code === 1 &&
            retryCount < 2 &&
            !locationAvailable && (
              <Button
                className="w-min"
                size="sm"
                onClick={() => {
                  setRetryCount((count) => count + 1);
                  fetch();
                }}
              >
                Try again
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
