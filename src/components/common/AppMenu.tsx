import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonAvatar,
  IonButton,
  IonItemDivider,
} from '@ionic/react';
import {
  logOutOutline,
  personOutline,
  helpOutline,
  informationCircleOutline,
  peopleOutline,
  homeOutline,
  searchOutline,
  listOutline,
} from 'ionicons/icons';
import { useAuth } from '../../hooks/useAuth';
import { useHistory } from 'react-router-dom';

interface AppMenuProps {
  menuId: string;
}

const AppMenu: React.FC<AppMenuProps> = ({ menuId }) => {
  const { user, logout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      history.push('/landing');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Property Owner';
      case 'tenant':
        return 'Tenant';
      case 'admin':
        return 'Administrator';
      default:
        return role;
    }
  };

  return (
    <IonMenu contentId={menuId}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* User Profile Section */}
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <IonAvatar style={{ width: '80px', height: '80px', margin: '0 auto 8px' }}>
            <img
              src={user?.profile_url ?? "/images/user_placeholder.jpg"}
              alt="User avatar"
            />
          </IonAvatar>
          <IonLabel>
            <h2 style={{ margin: '4px 0', fontWeight: 'bold' }}>
              {user?.full_name || 'User'}
            </h2>
            <p style={{ margin: '4px 0', color: 'var(--ion-color-medium)' }}>
              {user?.email}
            </p>
            <p style={{ margin: '4px 0', fontSize: '0.9em', color: 'var(--ion-color-primary)' }}>
              {getRoleDisplayName(user?.role || '')}
            </p>
          </IonLabel>
        </div>

        <IonItemDivider />

        {/* Menu Items */}
        <IonList>
          {user?.role === 'tenant' && (
            <>
              {/* If tenant has property_id, show View Property link */}
              {user?.tenant_profile?.property_id && (
                <IonItem button onClick={() => history.push(`/tenant/property-details/${user?.tenant_profile?.property_id}`)}>
                  <IonIcon slot="start" icon={homeOutline} />
                  <IonLabel>View Property</IonLabel>
                </IonItem>
              )}
              
              {/* If tenant has group_id, show View Group link */}
              {user?.tenant_profile?.group_id && (
                <IonItem button onClick={() => history.push(`/tenant/group-detail/${user?.tenant_profile?.group_id}`)}>
                  <IonIcon slot="start" icon={peopleOutline} />
                  <IonLabel>View Group</IonLabel>
                </IonItem>
              )}
              
              {/* If tenant doesn't have property_id, show Find Property and View My Requests */}
              {!user?.tenant_profile?.property_id && (
                <>
                  <IonItem button onClick={() => history.push('/tenant/find-property')}>
                    <IonIcon slot="start" icon={searchOutline} />
                    <IonLabel>Find Property</IonLabel>
                  </IonItem>
                  <IonItem button onClick={() => history.push('/tenant/my-requests')}>
                    <IonIcon slot="start" icon={listOutline} />
                    <IonLabel>View My Requests</IonLabel>
                  </IonItem>
                </>
              )}
            </>
          )}
          <IonItem button onClick={() => history.push('/profile')}>
            <IonIcon slot="start" icon={personOutline} />
            <IonLabel>Profile</IonLabel>
          </IonItem>

          <IonItem button onClick={() => history.push(`/${user?.role}/help-support`)}>
            <IonIcon slot="start" icon={helpOutline} />
            <IonLabel>Help & Support</IonLabel>
          </IonItem>

          <IonItem button onClick={() => history.push(`/${user?.role}/about`)}>
            <IonIcon slot="start" icon={informationCircleOutline} />
            <IonLabel>About</IonLabel>
          </IonItem>
        </IonList>

        {/* Logout Button */}
        <div style={{ padding: '16px' }}>
          <IonButton
            expand="block"
            fill="outline"
            color="danger"
            onClick={handleLogout}
          >
            <IonIcon slot="start" icon={logOutOutline} />
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default AppMenu;
