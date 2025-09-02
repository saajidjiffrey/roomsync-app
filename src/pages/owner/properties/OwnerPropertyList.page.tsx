import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonModal
} from '@ionic/react';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { add } from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import CreatePropertyModal from '../../../modals/CreateProperty.modal';
import PageHeader from '../../../components/common/PageHeader';
import AppMenu from '../../../components/common/AppMenu';

const OwnerPropertyPage: React.FC = () => {
  const [present, dismiss] = useIonModal(CreatePropertyModal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  });

  function openModal() {
    present({
      onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
        if (event.detail.role === 'confirm') {
          console.log(`Hello, ${event.detail.data}!`);
        }
      },
    });
  }
  return (
    <>
      <AppMenu menuId="main-content" />
      <IonPage id="main-content">
        <PageHeader title="My Properties" />
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">My Properties</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonList lines='inset' inset={true}>
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
          </IonList>
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton onClick={() => openModal()}>
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonPage>
    </>
  );
};

export default OwnerPropertyPage;