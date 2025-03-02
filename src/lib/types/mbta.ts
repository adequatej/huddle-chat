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

export type MBTAAPISchedule = {
  attributes: {
    arrival_time: string | null;
    departure_time: string | null;
    direction_id: number;
    drop_off_type: number;
    pickup_type: number;
    stop_headsign: string | null;
    stop_sequence: number;
    timepoint: boolean;
  };
  id: string;
  relationships: {
    route: {
      data: {
        id: string;
        type: string;
      };
    };
    stop: {
      data: {
        id: string;
        type: string;
      };
    };
    trip: {
      data: {
        id: string;
        type: string;
      };
    };
  };
  type: string;
};
