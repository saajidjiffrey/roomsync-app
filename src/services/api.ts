import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage but don't force page refresh
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Instead of forcing navigation, let the app handle it gracefully
      // The auth state will update and redirect will happen through React Router
    }
    return Promise.reject(error);
  }
);

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Auth types
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

// Auth API methods
export const authAPI = {
  // Register new user
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },

  // Update password
  updatePassword: async (data: PasswordUpdateRequest): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>('/auth/password', data);
    return response.data;
  },

  // Refresh token
  refreshToken: async (token: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh', { token });
    return response.data;
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/logout');
    return response.data;
  },
};

// Generic API methods
export const apiService = {
  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await api.get<ApiResponse<T>>(url);
    return response.data;
  },

  post: async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    const response = await api.post<ApiResponse<T>>(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    const response = await api.put<ApiResponse<T>>(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await api.delete<ApiResponse<T>>(url);
    return response.data;
  },
};

export default api;
