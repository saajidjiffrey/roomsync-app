export interface GroupMember {
  id: number;
  user_id: number;
  group_id: number;
  property_id: number;
  tenantUser?: {
    id: number;
    full_name: string;
    email: string;
    phone_no?: string;
  };
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  property_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  group_image_url?: string;
  // Additional fields that might be populated by API
  member_count?: number;
  max_members?: number;
  is_joined?: boolean;
  members?: GroupMember[];
  created_by_user?: {
    id: number;
    full_name: string;
    email: string;
  };
  property?: {
    id: number;
    name: string;
  };
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  property_id: number;
  group_image_url?: string;
}

export interface JoinGroupRequest {
  group_id: number;
}

export interface GroupState {
  availableGroups: Group[];
  myGroups: Group[];
  isLoading: boolean;
  error: string | null;
}

export interface GroupApiResponse {
  success: boolean;
  message: string;
  data?: Group | Group[];
}
