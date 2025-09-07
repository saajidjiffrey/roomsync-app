import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { notificationApi, Notification, NotificationQueryParams, UnreadCountResponse } from '../../api/notificationApi';
import toastService from '../../services/toast';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params: NotificationQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getNotifications(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUnreadCount();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      const response = await notificationApi.markAsRead(notificationId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.markAllAsRead();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

// State interface
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  isUnreadCountLoading: boolean;
  error: string | null;
  lastFetchParams: NotificationQueryParams | null;
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  total: 0,
  hasMore: false,
  isLoading: false,
  isUnreadCountLoading: false,
  error: null,
  lastFetchParams: null,
};

// Notification slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.total = 0;
      state.hasMore = false;
      state.lastFetchParams = null;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Add new notification to the beginning of the list
      state.notifications.unshift(action.payload);
      state.total += 1;
      state.unreadCount += 1;
    },
    updateNotification: (state, action: PayloadAction<Notification>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload.id);
      if (index !== -1) {
        state.notifications[index] = action.payload;
      }
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
      state.total -= 1;
      
      // Decrease unread count if the deleted notification was unread
      if (notification && !notification.is_read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.notifications = action.payload.notifications;
          state.total = action.payload.total;
          state.hasMore = action.payload.hasMore;
        }
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      
      // Fetch unread count
      .addCase(fetchUnreadCount.pending, (state) => {
        state.isUnreadCountLoading = true;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.isUnreadCountLoading = false;
        if (action.payload) {
          state.unreadCount = action.payload.count;
        }
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.isUnreadCountLoading = false;
        console.error('Failed to fetch unread count:', action.payload);
      })
      
      // Mark notification as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = action.payload;
        if (notification) {
          const index = state.notifications.findIndex(n => n.id === notification.id);
          
          if (index !== -1) {
            const wasUnread = !state.notifications[index].is_read;
            state.notifications[index] = notification;
            
            // Decrease unread count if the notification was previously unread
            if (wasUnread) {
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
          }
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        toastService.error(action.payload as string);
      })
      
      // Mark all notifications as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        // Update all notifications to be read
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          is_read: true
        }));
        state.unreadCount = 0;
        
        const updatedCount = action.payload?.updatedCount || 0;
        if (updatedCount > 0) {
          toastService.success(`Marked ${updatedCount} notifications as read`);
        }
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        toastService.error(action.payload as string);
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload;
        if (notificationId) {
          const notification = state.notifications.find(n => n.id === notificationId);
          
          state.notifications = state.notifications.filter(n => n.id !== notificationId);
          state.total -= 1;
          
          // Decrease unread count if the deleted notification was unread
          if (notification && !notification.is_read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          
          toastService.success('Notification deleted successfully');
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        toastService.error(action.payload as string);
      });
  },
});

export const {
  clearError,
  clearNotifications,
  addNotification,
  updateNotification,
  removeNotification,
  incrementUnreadCount,
  decrementUnreadCount,
  resetUnreadCount
} = notificationSlice.actions;

export default notificationSlice.reducer;
