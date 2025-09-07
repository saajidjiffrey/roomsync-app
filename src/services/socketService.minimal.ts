// Minimal Socket.IO service for Docker build compatibility
import { store } from '../store';
import { addNotification, incrementUnreadCount } from '../store/slices/notificationSlice';
import { Notification } from '../api/notificationApi';

class SocketService {
  private isConnected = false;

  /**
   * Initialize Socket.IO connection (disabled for Docker build)
   */
  initialize(): void {
    console.log('Socket.IO service initialized (real-time disabled for Docker build)');
    this.isConnected = false;
  }

  /**
   * Join a group room (no-op for Docker build)
   */
  joinGroupRoom(groupId: number): void {
    console.log(`Would join group room: ${groupId} (disabled for Docker build)`);
  }

  /**
   * Leave a group room (no-op for Docker build)
   */
  leaveGroupRoom(groupId: number): void {
    console.log(`Would leave group room: ${groupId} (disabled for Docker build)`);
  }

  /**
   * Disconnect socket (no-op for Docker build)
   */
  disconnect(): void {
    console.log('Socket disconnected (disabled for Docker build)');
    this.isConnected = false;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Get socket instance (returns null for Docker build)
   */
  getSocket(): any {
    return null;
  }

  /**
   * Reconnect with new token (no-op for Docker build)
   */
  reconnectWithNewToken(token: string): void {
    console.log('Would reconnect with new token (disabled for Docker build)');
  }

  // All notification methods are no-ops for Docker build
  sendNotificationToUser(userId: number, notification: Notification): void {
    console.log(`Would send notification to user ${userId} (disabled for Docker build)`);
  }

  sendNotificationToTenant(tenantId: number, notification: Notification): void {
    console.log(`Would send notification to tenant ${tenantId} (disabled for Docker build)`);
  }

  sendNotificationToGroup(groupId: number, notification: Notification): void {
    console.log(`Would send notification to group ${groupId} (disabled for Docker build)`);
  }

  sendNotificationToUsers(userIds: number[], notification: Notification): void {
    console.log(`Would send notification to ${userIds.length} users (disabled for Docker build)`);
  }

  sendNotificationToTenants(tenantIds: number[], notification: Notification): void {
    console.log(`Would send notification to ${tenantIds.length} tenants (disabled for Docker build)`);
  }

  broadcastNotification(notification: Notification): void {
    console.log('Would broadcast notification (disabled for Docker build)');
  }

  getConnectedUsersCount(): number {
    return 0;
  }

  getConnectedUsers(): any[] {
    return [];
  }
}

// Export singleton instance
export const socketService = new SocketService();
