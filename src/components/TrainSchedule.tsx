'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  ChevronLeft,
  Clock,
  MapPin,
  AlertTriangle,
  Train,
  Search,
  Filter,
  RefreshCcw,
  Star,
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

// Mock data for demonstration
const mockTrains = [
  {
    id: '1',
    trainNumber: 'Train 10',
    destination: 'Somewhere',
    currentLocation: 'Location 2',
    status: 'On Route',
    arrivalTime: '11:20 AM',
    alerts: ['Minor delay expected'],
    stops: [
      {
        location: 'Location 1',
        arrival: '10:00',
        departure: '10:05',
        status: 'Departed',
        platform: '1',
      },
      {
        location: 'Location 2',
        arrival: '10:15',
        departure: '10:20',
        status: 'On Route',
        platform: '2',
      },
      {
        location: 'Location 3',
        arrival: '10:30',
        departure: '10:35',
        status: 'Expected',
        platform: '1',
      },
      {
        location: 'Location 4',
        arrival: '10:45',
        departure: '10:50',
        status: 'Expected',
        platform: '3',
      },
    ],
  },
  {
    id: '2',
    trainNumber: 'Train 11',
    destination: 'Boston',
    currentLocation: 'South Station',
    status: 'On Time',
    arrivalTime: '12:05 PM',
    alerts: [],
    stops: [
      {
        location: 'South Station',
        arrival: '11:00',
        departure: '11:05',
        status: 'Expected',
        platform: '4',
      },
      {
        location: 'Back Bay',
        arrival: '11:15',
        departure: '11:20',
        status: 'Expected',
        platform: '2',
      },
      {
        location: 'Newton',
        arrival: '11:30',
        departure: '11:35',
        status: 'Expected',
        platform: '1',
      },
    ],
  },
];

