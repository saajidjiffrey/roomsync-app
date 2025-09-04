// Property Ad related types

export interface PropertyAd {
  id: number;
  property_id: number;
  number_of_spaces_looking_for: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  // Optional expanded relation (when API includes it)
  property?: {
    id: number;
    name: string;
    address: string;
    space_available: number;
    description?: string | null;
    property_image?: string | null;
    tags?: string[];
    owner_id: number;
    created_at?: string;
    updated_at?: string;
    createdAt?: string;
    updatedAt?: string;
    propertyOwner?: {
      id: number;
      user_id: number;
      ownerUser?: {
        id: number;
        full_name: string;
        email: string;
        phone_no: string;
      }
    }
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
