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
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOwnerReceivedJoinRequests, selectOwnerActiveJoinRequests } from '../../../store/slices/propertyJoinRequestSlice';
import { showLoadingSpinner, stopLoadingSpinner } from '../../../utils/spinnerUtils';

const OwnerRequests: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeRequests = useAppSelector(selectOwnerActiveJoinRequests);

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
    <IonPage>
        <PageHeader title="Requests" />
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Requests</IonTitle>
            </IonToolbar>
          </IonHeader>
          {(!activeRequests || activeRequests.length === 0) ? (
            <div className='ion-text-center ion-padding ion-margin-top'>
              <IonText>
                <p>No requests found.</p>
              </IonText>
            </div>
          ) : (
            <IonList lines='inset' inset={true}>
              {activeRequests.map((req) => (
                <TenantRequest key={req.id} request={req} />
              ))}
            </IonList>
          )}
        </IonContent>
    </IonPage>
  );
};

export default OwnerRequests;