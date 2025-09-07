import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { addNotification, incrementUnreadCount } from '../store/slices/notificationSlice';
import { Notification } from '../api/notificationApi';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  /**
   * Initialize Socket.IO connection
   */
  initialize(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No auth token found, skipping socket connection');
      return;
    }

    // Disconnect existing connection if any
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    const API_BASE_URL = 'http://localhost:3000'; // Direct connection to Socket.IO server
    
    console.log('Initializing Socket.IO connection to:', API_BASE_URL);
    
    this.socket = io(API_BASE_URL, {
      auth: {
        token: token
      },
      transports: ['polling', 'websocket'], // Enable both transports
      forceNew: true, // Force a new connection
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      timeout: 10000 // 10 second timeout
    });

    this.setupEventListeners();
  }

  /**
   * Setup Socket.IO event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
    });

    this.socket.on('reconnect_attempt', (attemptNumber: number) => {
      console.log('Socket reconnection attempt', attemptNumber);
    });

    this.socket.on('reconnect_error', (error: any) => {
      console.error('Socket reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed after all attempts');
      this.isConnected = false;
    });

    this.socket.on('disconnect', (reason: any) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
      
      // For now, just log the error and let the built-in reconnection handle it
      console.log('Connection error, will retry automatically...');
    });

    // Handle incoming notifications
    this.socket.on('notification', (notification: Notification) => {
      console.log('Received notification:', notification);
      
      // Add notification to Redux store
      store.dispatch(addNotification(notification));
      
      // Increment unread count
      store.dispatch(incrementUnreadCount());
      
      // Show toast notification
      this.showNotificationToast(notification);
    });

    // Handle group notifications
    this.socket.on('group_notification', (notification: Notification) => {
      console.log('Received group notification:', notification);
      
      // Add notification to Redux store
      store.dispatch(addNotification(notification));
      
      // Increment unread count
      store.dispatch(incrementUnreadCount());
      
      // Show toast notification
      this.showNotificationToast(notification);
    });

    // Handle broadcast notifications
    this.socket.on('broadcast_notification', (notification: Notification) => {
      console.log('Received broadcast notification:', notification);
      
      // Add notification to Redux store
      store.dispatch(addNotification(notification));
      
      // Increment unread count
      store.dispatch(incrementUnreadCount());
      
      // Show toast notification
      this.showNotificationToast(notification);
    });
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      if (this.socket && !this.isConnected) {
        this.socket.connect();
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000); // Max 30 seconds
      }
    }, this.reconnectDelay);
  }

  /**
   * Force a fresh reconnection (for namespace errors)
   */
  private forceReconnect(): void {
    console.log('Forcing fresh Socket.IO connection...');
    this.disconnect();
    this.reconnectAttempts = 0;
    this.reconnectDelay = 1000;
    
    setTimeout(() => {
      this.initialize();
    }, 1000);
  }

  /**
   * Show notification toast
   */
  private showNotificationToast(notification: Notification): void {
    // Import toast service dynamically to avoid circular dependencies
    import('../services/toast').then(({ default: toastService }) => {
      toastService.info(notification.message, {
        duration: 5000,
        position: 'top'
      });
    });
  }

  /**
   * Join a group room
   */
  joinGroupRoom(groupId: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', groupId);
      console.log(`Joined group room: ${groupId}`);
    }
  }

  /**
   * Leave a group room
   */
  leaveGroupRoom(groupId: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_room', groupId);
      console.log(`Left group room: ${groupId}`);
    }
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('Socket disconnected');
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Reconnect with new token
   */
  reconnectWithNewToken(token: string): void {
    this.disconnect();
    localStorage.setItem('token', token);
    this.initialize();
  }
}

// Export singleton instance
export const socketService = new SocketService();
