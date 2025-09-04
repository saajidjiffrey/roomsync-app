// Property Ad related types

export interface PropertyAd {
  id: number;
  property_id: number;
  number_of_spaces_looking_for: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Optional expanded relation (when API includes it)
  property?: {
    id: number;
    name: string;
    address: string;
    space_available: number;
  };
}

export interface CreatePropertyAdRequest {
  property_id: number;
  number_of_spaces_looking_for: number;
  is_active?: boolean;
}

// Property Ad state interface for Redux store
export interface PropertyAdState {
  propertyAds: PropertyAd[];
  currentPropertyAd: PropertyAd | null;
  isLoading: boolean;
  error: string | null;
}
