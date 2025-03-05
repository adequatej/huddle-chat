'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChevronLeft,
  Clock,
  MapPin,
  Train as TrainIcon,
  Search,
  Star,
  Flag,
  Accessibility,
  CheckCircle,
  Circle,
  ArrowRight,
  Timer,
  AlarmClock,
  Loader2,
  RefreshCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VehicleData, Route, Stop, Train } from '@/lib/types/mbta';

export function TrainSchedule() {
  // State for routes, trains, and selected items
  const [routes, setRoutes] = useState<Route[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [isLoadingTrains, setIsLoadingTrains] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchedTrainDetails, setFetchedTrainDetails] = useState<Set<string>>(
    new Set(),
  );

  // Refs for state values to avoid dependency cycles
  const fetchTrainDetailsRef = useRef<(trainId: string) => Promise<void>>(null);
  const selectedTrainRef = useRef<Train | null>(null);
  const fetchedTrainDetailsRef = useRef<Set<string>>(new Set());

  // Update refs when state changes
  useEffect(() => {
    selectedTrainRef.current = selectedTrain;
  }, [selectedTrain]);

  useEffect(() => {
    fetchedTrainDetailsRef.current = fetchedTrainDetails;
  }, [fetchedTrainDetails]);

  // Status mapping function
  const mapMbtaStatus = useCallback((status: string): string => {
    switch (status) {
      case 'STOPPED_AT':
        return 'At Station';
      case 'IN_TRANSIT_TO':
        return 'En Route';
      case 'INCOMING_AT':
        return 'Arriving';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  }, []);

  // Format time function
  const formatTime = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format date function for full date display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Fetch train details (stops)
  const fetchTrainDetails = useCallback(
    async (trainId: string) => {
      if (!trainId) return;

      // Prevent duplicate fetches for the same train
      if (isLoadingDetails) return;

      setIsLoadingDetails(true);
      try {
        const response = await fetch(`/api/mbta/vehicle-stops/${trainId}`, {
          // Add cache control headers to prevent browser caching
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch train details');
        }

        const data = await response.json();

        // Process stops data
        const processedStops = data.stops.map((stop: Stop) => {
          // Determine if this is the current stop
          const isCurrent =
            data.currentStop?.id === stop.id &&
            (data.currentStatus === 'STOPPED_AT' || !data.currentStatus);

          // Determine if this stop has been passed
          // Made it so it will only mark as passed if we have a current stop and this stop's sequence is less than the current stop's sequence
          const isPassed =
            data.currentStop &&
            stop.stopSequence < data.currentStop.stopSequence;

          // Set the status based on the above stuff
          let status = 'upcoming'; // Default status
          if (isCurrent) {
            status = 'current';
          } else if (isPassed) {
            status = 'passed';
          }

          return {
            id: stop.id,
            name: stop.name,
            arrivalTime: stop.arrivalTime,
            departureTime: stop.departureTime,
            stopSequence: stop.stopSequence,
            platformName: stop.platformName,
            municipality: stop.municipality,
            status: status,
            wheelchairBoarding: stop.wheelchairBoarding,
          };
        });

        const currentStopData = data.currentStop
          ? {
              id: data.currentStop.id,
              name: data.currentStop.name,
              arrivalTime: data.currentStop.arrivalTime,
              departureTime: data.currentStop.departureTime,
              stopSequence: data.currentStop.stopSequence,
              platformName: data.currentStop.platformName,
              municipality: data.currentStop.municipality,
              status:
                data.currentStatus === 'STOPPED_AT' || !data.currentStatus
                  ? 'current'
                  : 'upcoming',
              wheelchairBoarding: data.currentStop.wheelchairBoarding,
            }
          : undefined;

        // Find the train in the current list and update its stops
        setTrains((prevTrains) =>
          prevTrains.map((train) => {
            if (train.id === trainId) {
              const updatedCurrentLocation = data.currentStatus
                ? data.currentStatus === 'STOPPED_AT'
                  ? 'At Station'
                  : 'En Route'
                : train.currentLocation;

              return {
                ...train,
                stops: processedStops,
                currentStop: currentStopData,
                currentLocation: updatedCurrentLocation,
                status: data.currentStatus
                  ? mapMbtaStatus(data.currentStatus)
                  : train.status,
              };
            }
            return train;
          }),
        );

        // Also update the selected train if it's the one that was just fetched
        const currentSelectedTrain = selectedTrainRef.current;
        if (currentSelectedTrain?.id === trainId) {
          setSelectedTrain((prevTrain) => {
            if (!prevTrain) return null;
            return {
              ...prevTrain,
              stops: processedStops,
              currentStop: currentStopData,
            };
          });
        }

        // Marked this train as having its details fetched
        setFetchedTrainDetails((prev) => new Set(prev).add(trainId));
      } catch (error) {
        console.error('Error fetching train details:', error);
        setError('Failed to fetch train details');
      } finally {
        setIsLoadingDetails(false);
      }
    },
    [isLoadingDetails, mapMbtaStatus],
  );

  // Assign fetchTrainDetails to ref
  useEffect(() => {
    fetchTrainDetailsRef.current = fetchTrainDetails;
  }, [fetchTrainDetails]);

  // Fetch routes
  const fetchRoutes = useCallback(async () => {
    setIsLoadingRoutes(true);
    setError(null);

    try {
      const response = await fetch('/api/mbta/routes');

      if (!response.ok) {
        throw new Error('Failed to fetch routes');
      }

      const data = await response.json();

      // Sort routes by sortOrder
      const sortedRoutes = data.sort(
        (a: Route, b: Route) => a.sortOrder - b.sortOrder,
      );
      setRoutes(sortedRoutes);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Failed to fetch routes');
    } finally {
      setIsLoadingRoutes(false);
    }
  }, []);

  // Fetch trains for a specific route
  const fetchTrainsForRoute = useCallback(
    async (routeId: string) => {
      if (!routeId) return;

      setIsLoadingTrains(true);
      setError(null);

      try {
        const response = await fetch(`/api/mbta/route-vehicles/${routeId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch trains');
        }

        const data = await response.json();

        // Transform the data to match our Train interface
        const transformedTrains: Train[] = data.map((vehicle: VehicleData) => ({
          id: vehicle.id,
          trainNumber: vehicle.label || 'Unknown',
          destination: 'Loading...',
          currentLocation:
            vehicle.current_status === 'STOPPED_AT' ? 'At Station' : 'En Route',
          status: mapMbtaStatus(vehicle.current_status),
          arrivalTime: vehicle.updated_at,
          alerts: [],
          stops: [],
          bearing: vehicle.bearing,
          speed: vehicle.speed,
          latitude: vehicle.latitude,
          longitude: vehicle.longitude,
        }));

        setTrains(transformedTrains);
        setLastUpdated(new Date());

        // Reset fetched train details when loading a new route
        setFetchedTrainDetails(new Set());

        // Fetch details for all trains to ensure consistent display
        if (transformedTrains.length > 0 && fetchTrainDetailsRef.current) {
          // Fetch details for the first train immediately
          fetchTrainDetailsRef.current(transformedTrains[0].id);

          // Fetch details for the rest of the trains with a slight delay to prevent overwhelming the API
          if (transformedTrains.length > 1) {
            setTimeout(() => {
              transformedTrains.slice(1).forEach((train, index) => {
                setTimeout(() => {
                  if (
                    !fetchedTrainDetailsRef.current.has(train.id) &&
                    fetchTrainDetailsRef.current
                  ) {
                    fetchTrainDetailsRef.current(train.id);
                  }
                }, index * 300); // Can change accordingly
              });
            }, 500);
          }
        }
      } catch (error) {
        console.error('Error fetching trains:', error);
        setError('Failed to fetch trains');
      } finally {
        setIsLoadingTrains(false);
        setIsRefreshing(false);
      }
    },
    [mapMbtaStatus],
  );

  // Fetch user's favorite trains
  const fetchFavorites = useCallback(async () => {
    try {
      const response = await fetch('/api/user/favorites');

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }, []);

  // Refresh data
  const refreshData = () => {
    setIsRefreshing(true);
    if (selectedRoute) {
      fetchTrainsForRoute(selectedRoute.id);
    } else {
      fetchRoutes();
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRoutes();
    fetchFavorites();
  }, [fetchRoutes, fetchFavorites]);

  // Set up auto-refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Don't auto-refresh if loading data
      if (isLoadingDetails || isLoadingTrains || isLoadingRoutes) {
        return;
      }

      if (selectedTrain && fetchTrainDetailsRef.current) {
        // Only refresh the selected train's details
        fetchTrainDetailsRef.current(selectedTrain.id);
      } else if (selectedRoute) {
        fetchTrainsForRoute(selectedRoute.id);
      } else {
        fetchRoutes();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [
    selectedTrain,
    selectedRoute,
    isLoadingDetails,
    isLoadingTrains,
    isLoadingRoutes,
    fetchTrainsForRoute,
    fetchRoutes,
  ]);

  // Fetch trains when a route is selected
  useEffect(() => {
    if (selectedRoute) {
      fetchTrainsForRoute(selectedRoute.id);
    }
  }, [selectedRoute, fetchTrainsForRoute]);

  // Fetch train details when a train is selected
  useEffect(() => {
    if (
      selectedTrain &&
      !fetchedTrainDetailsRef.current.has(selectedTrain.id) &&
      fetchTrainDetailsRef.current
    ) {
      fetchTrainDetailsRef.current(selectedTrain.id);
    }
  }, [selectedTrain, fetchedTrainDetailsRef]);

  // Get countdown for arrival time
  const getCountdown = (timeString: string) => {
    const arrivalTime = new Date(timeString);
    const now = new Date();
    const diffMs = arrivalTime.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);

    // Check if the time is in the past (more than 30 minutes ago)
    // This likely means it's for the next day or a future date
    // Can change accordingly but it is unlikely a train will be late by more than 30 minutes
    if (diffMins < -30) {
      return 'Next scheduled';
    }

    if (diffMins <= 0) return 'Now';
    if (diffMins === 1) return '1 min';
    return `${diffMins} mins`;
  };

  // Standardize platform names for commuter rail bc some of the names were ridiculously long
  const formatPlatformName = (platformName: string | undefined): string => {
    if (!platformName) return '';

    // Extract track number using regex
    const trackMatch = platformName.match(/Track\s+(\d+)/i);
    if (trackMatch && trackMatch[1]) {
      return `Track ${trackMatch[1]}`;
    }

    // If no "Track" keyword found, return the original
    return platformName;
  };

  // Get color for status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'at station':
        return 'bg-green-500';
      case 'en route':
        return 'bg-blue-500';
      case 'arriving':
        return 'bg-yellow-500';
      case 'delayed':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-red-700';
      case 'not departed':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Toggle favorite status for a train
  const toggleFavorite = async (trainId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const isFavorite = favorites.includes(trainId);
    const action = isFavorite ? 'remove' : 'add';

    try {
      const response = await fetch('/api/user/favorites', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainId, action }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite');
      }

      const data = await response.json();
      setFavorites(data.favorites);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  // Filter trains based on search and status filter
  const filteredTrains = trains.filter((train) => {
    const matchesSearch =
      train.trainNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (train.destination &&
        train.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (train.currentLocation &&
        train.currentLocation
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    // Check if the train has started its journey
    const hasStartedJourney =
      train.stops.length > 0 &&
      train.currentStop?.stopSequence !== undefined &&
      train.stops[0].stopSequence !== undefined &&
      train.currentStop.stopSequence > train.stops[0].stopSequence;

    // Determine the effective status for filtering
    let effectiveStatus = train.status;

    // If the train hasn't started its journey, use "not departed" as the status
    if (!hasStartedJourney && train.stops.length > 0) {
      effectiveStatus = 'Not Departed';
    }

    const matchesStatus =
      statusFilter === 'all' ||
      effectiveStatus.toLowerCase() === statusFilter.toLowerCase() ||
      (statusFilter === 'favorite' && favorites.includes(train.id));

    return matchesSearch && matchesStatus;
  });

  // Check if a train should be displayed (not from a previous day)
  const shouldDisplayTrain = (train: Train) => {
    // If no stops data yet, show the train until get more info
    if (!train.stops || train.stops.length === 0) return true;

    // Sort stops by sequence
    const sortedStops = [...train.stops].sort(
      (a, b) => a.stopSequence - b.stopSequence,
    );

    // Get the first stop's departure time
    const firstStopTime = sortedStops[0]?.departureTime;
    if (!firstStopTime) return true;

    const departureTime = new Date(firstStopTime);
    const now = new Date();

    // If the first departure time is more than 6 hours in the past,
    // it's likely for a future day and shouldn't be shown
    const diffHours =
      (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Show trains that depart within a reasonable window (not 5+ hours ago bc that's crazy)
    return diffHours > -6;
  };

  // Render route card
  const renderRouteCard = (route: Route) => (
    <Card
      key={route.id}
      className={cn(
        'mb-2 cursor-pointer transition-shadow hover:shadow-md',
        selectedRoute?.id === route.id ? 'ring-primary ring-2' : '',
      )}
      onClick={() => {
        setSelectedRoute(route);
        setSelectedTrain(null);
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">{route.name}</h3>
            <p className="text-muted-foreground text-sm">{route.description}</p>
          </div>
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: `#${route.color}` }}
          />
        </div>
      </div>
    </Card>
  );

  // Render train card
  const renderTrainCard = (train: Train) => {
    // Skip rendering if this train shouldn't be displayed
    if (train.stops.length > 0 && !shouldDisplayTrain(train)) {
      return null;
    }

    // Find the final destination (last stop in sequence)
    const finalDestination =
      train.stops.length > 0
        ? [...train.stops].sort((a, b) => a.stopSequence - b.stopSequence).pop()
        : null;

    // Determine train status more precisely
    let detailedStatus = train.status;
    let platformInfo = '';

    // If the train has stops but hasn't reached the first stop yet
    const hasStartedJourney =
      train.stops.length > 0 &&
      train.currentStop?.stopSequence !== undefined &&
      train.stops[0].stopSequence !== undefined &&
      train.currentStop.stopSequence > train.stops[0].stopSequence;

    if (!hasStartedJourney && train.stops.length > 0) {
      detailedStatus = 'Not Departed';
      const firstStop = [...train.stops].sort(
        (a, b) => a.stopSequence - b.stopSequence,
      )[0];
      if (firstStop.departureTime) {
        detailedStatus = `Departs in ${getCountdown(firstStop.departureTime)}`;
      }
      if (firstStop.platformName) {
        platformInfo = `Platform ${firstStop.platformName}`;
      }
    }

    // If we haven't fetched details for this train yet, show a loading state
    const isLoading = train.stops.length === 0;

    return (
      <Card
        key={train.id}
        className={cn(
          'mb-2 cursor-pointer transition-shadow hover:shadow-md',
          selectedTrain?.id === train.id ? 'ring-primary ring-2' : '',
          isLoading ? 'opacity-80' : '',
        )}
        onClick={(e) => {
          e.preventDefault();
          setSelectedTrain(train);

          // Ensure details for this train
          if (
            !fetchedTrainDetailsRef.current.has(train.id) &&
            fetchTrainDetailsRef.current
          ) {
            fetchTrainDetailsRef.current(train.id);
          }
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex-shrink-0">
                <TrainIcon className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="truncate text-xs font-bold sm:text-base">
                    {isLoading ? 'Loading...' : `Train ${train.trainNumber}`}
                  </h3>
                  <Star
                    className={cn(
                      'h-3 w-3 flex-shrink-0 cursor-pointer sm:h-4 sm:w-4',
                      favorites.includes(train.id)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400',
                    )}
                    onClick={(e) => toggleFavorite(train.id, e)}
                  />
                </div>
                <p className="text-muted-foreground truncate text-xs sm:text-sm">
                  {finalDestination?.name || 'Loading destination...'}
                </p>
              </div>
            </div>
            <Badge
              className={cn(
                'ml-2 flex-shrink-0 px-1.5 py-0.5 text-xs whitespace-nowrap text-white sm:px-2 sm:py-0.5 sm:text-xs',
                isLoading
                  ? 'bg-gray-400'
                  : getStatusColor(
                      !hasStartedJourney ? 'not departed' : train.status,
                    ),
              )}
            >
              {isLoading
                ? 'Loading...'
                : !hasStartedJourney
                  ? detailedStatus
                  : train.status}
            </Badge>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs sm:mt-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2 sm:text-sm">
            <div>
              <p className="text-muted-foreground text-[10px] sm:text-xs">
                {isLoading
                  ? 'Location'
                  : !hasStartedJourney
                    ? 'Status'
                    : train.currentLocation === 'At Station'
                      ? 'Current Location'
                      : 'Last Stop'}
              </p>
              <div className="flex items-center gap-1">
                <MapPin className="text-primary h-3 w-3 flex-shrink-0 sm:h-3 sm:w-3" />
                <span className="truncate">
                  {isLoading
                    ? 'Loading...'
                    : !hasStartedJourney
                      ? 'Not Departed'
                      : train.currentLocation === 'At Station' &&
                          train.currentStop
                        ? train.currentStop.name
                        : (() => {
                            // For en route trains, show which station it departed from
                            if (
                              train.currentLocation === 'En Route' &&
                              train.stops.length > 0
                            ) {
                              // Find the last departed stop
                              const departedStops = train.stops
                                .filter((stop) => stop.status === 'passed')
                                .sort(
                                  (a, b) => b.stopSequence - a.stopSequence,
                                );

                              if (departedStops.length > 0) {
                                return departedStops[0].name;
                              }
                            }
                            return 'En Route';
                          })()}
                </span>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-[10px] sm:text-xs">
                Updated
              </p>
              <div className="flex items-center gap-1">
                <Clock className="text-primary h-3 w-3 flex-shrink-0 sm:h-3 sm:w-3" />
                <span>{formatTime(train.arrivalTime)}</span>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-[10px] sm:text-xs">
                Next Stop
              </p>
              <div className="flex items-center gap-1">
                <ChevronLeft className="text-primary h-3 w-3 flex-shrink-0 rotate-180 sm:h-3 sm:w-3" />
                <span className="truncate">
                  {isLoading
                    ? 'Loading...'
                    : train.currentLocation === 'At Station' &&
                        train.currentStop
                      ? train.stops.find(
                          (stop) =>
                            stop.stopSequence >
                            (train.currentStop?.stopSequence || 0),
                        )?.name || 'End of line'
                      : train.currentLocation === 'En Route'
                        ? (() => {
                            // Find the next upcoming stop for en route trains
                            const upcomingStops = train.stops
                              .filter((stop) => stop.status === 'upcoming')
                              .sort((a, b) => a.stopSequence - b.stopSequence);

                            return upcomingStops.length > 0
                              ? upcomingStops[0].name
                              : 'End of line';
                          })()
                        : !hasStartedJourney && train.stops.length > 0
                          ? train.stops.find(
                              (stop) =>
                                stop.stopSequence >
                                (train.currentStop?.stopSequence || 0),
                            )?.name || 'First stop'
                          : 'Unknown'}
                </span>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-[10px] sm:text-xs">
                {isLoading
                  ? 'Status'
                  : train.currentLocation === 'At Station'
                    ? 'Departure'
                    : !hasStartedJourney
                      ? 'First Departure'
                      : 'Next Arrival'}
              </p>
              <div className="flex items-center gap-1">
                <AlarmClock className="text-primary h-3 w-3 flex-shrink-0 sm:h-3 sm:w-3" />
                <span>
                  {isLoading
                    ? 'Loading...'
                    : train.currentLocation === 'At Station' &&
                        train.currentStop?.departureTime
                      ? `Departs: ${getCountdown(train.currentStop.departureTime)}`
                      : train.currentLocation === 'En Route'
                        ? (() => {
                            // Find the next upcoming stop for en route trains
                            const upcomingStops = train.stops
                              .filter((stop) => stop.status === 'upcoming')
                              .sort((a, b) => a.stopSequence - b.stopSequence);

                            const nextStop =
                              upcomingStops.length > 0
                                ? upcomingStops[0]
                                : null;

                            if (nextStop?.arrivalTime) {
                              return (
                                <div className="flex items-center gap-1">
                                  <span className="whitespace-nowrap">
                                    Arrives:{' '}
                                    {getCountdown(nextStop.arrivalTime || '')}
                                  </span>
                                </div>
                              );
                            }
                            return train.speed !== undefined
                              ? `${train.speed} mph`
                              : 'En Route';
                          })()
                        : !hasStartedJourney &&
                            train.stops.length > 0 &&
                            train.stops[0].departureTime
                          ? `Departs: ${getCountdown(train.stops[0].departureTime || '')}`
                          : !hasStartedJourney
                            ? 'Not Departed Yet'
                            : train.speed !== undefined
                              ? `${train.speed} mph`
                              : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {platformInfo && !isLoading && (
            <div className="mt-1 border-t border-gray-200 pt-1 text-[10px] sm:mt-2 sm:pt-2 sm:text-sm">
              <span className="text-primary font-medium">{platformInfo}</span>
            </div>
          )}

          {train.speed !== undefined && hasStartedJourney && !isLoading && (
            <div className="mt-1 flex justify-end border-t border-gray-200 pt-1 text-[10px] sm:mt-2 sm:pt-2 sm:text-sm">
              <span className="text-muted-foreground">{train.speed} mph</span>
            </div>
          )}

          {isLoading && (
            <div className="mt-1 flex justify-center border-t border-gray-200 pt-1 text-[10px] sm:mt-2 sm:pt-2 sm:text-sm">
              <span className="text-muted-foreground">
                Loading train details...
              </span>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 pt-2 sm:pt-0">
      {/* Header with title and refresh button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Train Schedule</h1>
          <p className="text-muted-foreground text-sm">
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
              : 'Loading...'}
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={refreshData}
          disabled={isRefreshing || isLoadingRoutes || isLoadingTrains}
        >
          <RefreshCcw
            className={cn(
              'h-4 w-4',
              (isRefreshing || isLoadingRoutes || isLoadingTrains) &&
                'animate-spin',
            )}
          />
        </Button>
      </div>

      {/* Navigation breadcrumbs */}
      <div className="flex flex-col items-start gap-1 text-xs sm:flex-row sm:items-center sm:gap-2 sm:text-sm">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-auto p-0',
              !selectedRoute && 'text-primary font-bold',
            )}
            onClick={() => {
              setSelectedRoute(null);
              setSelectedTrain(null);
            }}
            disabled={!selectedRoute}
          >
            Routes
          </Button>

          {selectedRoute && (
            <>
              <ChevronLeft className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-auto p-0',
                  selectedRoute && !selectedTrain && 'text-primary font-bold',
                )}
                onClick={() => setSelectedTrain(null)}
                disabled={!selectedTrain}
              >
                {selectedRoute.name}
              </Button>
            </>
          )}
        </div>

        {selectedTrain && (
          <div className="ml-0 flex items-center gap-1 sm:ml-0 sm:gap-2">
            <ChevronLeft className="h-3 w-3 flex-shrink-0 sm:inline-block sm:h-4 sm:w-4" />
            <span className="text-primary font-bold">
              Train {selectedTrain.trainNumber}
            </span>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Routes view */}
      {!selectedRoute && (
        <div>
          <div className="relative mb-4">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>

          {isLoadingRoutes ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : routes.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              No routes found
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {routes
                .filter(
                  (route) =>
                    route.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    route.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                )
                .map(renderRouteCard)}
            </div>
          )}
        </div>
      )}

      {/* Trains view */}
      {selectedRoute && !selectedTrain && (
        <div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search trains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="at station">At Station</SelectItem>
                <SelectItem value="en route">En Route</SelectItem>
                <SelectItem value="not departed">Not Departed</SelectItem>
                <SelectItem value="favorite">Favorites</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoadingTrains ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredTrains.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {filteredTrains
                .filter(shouldDisplayTrain)
                .map((train) => renderTrainCard(train))
                .filter(Boolean)}{' '}
              {/* Filter out null values from renderTrainCard */}
            </div>
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              No trains found
            </div>
          )}
        </div>
      )}

      {/* Train details view */}
      {selectedTrain && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTrain(null)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to trains
            </Button>
          </div>

          {/* Train Summary Banner - Key Information */}
          <Card className="bg-secondary text-secondary-foreground mb-4">
            <CardContent className="p-3 sm:p-4">
              {/* Header section with train number, status, and actions */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                {/* Left section - Train info and status */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                    <TrainIcon className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                    <h2 className="truncate text-base font-bold sm:text-xl">
                      Train {selectedTrain.trainNumber}
                    </h2>
                  </div>
                  <Badge
                    className={cn(
                      'px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm',
                      selectedTrain.currentLocation === 'At Station'
                        ? 'bg-green-500 text-white'
                        : '',
                    )}
                  >
                    {selectedTrain.stops.length > 0 &&
                    selectedTrain.currentStop?.stopSequence !== undefined &&
                    selectedTrain.stops[0].stopSequence !== undefined &&
                    selectedTrain.currentStop.stopSequence <=
                      selectedTrain.stops[0].stopSequence
                      ? 'Not Departed'
                      : selectedTrain.currentLocation}
                  </Badge>
                  <Star
                    className={cn(
                      'h-4 w-4 flex-shrink-0 cursor-pointer sm:h-4 sm:w-4',
                      favorites.includes(selectedTrain.id)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400',
                    )}
                    onClick={(e) => toggleFavorite(selectedTrain.id, e)}
                  />
                </div>

                {/* Right section - Updated time */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-1 text-xs whitespace-nowrap sm:text-sm">
                    <Clock className="h-4 w-4 flex-shrink-0 sm:h-4 sm:w-4" />
                    <span>
                      Updated: {formatDate(selectedTrain.arrivalTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Train details - compact grid layout for all screen sizes */}
              <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3 sm:gap-3 sm:text-sm">
                {/* Column 1: Final Destination */}
                {selectedTrain.stops && selectedTrain.stops.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Flag className="h-4 w-4 flex-shrink-0 sm:h-4 sm:w-4" />
                    <span className="line-clamp-1 font-medium sm:truncate">
                      To{' '}
                      {selectedTrain.stops[selectedTrain.stops.length - 1]
                        ?.name || 'Final Destination'}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom row: Last stop -> Next stop on left, departure/arrival time on right */}
              <div className="mt-3 flex flex-col gap-2 text-xs sm:flex-row sm:justify-between sm:gap-0 sm:text-sm">
                {/* Left side: Last stop -> Next stop */}
                <div className="flex max-w-full min-w-0 items-center gap-1 sm:max-w-[60%]">
                  <div className="flex min-w-0 items-center gap-1">
                    <MapPin className="h-4 w-4 flex-shrink-0 sm:h-4 sm:w-4" />
                    <span className="truncate">
                      {selectedTrain.currentLocation === 'At Station' &&
                      selectedTrain.currentStop
                        ? selectedTrain.currentStop.name
                        : (() => {
                            // Check if train hasn't departed yet
                            const notDeparted =
                              selectedTrain.stops.length > 0 &&
                              selectedTrain.currentStop?.stopSequence !==
                                undefined &&
                              selectedTrain.stops[0].stopSequence !==
                                undefined &&
                              selectedTrain.currentStop.stopSequence <=
                                selectedTrain.stops[0].stopSequence;

                            if (notDeparted) {
                              return 'Not Departed Yet';
                            }

                            // For en route trains, show which station it departed from
                            if (
                              selectedTrain.currentLocation === 'En Route' &&
                              selectedTrain.stops.length > 0
                            ) {
                              // Find the last departed stop
                              const departedStops = selectedTrain.stops
                                .filter((stop) => stop.status === 'passed')
                                .sort(
                                  (a, b) => b.stopSequence - a.stopSequence,
                                );

                              if (departedStops.length > 0) {
                                return departedStops[0].name;
                              }
                            }

                            return 'En Route';
                          })()}
                    </span>
                  </div>

                  {/* Next Stop - Displayed inline with current location */}
                  {selectedTrain.stops && selectedTrain.stops.length > 0 && (
                    <>
                      <ArrowRight className="mx-0.5 h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                      <span className="truncate">
                        {(() => {
                          // Find the next stop based on train status
                          if (
                            selectedTrain.currentLocation === 'At Station' &&
                            selectedTrain.currentStop
                          ) {
                            // If at station, next stop is the one after current
                            const nextStop = selectedTrain.stops.find(
                              (stop) =>
                                stop.stopSequence >
                                (selectedTrain.currentStop?.stopSequence || 0),
                            );
                            return nextStop?.name || 'End of line';
                          } else if (
                            selectedTrain.currentLocation === 'En Route'
                          ) {
                            // If en route, next stop is the first upcoming stop
                            const upcomingStops = selectedTrain.stops
                              .filter((stop) => stop.status === 'upcoming')
                              .sort((a, b) => a.stopSequence - b.stopSequence);

                            return upcomingStops.length > 0
                              ? upcomingStops[0].name
                              : 'End of line';
                          } else {
                            // Default case
                            return (
                              selectedTrain.stops.find(
                                (stop) =>
                                  stop.stopSequence >
                                  (selectedTrain.currentStop?.stopSequence ||
                                    0),
                              )?.name || 'End of line'
                            );
                          }
                        })()}
                      </span>
                    </>
                  )}
                </div>

                {/* Right side: Departure/Arrival Time */}
                <div className="flex items-center">
                  {selectedTrain.currentLocation === 'At Station' &&
                  selectedTrain.currentStop &&
                  selectedTrain.currentStop.departureTime ? (
                    <div className="flex items-center gap-1">
                      <AlarmClock className="h-4 w-4 flex-shrink-0 sm:h-4 sm:w-4" />
                      <span className="whitespace-nowrap">
                        Departs:{' '}
                        {getCountdown(selectedTrain.currentStop.departureTime)}
                      </span>
                    </div>
                  ) : selectedTrain.currentLocation === 'En Route' &&
                    selectedTrain.stops.length > 0 ? (
                    (() => {
                      // Find the next upcoming stop when en route
                      const upcomingStops = selectedTrain.stops
                        .filter((stop) => stop.status === 'upcoming')
                        .sort((a, b) => a.stopSequence - b.stopSequence);

                      const nextStop =
                        upcomingStops.length > 0 ? upcomingStops[0] : null;

                      if (nextStop?.arrivalTime) {
                        return (
                          <div className="flex items-center gap-1">
                            <AlarmClock className="h-4 w-4 flex-shrink-0 sm:h-4 sm:w-4" />
                            <span className="whitespace-nowrap">
                              Arrives:{' '}
                              {getCountdown(nextStop.arrivalTime || '')}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div className="flex items-center gap-1">
                          <Timer className="h-4 w-4 flex-shrink-0 sm:h-4 sm:w-4" />
                          <span className="whitespace-nowrap">En Route</span>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="flex items-center gap-1">
                      <Timer className="h-4 w-4 flex-shrink-0 sm:h-4 sm:w-4" />
                      <span className="whitespace-nowrap">Status Unknown</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">Journey Progress</h3>
          </div>

          {isLoadingDetails ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : selectedTrain.stops.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              No stops information available
            </div>
          ) : (
            <div className="space-y-4">
              {(() => {
                // Sort stops by sequence
                const sortedStops = [...selectedTrain.stops].sort(
                  (a, b) => a.stopSequence - b.stopSequence,
                );

                // Find current stop index
                const currentStopIndex = sortedStops.findIndex(
                  (stop) =>
                    stop.status === 'current' &&
                    (selectedTrain.currentLocation === 'At Station' ||
                      !selectedTrain.currentLocation),
                );

                // Determine if the train has started its journey
                const hasStartedJourney = sortedStops.some(
                  (stop) => stop.status === 'passed',
                );

                // Find the last departed stop (if any)
                const lastDepartedStopIndex = hasStartedJourney
                  ? sortedStops.filter((stop) => stop.status === 'passed')
                      .length - 1
                  : -1;

                // Determine which stops to display
                let stopsToDisplay = [];

                if (!hasStartedJourney) {
                  // If journey hasn't started, show first 3 stops
                  stopsToDisplay = sortedStops.slice(
                    0,
                    Math.min(3, sortedStops.length),
                  );
                } else if (currentStopIndex !== -1) {
                  // If there's a current stop, show it and upcoming stops
                  // Also show the last departed stop if available
                  if (lastDepartedStopIndex >= 0) {
                    stopsToDisplay.push(
                      sortedStops.filter((stop) => stop.status === 'passed')[
                        lastDepartedStopIndex
                      ],
                    );
                  }

                  // Add current stop and all upcoming stops
                  stopsToDisplay = [
                    ...stopsToDisplay,
                    sortedStops[currentStopIndex],
                    ...sortedStops.filter((stop) => stop.status === 'upcoming'),
                  ];
                } else {
                  // If en route (no current stop), show the last departed stop and upcoming stops
                  if (lastDepartedStopIndex >= 0) {
                    stopsToDisplay.push(
                      sortedStops.filter((stop) => stop.status === 'passed')[
                        lastDepartedStopIndex
                      ],
                    );
                  }

                  // Add all upcoming stops
                  stopsToDisplay = [
                    ...stopsToDisplay,
                    ...sortedStops.filter((stop) => stop.status === 'upcoming'),
                  ];
                }

                return stopsToDisplay.map((stop) => (
                  <Card
                    key={stop.id}
                    className={cn(
                      'border-l-4 transition-opacity',
                      stop.status === 'current'
                        ? 'border-l-green-500'
                        : stop.status === 'passed'
                          ? 'border-l-gray-300 opacity-60'
                          : 'border-l-blue-500',
                    )}
                  >
                    <div className="p-3 sm:p-4">
                      <div className="flex flex-row justify-between gap-2">
                        <div className="flex min-w-0 flex-grow gap-2 sm:gap-3">
                          <div className="mt-1 flex-shrink-0">
                            {stop.status === 'current' ? (
                              <Circle className="h-4 w-4 fill-green-500 text-green-500 sm:h-5 sm:w-5" />
                            ) : stop.status === 'passed' ? (
                              <CheckCircle className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
                            ) : (
                              <Circle className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-grow">
                            <h4
                              className={cn(
                                'overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap sm:text-base',
                                stop.status === 'passed' &&
                                  'text-muted-foreground',
                              )}
                            >
                              {stop.name}
                            </h4>
                            <p className="text-muted-foreground line-clamp-1 text-xs sm:text-sm">
                              {stop.municipality}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-1">
                              {stop.wheelchairBoarding === 1 && (
                                <Accessibility className="text-primary h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                              )}
                              <Badge
                                variant="outline"
                                className="px-1 py-0 text-[10px] sm:px-2 sm:py-0.5 sm:text-xs"
                              >
                                {stop.status === 'current' &&
                                selectedTrain.currentLocation === 'At Station'
                                  ? 'Current Stop'
                                  : stop.status === 'passed'
                                    ? 'Departed'
                                    : !hasStartedJourney &&
                                        stop.stopSequence ===
                                          sortedStops[0].stopSequence
                                      ? 'First Stop'
                                      : 'Expected'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex min-w-[80px] flex-col items-end justify-between text-right sm:min-w-[100px]">
                          <div className="flex flex-col items-end">
                            <p
                              className={cn(
                                'text-sm font-medium sm:text-base',
                                stop.status === 'passed' &&
                                  'text-muted-foreground',
                              )}
                            >
                              {formatTime(
                                stop.departureTime || stop.arrivalTime,
                              )}
                            </p>
                            {stop.arrivalTime && stop.status === 'upcoming' && (
                              <Badge
                                variant="secondary"
                                className="mt-0.5 px-1 py-0 text-[10px] sm:px-2 sm:py-0.5 sm:text-xs"
                              >
                                {getCountdown(stop.arrivalTime)}
                              </Badge>
                            )}
                          </div>
                          {stop.platformName && (
                            <div className="mt-auto flex items-center justify-end gap-1">
                              <p
                                className={cn(
                                  'text-xs font-medium whitespace-nowrap sm:text-sm',
                                  stop.status !== 'passed' && 'text-primary',
                                )}
                              >
                                {formatPlatformName(stop.platformName)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ));
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
