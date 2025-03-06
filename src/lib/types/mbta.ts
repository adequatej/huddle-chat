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

export type MBTAStopAttributes = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  municipality: string;
  platform_name?: string;
  wheelchair_boarding?: number;
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

export type MBTAAPIVehicle = {
  relationships: {
    route: { data: { id: string } };
    trip: { data: { id: string } };
    stop: { data: { id: string } };
  };
  id: string;
  attributes: MBTAVehicleAttributes;
};

export type MBTARouteAttributes = {
  long_name: string;
  short_name: string;
  description: string;
  color: string;
  text_color: string;
  sort_order: number;
};

export type MBTAAPIRoute = {
  id: string;
  attributes: MBTARouteAttributes;
};

// Implemented Frontend data models (transformed from API responses) to help with type safety

/**
 * The flattened vehicle data that frontend components actually receive
 * This is what comes back from the route-vehicles API endpoint
 */
export interface VehicleData {
  id: string;
  label: string;
  current_status: string;
  updated_at: string;
  bearing: number;
  speed: number;
  latitude: number;
  longitude: number;
}

/**
 * A train route as seen by the frontend
 * Comes from the routes API endpoint
 */
export interface Route {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  textColor: string;
  sortOrder: number;
}

/**
 * A train stop as seen by the frontend
 * Comes from the vehicle-stops API endpoint
 */
export interface Stop {
  id: string;
  name: string;
  arrivalTime: string | null;
  departureTime: string | null;
  stopSequence: number;
  platformName?: string;
  municipality: string;
  status: string;
  wheelchairBoarding?: number;
}

/**
 * A complete train with all its details as used in the UI
 * Built from multiple API responses
 */
export interface Train {
  id: string;
  trainNumber: string;
  destination: string;
  currentLocation: string;
  status: string;
  arrivalTime: string;
  alerts: string[];
  stops: Stop[];
  currentStop?: Stop;
  bearing?: number;
  speed?: number;
  latitude?: number;
  longitude?: number;
}
