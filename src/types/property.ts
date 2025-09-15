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
  monthly_rent_per_person?: number;
  owner_id: number;
  created_at: string;
  updated_at: string;
  PropertyAds?: Array<{
    id: number;
    property_id: number;
    number_of_spaces_looking_for: number;
    is_active: boolean;
  }>;
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
  monthly_rent_per_person?: number;
}

// Property state interface for Redux store
export interface PropertyState {
  properties: Property[];
  currentProperty: Property | null;
  isLoading: boolean;
  error: string | null;
}
