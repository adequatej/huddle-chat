'use client';
import { MapPinCheck, MapPinOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useLocation } from '@/lib/getLocation';
import { Button } from './ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type LocationError = Error & { code?: number };

export default function LocationGate({ success }: { success: () => void }) {
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
      success();
    }
  }, [location, success, locationAvailable]);

  return (
    <Dialog open={!location}>
      <DialogContent>
        <DialogHeader>
          {/* Waiting for approval */}
          {loading && <MapPinCheck className="m-auto size-30 opacity-50" />}

          {/* Denied access */}
          {!loading && error && error.code === 1 && (
            <MapPinOff className="m-auto size-30 opacity-50" />
          )}

          <DialogTitle className="m-auto text-2xl">
            {loading ? 'Press Allow to Continue' : 'No Location Access'}
          </DialogTitle>
          <DialogDescription className="text-md text-center">
            Location access is required to use chat features.
            {loading
              ? ' Please press allow to be able to use chat features.'
              : " Please update your location permissions in your browser's site settings."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="j m-auto my-3 flex gap-4">
          <Button disabled={loading} asChild className="">
            <Link href="/">Back Home</Link>
          </Button>
          <Button disabled={loading} onClick={fetch}>
            {loading ? 'Loading...' : 'Retry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
