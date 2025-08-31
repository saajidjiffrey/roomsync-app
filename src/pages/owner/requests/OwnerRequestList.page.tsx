import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { TenantRequest } from '../../../components/property/TenantRequest';
import PageHeader from '../../../components/common/PageHeader';

const OwnerRequests: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Requests" />
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