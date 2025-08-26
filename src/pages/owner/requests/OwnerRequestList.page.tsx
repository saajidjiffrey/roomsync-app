import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { TenantRequest } from '../../../components/property/TenantRequest';

const OwnerRequests: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle >Requests</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Requests</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList lines='inset' inset={true}>
          <TenantRequest />
          <TenantRequest />
          <TenantRequest />
          <TenantRequest />
          <TenantRequest />
          <TenantRequest />
          <TenantRequest />
          <TenantRequest />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default OwnerRequests;