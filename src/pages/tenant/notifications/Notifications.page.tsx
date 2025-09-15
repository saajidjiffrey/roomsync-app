import React, { useEffect, useCallback, useRef } from 'react';
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
  deleteNotification 
} from '../../../store/slices/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '../../../api/notificationApi';

const Notifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications, isLoading, hasMore } = useAppSelector((state) => state.notifications);
  const limit = 20;
  const offsetRef = useRef(0);

  const loadNotifications = useCallback(async (reset = false) => {
    if (reset) {
      offsetRef.current = 0;
    }

    try {
      const currentOffset = reset ? 0 : offsetRef.current;
      await dispatch(fetchNotifications({ 
        limit, 
        offset: currentOffset 
      }));
      
      if (!reset) {
        const newOffset = currentOffset + limit;
        offsetRef.current = newOffset;
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, [dispatch, limit]);

  const loadUnreadCount = useCallback(async () => {
    try {
      await dispatch(fetchUnreadCount());
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    const loadInitialData = async () => {
      await loadNotifications(true); // Load initial notifications
      await loadUnreadCount();
    };
    
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

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


  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await dispatch(deleteNotification(notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const formatNotificationDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
      return 'No date';
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };


  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'expense_created':
        return cardOutline;
      case 'split_paid':
        return checkmarkDoneOutline;
      case 'split_confirmed':
        return checkmarkDoneOutline;
      case 'property_joined':
        return homeOutline;
      case 'property_join_requested':
        return personOutline;
      case 'property_left':
        return homeOutline;
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
      case 'split_confirmed':
        return 'success';
      case 'property_joined':
        return 'tertiary';
      case 'property_join_requested':
        return 'warning';
      case 'property_left':
        return 'danger';
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
        <p className="ion-text-wrap d-flex align-items-center mt-2">
          <IonIcon icon={timeOutline} size="small" className="me-2" />
          {formatNotificationDate(notification.createdAt)}
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
