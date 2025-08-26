import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonList,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { PropertyAd } from '../../../components/property/PropertyAd';
import { useRef } from 'react';

const OwnerAdsPage: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle >My Ads</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Ads</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList lines='inset' inset={true}>
          <PropertyAd />
          <PropertyAd />
          <PropertyAd />
          <PropertyAd />
          <PropertyAd />
          <PropertyAd />
          <PropertyAd />
          <PropertyAd />
          <PropertyAd />
        </IonList>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton id="open-modal">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
        <IonModal ref={modal} trigger="open-modal" canDismiss={true}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Create Ad</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => modal.current?.dismiss()}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
          
            <IonSelect label="Select Property" interface="action-sheet" labelPlacement="floating" placeholder="Select Property">
              <IonSelectOption value="1">Property 1</IonSelectOption>
              <IonSelectOption value="2">Property 2</IonSelectOption>
              <IonSelectOption value="3">Property 3</IonSelectOption>
            </IonSelect>
            <IonInput type="number" label="Number of Tenants" labelPlacement="floating" placeholder="Number of Tenants" />
            <div style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'white',
              padding: '16px',
            }}>
              <IonButton className='ion-margin-top' expand="block" color="primary" onClick={() => modal.current?.dismiss()}>Create Ad</IonButton>
              <IonButton className='ion-margin-top' expand="block" color="secondary" onClick={() => modal.current?.dismiss()}>Close</IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default OwnerAdsPage;