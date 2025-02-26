export type MBTACache = {
  userId?: string; // User id
  endpoint: string;
  path: string;
  cachedAt: number;
  staleTime: number;
  data: object;
};

export type MBTAVehicleAttributes = {
  bearing: number;
  current_status: string; // 'STOPPED_AT' | 'IN_TRANSIT_TO' | 'STOPPED'
  current_stop_sequence: number;
  direction_id: number;
  label: string;
  latitude: number;
  longitude: number;
  revenue: string;
  speed: number; // mph
  updated_at: string;
};

export type MBTAVehicle = {
  attributes: MBTAVehicleAttributes;
  id: string;
  distance?: number; // Meters from user location
};

export type MBTAAlert = {
  id: string;
  attributes: {
    updated_at: string;
    timeframe: string;
    short_header: string;
    severity: number;
    service_effect: string;
    lifecycle: string;
    image_alternative_text: string;
    image: string;
    header: string;
    effect_name: string;
    description: string;
    created_at: string;
    cause: string;
    banner: string;
    active_period: [
      {
        start: string;
        end: string;
      },
    ];
  };
};
