export type JoinRequestStatus = 'pending' | 'approved' | 'rejected';

export interface PropertyJoinRequest {
  id: number;
  property_ad_id: number;
  tenant_id: number;
  status: JoinRequestStatus;
  move_in_date?: string | null;
  createdAt: string;
  updatedAt: string;
  // Optional expanded relations
  PropertyAd?: {
    id: number;
    property_id: number;
    number_of_spaces_looking_for: number;
    is_active: boolean;
    Property?: {
      id: number;
      name: string;
      address: string;
      space_available: number;
      property_image?: string | null;
      Owner?: {
        id: number;
        user_id: number;
        User?: {
          id: number;
          full_name: string;
        }
      }
    }
  };
  tenant?: {
    id: number;
    user_id: number;
    full_name?: string;
    tenantUser?: {
      id: number;
      full_name: string;
      email: string;
      phone_no: string;
      profile_url: string;
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
