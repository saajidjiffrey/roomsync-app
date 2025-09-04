import { apiService } from './api';
import { ApiResponse } from '../types/api';
import { User, AuthResponse, LoginRequest, RegisterRequest, PasswordUpdateRequest } from '../types/user';

// Auth API methods
export const authAPI = {
  // Register new user
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    return response;
  },

  // Login user
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>('/auth/login', data);
    return response;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiService.get<User>('/auth/profile');
    return response;
  },

  // Update password
  updatePassword: async (data: PasswordUpdateRequest): Promise<ApiResponse<User>> => {
    const response = await apiService.put<User>('/auth/password', data);
    return response;
  },

  // Refresh token
  refreshToken: async (token: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>('/auth/refresh', { token });
    return response;
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    const response = await apiService.post('/auth/logout');
    return response;
  },
};
