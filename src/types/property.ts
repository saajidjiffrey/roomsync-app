// Property related types

export interface Property {
  id: number;
  name: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  space_available: number;
  property_image?: string;
  tags?: string[];
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePropertyRequest {
  name: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  space_available: number;
  property_image?: string;
  tags?: string[];
}

// Property state interface for Redux store
export interface PropertyState {
  properties: Property[];
  currentProperty: Property | null;
  isLoading: boolean;
  error: string | null;
}
