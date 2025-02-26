'use client';
import { useState, useEffect } from 'react';
import { MBTAAlert } from '@/lib/types/mbta';

function AlertsPage() {
  const [alerts, setAlerts] = useState<MBTAAlert[]>([]);

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

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Alerts</h1>
      {alerts.length === 0 ? (
        <p>No active alerts.</p>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li key={alert.id} className="rounded-lg border p-4 shadow">
              <h2 className="font-semibold">
                {alert.attributes.short_header || alert.attributes.header}
              </h2>
              <p className="text-gray-600">{alert.attributes.description}</p>
              <p className="text-sm text-red-500">
                {alert.attributes.service_effect}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AlertsPage;
