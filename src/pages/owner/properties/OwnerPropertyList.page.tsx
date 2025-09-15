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
  IonText,
  IonRefresher,
  IonRefresherContent,
  IonModal
} from '@ionic/react';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { add } from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import CreatePropertyModal from '../../../modals/CreateProperty.modal';
import PageHeader from '../../../components/common/PageHeader';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMyProperties, deleteProperty } from '../../../store/slices/propertySlice';
import { showLoadingSpinner, stopLoadingSpinner } from '../../../utils/spinnerUtils';
import { useIonAlert, useIonModal } from '@ionic/react';
import EditPropertyModal from '../../../modals/EditProperty.modal';
import { Property } from '../../../types/property';

const OwnerPropertyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { properties, isLoading } = useAppSelector((state) => state.property);
  const [presentAlert] = useIonAlert();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

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

  // const [presentEditModal] = useIonModal(EditPropertyModal);

  const handleRefresh = async (event: CustomEvent) => {
    try {
      await dispatch(fetchMyProperties());
    } finally {
      event.detail.complete();
    }
  };

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

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const handleEditModalDismiss = (data?: string | number | null | undefined, role?: string) => {
    setIsEditModalOpen(false);
    setSelectedProperty(null);
    if (role === 'confirm') {
      // Refresh properties after editing
      dispatch(fetchMyProperties());
    }
  };

  const handleDeleteProperty = async (property: Property) => {
    presentAlert({
      header: 'Delete Property',
      message: 'Are you sure you want to delete this property? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            try {
              showLoadingSpinner('Deleting property...');
              await dispatch(deleteProperty(property.id));
              // Refresh properties after deletion
              await dispatch(fetchMyProperties());
            } catch (error) {
              console.error('Error deleting property:', error);
            } finally {
              stopLoadingSpinner();
            }
          },
        },
      ],
    });
  };

  const renderContent = () => {
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
          <PropertyCard 
            key={property.id} 
            property={property} 
            onEdit={handleEditProperty}
            onDelete={handleDeleteProperty}
          />
        ))}
      </IonList>
    );
  };

  return (
    <IonPage>
        <PageHeader title="My Properties" />
        <IonContent fullscreen>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
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
        
        <IonModal isOpen={isEditModalOpen} onDidDismiss={() => setIsEditModalOpen(false)}>
          {selectedProperty && (
            <EditPropertyModal 
              property={selectedProperty} 
              dismiss={handleEditModalDismiss}
            />
          )}
        </IonModal>
    </IonPage>
  );
};

export default OwnerPropertyPage;