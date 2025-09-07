import React, { useEffect, useState, useCallback } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonText, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonButton, 
  IonIcon, 
  IonRefresher, 
  IonRefresherContent, 
  IonInfiniteScroll, 
  IonInfiniteScrollContent,
  IonBadge,
  IonButtons,
  IonSpinner
} from '@ionic/react';
import { 
  checkmarkDoneOutline, 
  trashOutline, 
  timeOutline, 
  personOutline,
  cardOutline,
  homeOutline,
  peopleOutline,
  clipboardOutline,
  alertCircleOutline
} from 'ionicons/icons';
import PageHeader from '../../../components/common/PageHeader';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  fetchNotifications, 
  fetchUnreadCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification 
} from '../../../store/slices/notificationSlice';
import { showLoadingSpinner, stopLoadingSpinner } from '../../../utils/spinnerUtils';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '../../../api/notificationApi';

const Notifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isLoading, hasMore } = useAppSelector((state) => state.notifications);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const loadNotifications = useCallback(async (reset = false) => {
    const currentOffset = reset ? 0 : offset;
    
    if (reset) {
      setOffset(0);
    }

    try {
      await dispatch(fetchNotifications({ 
        limit, 
        offset: currentOffset 
      }));
      
      if (!reset) {
        setOffset(currentOffset + limit);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, [dispatch, limit, offset]);

  const loadUnreadCount = useCallback(async () => {
    try {
      await dispatch(fetchUnreadCount());
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []); // Only run once on mount

  const handleRefresh = async (event: CustomEvent) => {
    await loadNotifications(true);
    await loadUnreadCount();
    event.detail.complete();
  };

  const handleInfiniteScroll = async (event: CustomEvent) => {
    if (hasMore && !isLoading) {
      await loadNotifications();
    }
    event.detail.complete();
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await dispatch(markNotificationAsRead(notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      showLoadingSpinner('Marking all as read...');
      await dispatch(markAllNotificationsAsRead());
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      stopLoadingSpinner();
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await dispatch(deleteNotification(notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'expense_created':
        return cardOutline;
      case 'split_paid':
        return checkmarkDoneOutline;
      case 'property_joined':
        return homeOutline;
      case 'property_join_requested':
        return personOutline;
      case 'group_joined':
        return peopleOutline;
      case 'task_assigned':
        return clipboardOutline;
      case 'task_reminder':
        return alertCircleOutline;
      default:
        return timeOutline;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'expense_created':
        return 'primary';
      case 'split_paid':
        return 'success';
      case 'property_joined':
        return 'tertiary';
      case 'property_join_requested':
        return 'warning';
      case 'group_joined':
        return 'secondary';
      case 'task_assigned':
        return 'danger';
      case 'task_reminder':
        return 'warning';
      default:
        return 'medium';
    }
  };

  const renderNotificationItem = (notification: Notification) => (
    <IonItem key={notification.id} className={!notification.is_read ? 'ion-margin-bottom' : ''}>
      <IonIcon 
        icon={getNotificationIcon(notification.type)} 
        color={getNotificationColor(notification.type)}
        slot="start"
      />
      <IonLabel>
        <h3 className={!notification.is_read ? 'font-weight-bold' : ''}>
          {notification.message}
        </h3>
        <p className="ion-text-wrap">
          <IonIcon icon={timeOutline} size="small" className="ion-margin-end" />
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
        {notification.sender && (
          <p className="ion-text-wrap">
            <IonIcon icon={personOutline} size="small" className="ion-margin-end" />
            From: {notification.sender.User?.full_name}
          </p>
        )}
      </IonLabel>
      
      {!notification.is_read && (
        <IonBadge color="primary" slot="end">
          New
        </IonBadge>
      )}
      
      <IonButtons slot="end">
        {!notification.is_read && (
          <IonButton 
            fill="clear" 
            size="small"
            onClick={() => handleMarkAsRead(notification.id)}
          >
            <IonIcon icon={checkmarkDoneOutline} />
          </IonButton>
        )}
        <IonButton 
          fill="clear" 
          size="small" 
          color="danger"
          onClick={() => handleDeleteNotification(notification.id)}
        >
          <IonIcon icon={trashOutline} />
        </IonButton>
      </IonButtons>
    </IonItem>
  );

  const renderContent = () => {
    if (isLoading && notifications.length === 0) {
      return (
        <div className="ion-text-center ion-padding">
          <IonSpinner name="crescent" />
          <p>Loading notifications...</p>
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="ion-text-center ion-padding ion-margin-top">
          <IonIcon icon={timeOutline} size="large" color="medium" />
          <IonText>
            <h2>No notifications</h2>
            <p>You're all caught up! New notifications will appear here.</p>
          </IonText>
        </div>
      );
    }

    return (
      <>
        <IonList>
          {notifications.map(renderNotificationItem)}
        </IonList>
        
        {hasMore && (
          <IonInfiniteScroll onIonInfinite={handleInfiniteScroll}>
            <IonInfiniteScrollContent loadingSpinner="bubbles" />
          </IonInfiniteScroll>
        )}
      </>
    );
  };

  return (
    <IonPage>
      <PageHeader 
        title="Notifications" 
        rightContent={
          unreadCount > 0 && (
            <IonButton 
              fill="clear" 
              size="small"
              onClick={handleMarkAllAsRead}
            >
              <IonIcon icon={checkmarkDoneOutline} slot="start" />
              Mark All Read
            </IonButton>
          )
        }
      />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        
        {renderContent()}
      </IonContent>
    </IonPage>
  );
};

export default Notifications;
