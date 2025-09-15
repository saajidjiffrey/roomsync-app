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
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useEffect } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMyPropertyAds, togglePropertyAdStatus, deletePropertyAd } from '../../../store/slices/propertyAdSlice';
import { showLoadingSpinner, stopLoadingSpinner } from '../../../utils/spinnerUtils';
import { useIonAlert } from '@ionic/react';
import { PropertyAd as PropertyAdType } from '../../../types/propertyAd';
import { IonText } from '@ionic/react';
import { CreatePropertyAdModal } from '../../../modals';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import PropertyAd from '../../../components/property/PropertyAd/PropertyAd';


const OwnerAdsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { propertyAds, isLoading } = useAppSelector((state) => state.propertyAd);
  const [presentAlert] = useIonAlert();

  const [present, dismiss] = useIonModal(CreatePropertyAdModal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  });

  const handleRefresh = async (event: CustomEvent) => {
    try {
      await dispatch(fetchMyPropertyAds());
    } finally {
      event.detail.complete();
    }
  };

  useEffect(() => {
    const loadAds = async () => {
      showLoadingSpinner('Loading ads...');
      try {
        await dispatch(fetchMyPropertyAds());
      } finally {
        stopLoadingSpinner();
      }
    };
    loadAds();
  }, [dispatch]);

  const handleToggleAdStatus = async (ad: PropertyAdType) => {
    try {
      showLoadingSpinner('Updating ad status...');
      await dispatch(togglePropertyAdStatus(ad.id));
      // Refresh ads after status change
      await dispatch(fetchMyPropertyAds());
    } catch (error) {
      console.error('Error toggling ad status:', error);
    } finally {
      stopLoadingSpinner();
    }
  };

  const handleDeleteAd = async (ad: PropertyAdType) => {
    presentAlert({
      header: 'Delete Property Ad',
      message: 'Are you sure you want to delete this property ad? This action cannot be undone.',
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
              showLoadingSpinner('Deleting ad...');
              await dispatch(deletePropertyAd(ad.id));
              // Refresh ads after deletion
              await dispatch(fetchMyPropertyAds());
            } catch (error) {
              console.error('Error deleting ad:', error);
            } finally {
              stopLoadingSpinner();
            }
          },
        },
      ],
    });
  };
  return (
    <IonPage>
        <PageHeader title="My Ads" />
        <IonContent fullscreen>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">My Ads</IonTitle>
            </IonToolbar>
          </IonHeader>
          {(!propertyAds || propertyAds.length === 0) && !isLoading ? (
            <div className='ion-text-center ion-padding ion-margin-top'>
              <IonText>
                <p>No ads found. Create your first ad!</p>
              </IonText>
            </div>
          ) : (
            <IonList lines='inset' inset={true}>
              {propertyAds.map((ad) => (
                <PropertyAd 
                  key={ad.id} 
                  ad={ad} 
                  onToggleStatus={handleToggleAdStatus}
                  onDelete={handleDeleteAd}
                />
              ))}
            </IonList>
          )}
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton onClick={() => {
              present({
                onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
                  if (event.detail.role === 'confirm') {
                    dispatch(fetchMyPropertyAds());
                  }
                },
              });
            }}>
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab>
        </IonContent>
    </IonPage>
  );
};

export default OwnerAdsPage;