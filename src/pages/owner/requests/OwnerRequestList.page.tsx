import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText
} from '@ionic/react';
import { TenantRequest } from '../../../components/property/TenantRequest';
import PageHeader from '../../../components/common/PageHeader';
import AppMenu from '../../../components/common/AppMenu';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOwnerReceivedJoinRequests } from '../../../store/slices/propertyJoinRequestSlice';
import { showLoadingSpinner, stopLoadingSpinner } from '../../../utils/spinnerUtils';

const OwnerRequests: React.FC = () => {
  const dispatch = useAppDispatch();
  const { myRequests } = useAppSelector((state) => state.joinRequest);

  useEffect(() => {
    const loadRequests = async () => {
      showLoadingSpinner('Loading requests...');
      try {
        await dispatch(fetchOwnerReceivedJoinRequests());
      } finally {
        stopLoadingSpinner();
      }
    };
    loadRequests();
  }, [dispatch]);

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
          {(!myRequests || myRequests.length === 0) ? (
            <div className='ion-text-center ion-padding ion-margin-top'>
              <IonText>
                <p>No requests found.</p>
              </IonText>
            </div>
          ) : (
            <IonList lines='inset' inset={true}>
              {myRequests.map((req) => (
                <TenantRequest key={req.id} request={req} />
              ))}
            </IonList>
          )}
        </IonContent>
      </IonPage>
    </>
  );
};

export default OwnerRequests;