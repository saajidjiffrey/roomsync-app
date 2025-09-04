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
  settingsOutline,
  helpOutline,
  informationCircleOutline,
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
              src={"/images/user_placeholder.jpg"}
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
          <IonItem button>
            <IonIcon slot="start" icon={personOutline} />
            <IonLabel>Profile</IonLabel>
          </IonItem>

          <IonItem button>
            <IonIcon slot="start" icon={settingsOutline} />
            <IonLabel>Settings</IonLabel>
          </IonItem>

          <IonItem button>
            <IonIcon slot="start" icon={helpOutline} />
            <IonLabel>Help & Support</IonLabel>
          </IonItem>

          <IonItem button>
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
