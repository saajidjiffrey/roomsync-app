import api from './api';
import { CreateGroupRequest, JoinGroupRequest, GroupApiResponse } from '../types/group';

export const groupApi = {
  // Get available groups in a property
  getAvailableGroups: async (propertyId: number): Promise<GroupApiResponse> => {
    const response = await api.get(`/group/property/${propertyId}`);
    return response.data;
  },

  // Get groups that the current user has joined
  getMyGroups: async (): Promise<GroupApiResponse> => {
    const response = await api.get('/group/my-groups');
    return response.data;
  },

  // Create a new group
  createGroup: async (groupData: CreateGroupRequest): Promise<GroupApiResponse> => {
    const response = await api.post('/group', groupData);
    return response.data;
  },

  // Join an existing group
  joinGroup: async (joinData: JoinGroupRequest): Promise<GroupApiResponse> => {
    const response = await api.post('/group/join', joinData);
    return response.data;
  },

  // Leave a group
  leaveGroup: async (groupId: number): Promise<GroupApiResponse> => {
    const response = await api.delete(`/group/${groupId}/leave`);
    return response.data;
  },

  // Get group details
  getGroupDetails: async (groupId: number): Promise<GroupApiResponse> => {
    const response = await api.get(`/group/${groupId}`);
    return response.data;
  }
};
