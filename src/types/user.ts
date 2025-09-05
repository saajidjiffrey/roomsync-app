// User and authentication related types

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone_no: string;
  occupation?: string;
  profile_url?: string;
  role: 'admin' | 'owner' | 'tenant';
  created_at: string;
  updated_at: string;
  // When tenant, backend may include tenant profile with group_id and property_id
  tenant_profile?: {
    id: number;
    user_id: number;
    property_id?: number | null;
    group_id?: number | null;
    created_at?: string;
    updated_at?: string;
  };
  owner_profile?: {
    id: number;
    user_id: number;
    created_at?: string;
    updated_at?: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  phone_no: string;
  occupation?: string;
  role?: 'admin' | 'owner' | 'tenant';
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

// Auth state interface for Redux store
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
