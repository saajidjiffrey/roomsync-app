import { io, Socket } from 'socket.io-client';

class SimpleSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

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
    
    console.log('Initializing simple Socket.IO connection to:', API_BASE_URL);
    
    this.socket = io(API_BASE_URL, {
      transports: ['polling'],
      upgrade: false,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      timeout: 10000
    });

    this.setupEventListeners();
  }

  /**
   * Setup Socket.IO event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Simple Socket connected:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason: any) => {
      console.log('❌ Simple Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('❌ Simple Socket connection error:', error);
      this.isConnected = false;
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log('🔄 Simple Socket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
    });

    this.socket.on('reconnect_attempt', (attemptNumber: number) => {
      console.log('🔄 Simple Socket reconnection attempt', attemptNumber);
    });

    this.socket.on('reconnect_error', (error: any) => {
      console.error('❌ Simple Socket reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Simple Socket reconnection failed after all attempts');
      this.isConnected = false;
    });

    // Handle incoming notifications
    this.socket.on('notification', (notification: any) => {
      console.log('📨 Received notification:', notification);
    });

    this.socket.on('group_notification', (notification: any) => {
      console.log('📨 Received group notification:', notification);
    });

    this.socket.on('broadcast_notification', (notification: any) => {
      console.log('📨 Received broadcast notification:', notification);
    });
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('Simple Socket disconnected');
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
}

// Export singleton instance
export const simpleSocketService = new SimpleSocketService();
