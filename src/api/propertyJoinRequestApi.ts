import { apiService } from './api';
import { ApiResponse } from '../types/api';
import { PropertyJoinRequest, CreateJoinRequestPayload } from '../types/propertyJoinRequest';

export const propertyJoinRequestApi = {
  // Create a join request (tenant)
  createJoinRequest: async (data: CreateJoinRequestPayload): Promise<ApiResponse<PropertyJoinRequest>> => {
    return apiService.post<PropertyJoinRequest>('/property/join-request', data);
  },

  // Get current tenant's join requests
  getMyJoinRequests: async (): Promise<ApiResponse<PropertyJoinRequest[]>> => {
    return apiService.get<PropertyJoinRequest[]>('/property/join-requests/my');
  },

  // Get current owner's received join requests
  getOwnerReceivedJoinRequests: async (): Promise<ApiResponse<PropertyJoinRequest[]>> => {
    return apiService.get<PropertyJoinRequest[]>('/property/join-requests/owner');
  },

  // Owner responds to a join request
  respondToJoinRequest: async (requestId: number, status: 'approved' | 'rejected'): Promise<ApiResponse<PropertyJoinRequest>> => {
    return apiService.put<PropertyJoinRequest>(`/property/join-request/${requestId}/respond`, { status });
  },

  // Delete join request
  deleteJoinRequest: async (requestId: number): Promise<ApiResponse> => {
    return apiService.delete(`/property/join-request/${requestId}`);
  },
};


