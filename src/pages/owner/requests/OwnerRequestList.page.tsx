import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonLabel
} from '@ionic/react';
import { TenantRequest } from '../../../components/property/TenantRequest';
import PageHeader from '../../../components/common/PageHeader';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOwnerReceivedJoinRequests, selectOwnerActiveJoinRequests, selectOwnerHistoryJoinRequests } from '../../../store/slices/propertyJoinRequestSlice';
import { showLoadingSpinner, stopLoadingSpinner } from '../../../utils/spinnerUtils';

const OwnerRequests: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeRequests = useAppSelector(selectOwnerActiveJoinRequests);
  const historyRequests = useAppSelector(selectOwnerHistoryJoinRequests);
  const [selectedSegment, setSelectedSegment] = useState<'active' | 'history'>('active');


  const handleRefresh = async (event: CustomEvent) => {
    try {
      await dispatch(fetchOwnerReceivedJoinRequests());
    } finally {
      event.detail.complete();
    }
  };

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
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Requests</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonSegment className='ion-padding-start ion-padding-end' mode='md' value={selectedSegment}>
            <IonSegmentButton value="active" contentId="active" onClick={() => setSelectedSegment('active')}>
              <IonLabel>Active</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="history" contentId="history" onClick={() => setSelectedSegment('history')}>
              <IonLabel>History</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          
          <IonSegmentView>
            <IonSegmentContent id="active">
              <IonList lines='inset' inset={true}>
                {(!activeRequests || activeRequests.length === 0) ? (
                  <div className='ion-text-center ion-padding ion-margin-top'>
                    <IonText>
                      <p>No pending requests found.</p>
                    </IonText>
                  </div>
                ) : (
                  activeRequests.map((req) => (
                    <TenantRequest key={req.id} request={req} showActions={true} />
                  ))
                )}
              </IonList>
            </IonSegmentContent>
            
            <IonSegmentContent id="history">
              <IonList lines='inset' inset={true}>
                {(!historyRequests || historyRequests.length === 0) ? (
                  <div className='ion-text-center ion-padding ion-margin-top'>
                    <IonText>
                      <p>No request history found.</p>
                    </IonText>
                  </div>
                ) : (
                  historyRequests.map((req) => (
                    <TenantRequest key={req.id} request={req} showActions={false} />
                  ))
                )}
              </IonList>
            </IonSegmentContent>
          </IonSegmentView>
        </IonContent>
    </IonPage>
  );
};

export default OwnerRequests;