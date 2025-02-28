'use client';
import React, { useState, useEffect } from 'react';
import { MBTAAlert } from '@/lib/types/mbta';

function AlertsPage() {
  const [alerts, setAlerts] = useState<MBTAAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

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
    //const shortHeader = alert.attributes.short_header;
    const searchLower = searchTerm.toLowerCase();

    return (
      (shortHeader && shortHeader.toLowerCase().includes(searchLower)) ||
      (header && header.toLowerCase().includes(searchLower)) ||
      (description && description.toLowerCase().includes(searchLower)) ||
      (serviceEffect && serviceEffect.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="flex h-screen flex-col">
      <div className="sticky top-0 z-10 flex flex-col p-4 px-8 shadow-lg">
        <h1 className="mb-2 text-xl font-bold">All Alerts</h1>
        <input
          type="text"
          placeholder="Search alerts..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-200 rounded-lg border border-gray-300 p-2"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        {filteredAlerts.length === 0 ? (
          <p>No alerts match the search criteria.</p>
        ) : (
          <ul className="space-y-4">
            {filteredAlerts.map((alert) => (
              <li key={alert.id} className="rounded-lg border p-4 shadow">
                <h2 className="font-semibold">
                  {alert.attributes.short_header || alert.attributes.header}
                </h2>
                <p className="text-gray-600">{alert.attributes.description}</p>
                <p className="text-sm text-red-500">
                  {alert.attributes.service_effect}
                </p>
                <p className="text-gray-400">
                  Last updated {alert.attributes.updated_at}
                </p>
              </li>
            ))}
          </ul>
        )}
        !qa@wz
      </div>
    </div>
  );
}

export default AlertsPage;
