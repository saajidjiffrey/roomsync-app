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
import AppMenu from '../../../components/common/AppMenu';

const OwnerRequests: React.FC = () => {
  return (
    <>
      <AppMenu menuId="main-content" />
      <IonPage id="main-content">
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
    </>
  );
};

export default OwnerRequests;