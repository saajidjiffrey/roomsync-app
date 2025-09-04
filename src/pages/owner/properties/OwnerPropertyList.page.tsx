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
  useIonModal,
  IonText
} from '@ionic/react';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { add } from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import CreatePropertyModal from '../../../modals/CreateProperty.modal';
import PageHeader from '../../../components/common/PageHeader';
import AppMenu from '../../../components/common/AppMenu';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMyProperties } from '../../../store/slices/propertySlice';
import { showLoadingSpinner, stopLoadingSpinner } from '../../../utils/spinnerUtils';

const OwnerPropertyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { properties, isLoading } = useAppSelector((state) => state.property);

  useEffect(() => {
    const loadProperties = async () => {
      showLoadingSpinner('Loading properties...');
      try {
        await dispatch(fetchMyProperties());
      } finally {
        stopLoadingSpinner();
      }
    };
    loadProperties();
  }, [dispatch]);

  const [present, dismiss] = useIonModal(CreatePropertyModal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  });

  function openModal() {
    present({
      onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
        if (event.detail.role === 'confirm') {
          console.log(`Hello, ${event.detail.data}!`);
          // Refresh properties after creating a new one
          dispatch(fetchMyProperties())
        }
      },
    });
  }

  const renderContent = () => {
    // Global spinner handles all loading states
    console.log('isLoading', isLoading);
    console.log('properties', properties);
    if (!properties || properties.length === 0 && !isLoading) {
      return (
        <div className='ion-text-center ion-padding ion-margin-top'>
          <IonText>
            <p>No properties found. Create your first property!</p>
          </IonText>
        </div>
      );
    }

    return (
      <IonList lines='inset' inset={true}>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </IonList>
    );
  };

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
          {renderContent()}
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