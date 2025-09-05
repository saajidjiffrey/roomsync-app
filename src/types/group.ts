export interface Group {
  id: number;
  name: string;
  description?: string;
  property_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  // Additional fields that might be populated by API
  member_count?: number;
  max_members?: number;
  is_joined?: boolean;
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
