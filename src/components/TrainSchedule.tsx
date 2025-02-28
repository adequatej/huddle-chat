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

// Mock data for demonstration before we get the real data
const mockTrains = [
  {
    id: '1',
    trainNumber: 'EX101',
    destination: 'Boston',
    departure: '10:00 AM',
    platform: '1',
    status: 'On Time',
  },
  {
    id: '2',
    trainNumber: 'EX102',
    destination: 'New York',
    departure: '10:30 AM',
    platform: '2',
    status: 'Delayed',
  },
  {
    id: '3',
    trainNumber: 'EX103',
    destination: 'Philadelphia',
    departure: '11:00 AM',
    platform: '3',
    status: 'On Time',
  },
];

export function TrainSchedule() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrains = mockTrains.filter(
    (train) =>
      train.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.trainNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Train Schedule</h2>
        <Input
          placeholder="Search trains..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Train</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Departure</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTrains.map((train) => (
            <TableRow key={train.id}>
              <TableCell className="font-medium">{train.trainNumber}</TableCell>
              <TableCell>{train.destination}</TableCell>
              <TableCell>{train.departure}</TableCell>
              <TableCell>{train.platform}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    train.status === 'On Time' ? 'default' : 'destructive'
                  }
                >
                  {train.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
