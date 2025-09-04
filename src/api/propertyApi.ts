import { apiService } from './api';
import { ApiResponse } from '../types/api';
import { Property, CreatePropertyRequest } from '../types/property';

// Property API methods
export const propertyAPI = {
  // Create new property
  createProperty: async (data: CreatePropertyRequest): Promise<ApiResponse<Property>> => {
    return apiService.post<Property>('/property', data);
  },

  // Get all properties
  getAllProperties: async (): Promise<ApiResponse<Property[]>> => {
    return apiService.get<Property[]>('/property');
  },

  // Get property by ID
  getPropertyById: async (id: number): Promise<ApiResponse<Property>> => {
    return apiService.get<Property>(`/property/${id}`);
  },

  // Get my properties
  getMyProperties: async (): Promise<ApiResponse<Property[]>> => {
    return apiService.get<Property[]>('/property/my');
  },

  // Update property
  updateProperty: async (id: number, data: Partial<CreatePropertyRequest>): Promise<ApiResponse<Property>> => {
    return apiService.put<Property>(`/property/${id}`, data);
  },

  // Delete property
  deleteProperty: async (id: number): Promise<ApiResponse> => {
    return apiService.delete(`/property/${id}`);
  },

  // Get properties by owner
  getPropertiesByOwner: async (ownerId: number): Promise<ApiResponse<Property[]>> => {
    return apiService.get<Property[]>(`/property/owner/${ownerId}`);
  },
};