export function TrainSchedule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrain, setSelectedTrain] = useState<
    (typeof mockTrains)[0] | null
  >(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [favorites, setFavorites] = useState<string[]>([]);

  // Function to format countdown for real time
  const getCountdown = (timeString: string) => {
    const time = new Date();
    const [hours, minutes] = timeString.split(':');
    time.setHours(parseInt(hours), parseInt(minutes), 0);
    const diff = time.getTime() - new Date().getTime();
    if (diff < 0) return 'Departed';
    const minutesLeft = Math.floor(diff / 1000 / 60);
    if (minutesLeft < 60) return `${minutesLeft}m`;
    return `${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}m`;
  };

  // Simulate real-time updates
  const refreshData = () => {
    setLastUpdated(new Date());
    // For benson to fetch new data from api
  };

  const filteredTrains = mockTrains.filter((train) => {
    const matchesSearch =
      train.trainNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.currentLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || train.status === filterStatus;
    const matchesFavorites = !showFavorites || favorites.includes(train.id);

    return matchesSearch && matchesStatus && matchesFavorites;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Departed':
        return 'default';
      case 'On Route':
        return 'secondary';
      case 'Delayed':
        return 'destructive';
      case 'Expected':
        return 'outline';
      default:
        return 'default';
    }
  };

  // To render train info as a card for mobile
  const renderTrainCard = (train: (typeof mockTrains)[0]) => (
    <Card
      key={train.id}
      className="cursor-pointer p-4"
      onClick={() => setSelectedTrain(train)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setFavorites((prev) =>
                  prev.includes(train.id)
                    ? prev.filter((id) => id !== train.id)
                    : [...prev, train.id],
                );
              }}
            >
              <Star
                className={cn(
                  'h-4 w-4',
                  favorites.includes(train.id)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground',
                )}
              />
            </Button>
            <h3 className="font-medium">{train.trainNumber}</h3>
          </div>
          <div className="text-muted-foreground space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{train.currentLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Train className="h-4 w-4" />
              <span>{train.destination}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-2 font-medium">{train.arrivalTime}</div>
          <span
            className={cn(
              'text-xs',
              train.status === 'Delayed'
                ? 'text-destructive'
                : 'text-muted-foreground',
            )}
          >
            {getCountdown(train.arrivalTime.split(' ')[0])}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <Badge variant={getStatusColor(train.status)}>{train.status}</Badge>
      </div>
      {train.alerts.length > 0 && (
        <div className="text-destructive mt-3 flex items-center gap-2 text-xs">
          <AlertTriangle className="h-4 w-4" />
          <span>{train.alerts[0]}</span>
        </div>
      )}
    </Card>
  );

  if (selectedTrain) {
    return (
      <div className="mt-20 space-y-6">
        {/* Navigation */}
        <div className="bg-background sticky top-20 z-10 pb-4">
          <div className="flex items-center gap-2 text-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTrain(null)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sm:inline">Back to Routes</span>
            </Button>
            <span className="text-muted-foreground/50 hidden sm:inline">/</span>
            <span className="text-muted-foreground hidden sm:inline">
              Stops for {selectedTrain.trainNumber}
            </span>
          </div>
        </div>

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {selectedTrain.trainNumber}
          </h2>
          <p className="text-muted-foreground">
            To: {selectedTrain.destination}
          </p>
        </div>

        {/* Status Overview */}
        <Card>
          <div className="p-4 sm:p-6">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <MapPin className="text-primary h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Current Location</p>
                  <p className="text-muted-foreground text-sm">
                    {selectedTrain.currentLocation}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-primary h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Expected Arrival</p>
                  <p className="text-muted-foreground text-sm">
                    {selectedTrain.arrivalTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Train className="text-primary h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={getStatusColor(selectedTrain.status)}>
                    {selectedTrain.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Alerts if any */}
        {selectedTrain.alerts.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <div className="p-4">
              <div className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm font-medium">Service Alerts</p>
              </div>
              <div className="mt-2 space-y-1">
                {selectedTrain.alerts.map((alert, index) => (
                  <p key={index} className="text-muted-foreground text-sm">
                    {alert}
                  </p>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Journey Progress */}
        <div className="relative space-y-2">
          {selectedTrain.stops.map((stop, index) => (
            <Card
              key={index}
              className={cn(
                'relative',
                stop.status === 'On Route'
                  ? 'bg-secondary/10 border-secondary'
                  : stop.status === 'Departed'
                    ? 'opacity-75'
                    : '',
              )}
            >
              <div className="p-3 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm sm:h-10 sm:w-10 sm:text-base',
                          stop.status === 'Departed'
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-primary/10 text-primary',
                        )}
                      >
                        <div className="text-xs font-medium">{index + 1}</div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-medium">
                          {stop.location}
                        </h3>
                        <div className="text-muted-foreground flex flex-col gap-1 text-xs sm:flex-row sm:gap-4 sm:text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                            {stop.arrival} - {stop.departure}
                          </span>
                          <span className="flex items-center gap-1">
                            <Train className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                            Platform {stop.platform}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={getStatusColor(stop.status)}
                    className="shrink-0 self-start sm:self-center"
                  >
                    {stop.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Train Schedule
            </h2>
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              Last updated: {lastUpdated.toLocaleTimeString()}
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshData}
                className="gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search trains, stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:w-[250px]"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="On Time">On Time</SelectItem>
              <SelectItem value="Delayed">Delayed</SelectItem>
              <SelectItem value="On Route">On Route</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showFavorites ? 'secondary' : 'outline'}
            onClick={() => setShowFavorites(!showFavorites)}
            className="flex items-center gap-2"
          >
            <Star
              className={cn(
                'h-4 w-4',
                showFavorites
                  ? 'fill-secondary-foreground text-secondary-foreground'
                  : 'text-muted-foreground',
              )}
            />
            <span>Show Favorites</span>
          </Button>
        </div>
      </div>

      {/* Table for desktop, Cards for mobile */}
      <div className="hidden sm:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead>Train</TableHead>
                <TableHead>Current Location</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Time Until</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrains.map((train) => (
                <TableRow
                  key={train.id}
                  className="hover:bg-secondary/10 cursor-pointer"
                  onClick={() => setSelectedTrain(train)}
                >
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFavorites((prev) =>
                          prev.includes(train.id)
                            ? prev.filter((id) => id !== train.id)
                            : [...prev, train.id],
                        );
                      }}
                    >
                      <Star
                        className={cn(
                          'h-4 w-4',
                          favorites.includes(train.id)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground',
                        )}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">
                    {train.trainNumber}
                  </TableCell>
                  <TableCell>{train.currentLocation}</TableCell>
                  <TableCell>{train.destination}</TableCell>
                  <TableCell>{train.arrivalTime}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'text-sm',
                        train.status === 'Delayed'
                          ? 'text-destructive'
                          : 'text-muted-foreground',
                      )}
                    >
                      {getCountdown(train.arrivalTime.split(' ')[0])}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(train.status)}>
                      {train.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="space-y-4 sm:hidden">
        {filteredTrains.map(renderTrainCard)}
      </div>
    </div>
  );
}
