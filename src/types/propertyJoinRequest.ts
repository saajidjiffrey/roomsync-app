export type JoinRequestStatus = 'pending' | 'approved' | 'rejected';

export interface PropertyJoinRequest {
  id: number;
  property_ad_id: number;
  tenant_id: number;
  status: JoinRequestStatus;
  move_in_date?: string | null;
  created_at: string;
  updated_at: string;
  // Optional expanded relations
  propertyAd?: {
    id: number;
    property_id: number;
    number_of_spaces_looking_for: number;
    is_active: boolean;
    property?: {
      id: number;
      name: string;
      address: string;
      space_available: number;
      property_image?: string | null;
    }
  };
  tenant?: {
    id: number;
    user_id: number;
    full_name?: string;
    tenantUser?: {
      id: number;
      full_name: string;
    };
  };
}

export interface CreateJoinRequestPayload {
  property_ad_id: number;
  move_in_date?: string;
}

export interface RespondJoinRequestPayload {
  requestId: number;
  status: Exclude<JoinRequestStatus, 'pending'>;
}

export interface PropertyJoinRequestState {
  myRequests: PropertyJoinRequest[];
  isLoading: boolean;
  error: string | null;
}
