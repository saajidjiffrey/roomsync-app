import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const TestRoute: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Test Route</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Tenant Route Test</h2>
        <p>This page confirms that tenant routes are working properly.</p>
        
        <IonButton onClick={() => history.push('/tenant/find-property')}>
          Go to Find Property
        </IonButton>
        
        <IonButton onClick={() => history.push('/tenant/my-requests')}>
          Go to My Requests
        </IonButton>
        
        <IonButton onClick={() => history.push('/tenant/property-details')}>
          Go to Property Details
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default TestRoute;
