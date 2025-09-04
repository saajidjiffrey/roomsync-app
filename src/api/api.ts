import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '../types/api';

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

// Helper function to handle API errors and extract validation errors
function handleApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // For 400 validation errors, extract the error response data
    if (axiosError.response?.status === 400 && axiosError.response.data) {
      const errorData = axiosError.response.data as { errors?: Array<{ field: string; message: string }> };
      
      // If it's a validation error with field-specific errors, create a custom error
      if (errorData.errors && Array.isArray(errorData.errors)) {
        const validationError = new Error('Validation failed');
        (validationError as Error & { response: { status: number; data: unknown } }).response = {
          status: 400,
          data: errorData
        };
        return validationError;
      }
    }
    
    // For other errors, preserve the original error structure
    return axiosError;
  }
  
  return error as Error;
}

// Generic API methods
export const apiService = {
  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    try {
      const response = await api.get<ApiResponse<T>>(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  post: async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    try {
      const response = await api.post<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  put: async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    try {
      const response = await api.put<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    try {
      const response = await api.delete<ApiResponse<T>>(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default api;
