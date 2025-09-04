import { apiService } from './api';
import { ApiResponse } from '../types/api';
import { PropertyAd, CreatePropertyAdRequest } from '../types/propertyAd';

// Property API methods
export const propertyAdApi = {
  // Create new property ad
  createPropertyAd: async (data: CreatePropertyAdRequest): Promise<ApiResponse<PropertyAd>> => {
    return apiService.post<PropertyAd>('/property-ad', data);
  },

  // Get all property ads
  getAllPropertyAds: async (params?: { is_active?: boolean }): Promise<ApiResponse<PropertyAd[]>> => {
    const searchParams = params ? `?${new URLSearchParams(Object.entries(params).reduce((acc, [k, v]) => {
      if (v !== undefined && v !== null) acc[k] = String(v);
      return acc;
    }, {} as Record<string, string>)).toString()}` : '';
    return apiService.get<PropertyAd[]>(`/property-ad${searchParams}`);
  },

  // Get my property ads (owner)
  getMyPropertyAds: async (): Promise<ApiResponse<PropertyAd[]>> => {
    return apiService.get<PropertyAd[]>('/property-ad/my');
  },

  // Get property ad by ID
  getPropertyAdById: async (id: number): Promise<ApiResponse<PropertyAd>> => {
    return apiService.get<PropertyAd>(`/property-ad/${id}`);
  },

  // Update property ad
  updatePropertyAd: async (id: number, data: Partial<CreatePropertyAdRequest>): Promise<ApiResponse<PropertyAd>> => {
    return apiService.put<PropertyAd>(`/property-ad/${id}`, data);
  },

  // Delete property ad
  deletePropertyAd: async (id: number): Promise<ApiResponse> => {
    return apiService.delete(`/property-ad/${id}`);
  },
};
