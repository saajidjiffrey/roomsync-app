import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonIcon,
} from '@ionic/react';
import { shieldCheckmarkOutline, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const UnauthorizedPage: React.FC = () => {
  const history = useHistory();
  const { userRole } = useAuth();

  const getHomeRoute = () => {
    switch (userRole) {
      case 'owner':
        return '/owner/my-properties';
      case 'tenant':
        return '/tenant/find-property';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/landing';
    }
  };

  const handleGoHome = () => {
    history.push(getHomeRoute());
  };

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Unauthorized Access</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
          <IonIcon 
            icon={shieldCheckmarkOutline} 
            style={{ fontSize: '4rem', color: 'var(--ion-color-warning)' }}
          />
          
          <IonText color="warning">
            <h1>Access Denied</h1>
          </IonText>
          
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
            You don't have permission to access this page. 
            Please contact your administrator if you believe this is an error.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <IonButton onClick={handleGoBack} fill="outline">
              <IonIcon icon={arrowBackOutline} slot="start" />
              Go Back
            </IonButton>
            
            <IonButton onClick={handleGoHome} color="primary">
              Go to Home
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UnauthorizedPage;
