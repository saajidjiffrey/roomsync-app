import api from './api';
import { ApiResponse } from '../types/api';

export interface Notification {
  id: number;
  message: string;
  type: 'expense_created' | 'split_paid' | 'property_joined' | 'property_join_requested' | 'group_joined' | 'task_assigned' | 'task_reminder';
  recipient_id: number;
  sender_id?: number;
  is_read: boolean;
  related_entity_type?: 'expense' | 'split' | 'property' | 'property_join_request' | 'group' | 'task';
  related_entity_id?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  sender?: {
    id: number;
    User: {
      id: number;
      full_name: string;
      email: string;
    };
  };
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationQueryParams {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}

class NotificationApi {
  /**
   * Get notifications for the current user
   */
  async getNotifications(params: NotificationQueryParams = {}): Promise<ApiResponse<NotificationListResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.unreadOnly) queryParams.append('unreadOnly', params.unreadOnly.toString());
    
    const response = await api.get(`/notifications?${queryParams.toString()}`);
    return response.data;
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<ApiResponse<UnreadCountResponse>> {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: number): Promise<ApiResponse<Notification>> {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse<{ updatedCount: number }>> {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: number): Promise<ApiResponse<null>> {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }
}

export const notificationApi = new NotificationApi();
