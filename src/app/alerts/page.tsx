'use client';
import React, { useState, useEffect } from 'react';
import { MBTAAlert } from '@/lib/types/mbta';
import { Header } from '@/components/Header';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

function AlertsPage() {
  const [alerts, setAlerts] = useState<MBTAAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`/api/mbta/alerts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await res.json();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredAlerts = alerts.filter((alert) => {
    const {
      header,
      description,
      service_effect: serviceEffect,
      short_header: shortHeader,
    } = alert.attributes;
    // const serviceEffect = alert.attributes.service_effect;
    // const shortHeader = alert.attributes.short_header;
    const searchLower = searchTerm.toLowerCase();

    const searchContains =
      (shortHeader && shortHeader.toLowerCase().includes(searchLower)) ||
      (header && header.toLowerCase().includes(searchLower)) ||
      (description && description.toLowerCase().includes(searchLower)) ||
      (serviceEffect && serviceEffect.toLowerCase().includes(searchLower));

    const filterMatches = filter ? alert.attributes.effect === filter : true;

    return searchContains && filterMatches;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <div className="fixed top-0 right-0 left-0 z-50">
        <Header />
      </div>
      <div className="mx-auto mt-16 flex max-w-3xl flex-1 flex-col">
        <div className="bg-background sticky top-16 z-10 flex flex-col p-4 px-8">
          <h1 className="mb-2 text-xl font-bold">All Alerts</h1>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="max-w-md"
            />

            <div className="flex w-full max-w-56 flex-row items-center gap-2">
              <Select
                onValueChange={(value) => setFilter(value)}
                value={filter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter alerts..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Alert Types</SelectLabel>
                    <SelectItem value="DELAY">
                      <Badge variant="secondary">Delay</Badge>
                    </SelectItem>
                    <SelectItem value="SERVICE_CHANGE">
                      <Badge variant="secondary">Service Change</Badge>
                    </SelectItem>
                    <SelectItem value="TRACK_CHANGE">
                      <Badge variant="secondary">Track Change</Badge>
                    </SelectItem>
                    <SelectItem value="STATION_ISSUE">
                      <Badge variant="secondary">Station Issue</Badge>
                    </SelectItem>
                    <SelectItem value="STATION_CLOSURE">
                      <Badge variant="secondary">Station Closure</Badge>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {filter && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setFilter('')}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          {filteredAlerts.length === 0 ? (
            <p>No alerts match the search criteria.</p>
          ) : (
            <Accordion type="single" collapsible>
              {filteredAlerts
                .sort((a, b) => {
                  // order the list by date
                  const date1 = new Date(a.attributes.updated_at);
                  const date2 = new Date(b.attributes.updated_at);
                  return date2.getTime() - date1.getTime();
                })
                .map((alert) => (
                  <AccordionItem value={alert.id} key={alert.id}>
                    <AccordionTrigger>
                      <div className="flex flex-col gap-0">
                        <Badge variant="secondary" className="mb-1">
                          {alert.attributes.effect.split('_').map((word) => (
                            <span key={word}>
                              {word.charAt(0) +
                                word.slice(1).toLowerCase()}{' '}
                            </span>
                          ))}
                        </Badge>
                        {alert.attributes.short_header ||
                          alert.attributes.header}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="reactMarkDown">
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {alert.attributes.description ||
                            'No description provided.'}
                        </Markdown>
                      </div>

                      {alert.attributes.image && (
                        <Image
                          src={alert.attributes.image}
                          alt={
                            alert.attributes.image_alternative_text ||
                            'Alert image'
                          }
                          width={500}
                          height={300}
                          className="mx-auto my-3 rounded-lg border"
                        />
                      )}

                      <Badge className="my-3" variant={'secondary'}>
                        {alert.attributes.service_effect}
                      </Badge>
                      <p className="text-foreground/65">
                        Last updated{' '}
                        {new Date(
                          alert.attributes.updated_at,
                        ).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        })}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlertsPage;
