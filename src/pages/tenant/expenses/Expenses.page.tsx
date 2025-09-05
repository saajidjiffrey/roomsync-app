import React, { useEffect } from 'react';
import { 
  IonPage, 
  IonContent,
  IonLabel,
  IonListHeader,
  IonList,
  IonItemGroup,
  IonSegmentButton,
  IonSegment,
  IonSegmentContent,
  IonSegmentView,
  IonFab,
  IonFabButton,
  IonIcon,
  useIonModal,
  IonButton,
  IonText,
  IonItem,
  IonAvatar,
  IonChip,
  IonSkeletonText
} from '@ionic/react';
import { add } from 'ionicons/icons';
import CreateExpenseModal from '../../../modals/CreateExpense.modal';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { useAuth } from '../../../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  fetchToPaySplits, 
  fetchToReceiveSplits, 
  fetchSplitHistory, 
  fetchSplitSummary,
  selectToPaySplits,
  selectToReceiveSplits,
  selectHistorySplits,
  selectSplitSummary,
  selectSplitIsLoading
} from '../../../store/slices/splitSlice';
import { updateSplitStatus } from '../../../store/slices/splitSlice';

const Expenses: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [present, dismiss] = useIonModal(CreateExpenseModal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  });
  
  const propertyId = user?.tenant_profile?.property_id;
  const groupId = user?.tenant_profile?.group_id;
  
  // Split data
  const toPaySplits = useAppSelector(selectToPaySplits);
  const toReceiveSplits = useAppSelector(selectToReceiveSplits);
  const historySplits = useAppSelector(selectHistorySplits);
  const splitSummary = useAppSelector(selectSplitSummary);
  const isLoading = useAppSelector(selectSplitIsLoading);

  // Helpers
  const formatAmount = (value: unknown) => {
    const num = parseFloat(String(value ?? '0'));
    return num.toFixed(2);
  };

  const tenantId = user?.tenant_profile?.id;

  const handlePay = async (splitId: number) => {
    await dispatch(updateSplitStatus({ splitId, status: 'pending' }));
    dispatch(fetchToPaySplits());
    dispatch(fetchSplitSummary());
  };

  const handleConfirm = async (splitId: number) => {
    await dispatch(updateSplitStatus({ splitId, status: 'paid' }));
    dispatch(fetchToReceiveSplits());
    dispatch(fetchSplitSummary());
  };

  // Fetch split data when component mounts and user has a group
  useEffect(() => {
    if (groupId) {
      console.log('Fetching split data for groupId:', groupId);
      console.log('User data:', user);
      dispatch(fetchToPaySplits());
      dispatch(fetchToReceiveSplits());
      dispatch(fetchSplitHistory());
      dispatch(fetchSplitSummary());
    }
  }, [dispatch, groupId, user]);

  // If no property, show join property message
  if (!propertyId) {
    return (
      <IonPage>
        <PageHeader title="Expenses" />
        <IonContent className="ion-padding">
          <div className="ion-text-center ion-margin-top">
            <IonText>
              <h2>Please join a property</h2>
              <p>You need to join a property to access expense features.</p>
            </IonText>
            <IonButton 
              expand="block" 
              onClick={() => history.push('/tenant/find-property')}
              className="ion-margin-top"
            >
              Find Property
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // If no group, show join group message
  if (!groupId) {
    return (
      <IonPage>
        <PageHeader title="Expenses" />
        <IonContent className="ion-padding">
          <div className="ion-text-center ion-margin-top">
            <IonText>
              <h2>Please join a group</h2>
              <p>You need to join a group to access expense features.</p>
            </IonText>
            <IonButton 
              expand="block" 
              onClick={() => history.push('/tenant/select-group')}
              className="ion-margin-top"
            >
              Select Group
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  function openModal() {
    present({
      onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
        if (event.detail.role === 'confirm') {
          console.log(`Hello, ${event.detail.data}!`);
        }
      },
    });
  }

  // If both property and group exist, show normal expenses content
  return (
    <IonPage>
      <PageHeader title="Expenses" />
      <IonContent fullscreen>
        {/* Split Summary Cards */}
        <div className="p-3">
          <div className="row g-2">
            <div className="col-6">
              <div className="card p-3 bg-success text-white">
                <IonLabel className="d-block mb-2">To be received</IonLabel>
                {isLoading ? (
                  <IonSkeletonText animated style={{ width: '60%', height: '1.5rem' }} />
                ) : (
                  <h2 className="mb-0">LKR {formatAmount(splitSummary?.toReceive?.total)}</h2>
                )}
                <small>{splitSummary?.toReceive?.count || 0} pending</small>
              </div>
            </div>
            <div className="col-6">
              <div className="card p-3 bg-warning text-dark">
                <IonLabel className="d-block mb-2">To be paid</IonLabel>
                {isLoading ? (
                  <IonSkeletonText animated style={{ width: '60%', height: '1.5rem' }} />
                ) : (
                  <h2 className="mb-0">LKR {formatAmount(splitSummary?.toPay?.total)}</h2>
                )}
                <small>{splitSummary?.toPay?.count || 0} pending</small>
              </div>
            </div>
          </div>
        </div>

        <IonSegment className='ion-padding-start ion-padding-end' mode='md' value="to_pay">
          <IonSegmentButton value="to_pay" contentId="to_pay">
            <IonLabel>To Pay</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="to_receive" contentId="to_receive">
            <IonLabel>To Receive</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="history" contentId="history">
            <IonLabel>History</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonSegmentView>
          <IonSegmentContent id="to_pay">
            <IonList lines='full' inset>
              <IonListHeader className='ion-margin-bottom'>
                <IonLabel className='ion-no-margin'>To Pay</IonLabel>
              </IonListHeader>
              <IonItemGroup>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <IonItem key={index}>
                      <IonSkeletonText animated style={{ width: '100%', height: '4rem' }} />
                    </IonItem>
                  ))
                ) : toPaySplits.length === 0 ? (
                  <IonItem>
                    <IonLabel className="ion-text-center">
                      <h3>No pending payments</h3>
                      <p>You're all caught up!</p>
                    </IonLabel>
                  </IonItem>
                ) : (
                  toPaySplits.map((split) => (
                    <IonItem key={split.id} button>
                      <IonAvatar slot="start">
                        <img src="/images/user_placeholder.jpg" alt="" />
                      </IonAvatar>
                      <IonLabel>
                        <h2>{split.expense?.title}</h2>
                        <p>To: {split.assignedByTenant?.tenantUser?.full_name}</p>
                        <p>Category: {split.expense?.category}</p>
                      </IonLabel>
                      <IonChip color="warning" slot="end">
                        LKR {formatAmount(split.split_amount)}
                      </IonChip>
                      {split.status === 'unpaid' ? (
                        <IonButton slot="end" color="primary" onClick={() => handlePay(split.id)}>Pay</IonButton>
                      ) : split.status === 'pending' ? (
                        <IonChip slot="end" color="medium">Pending</IonChip>
                      ) : null}
                    </IonItem>
                  ))
                )}
              </IonItemGroup>
            </IonList>
          </IonSegmentContent>
          <IonSegmentContent id="to_receive">
            <IonList lines='full' inset>
              <IonListHeader className='ion-margin-bottom'>
                <IonLabel className='ion-no-margin'>To Receive</IonLabel>
              </IonListHeader>
              <IonItemGroup>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <IonItem key={index}>
                      <IonSkeletonText animated style={{ width: '100%', height: '4rem' }} />
                    </IonItem>
                  ))
                ) : toReceiveSplits.length === 0 ? (
                  <IonItem>
                    <IonLabel className="ion-text-center">
                      <h3>No pending receipts</h3>
                      <p>No one owes you money right now</p>
                    </IonLabel>
                  </IonItem>
                ) : (
                  toReceiveSplits.map((split) => (
                    <IonItem key={split.id} button>
                      <IonAvatar slot="start">
                        <img src="/images/user_placeholder.jpg" alt="" />
                      </IonAvatar>
                      <IonLabel>
                        <h2>{split.expense?.title}</h2>
                        <p>From: {split.assignedTenant?.tenantUser?.full_name}</p>
                        <p>Category: {split.expense?.category}</p>
                      </IonLabel>
                      <IonChip color="success" slot="end">
                        LKR {formatAmount(split.split_amount)}
                      </IonChip>
                      {split.status === 'pending' ? (
                        <IonButton slot="end" color="success" onClick={() => handleConfirm(split.id)}>Confirm</IonButton>
                      ) : split.status === 'unpaid' ? (
                        <IonChip slot="end" color="medium">Pending</IonChip>
                      ) : null}
                    </IonItem>
                  ))
                )}
              </IonItemGroup>
            </IonList>
          </IonSegmentContent>
          <IonSegmentContent id="history">
            <IonList lines='full' inset>
              <IonListHeader className='ion-margin-bottom'>
                <IonLabel className='ion-no-margin'>History</IonLabel>
              </IonListHeader>
              <IonItemGroup>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <IonItem key={index}>
                      <IonSkeletonText animated style={{ width: '100%', height: '4rem' }} />
                    </IonItem>
                  ))
                ) : historySplits.length === 0 ? (
                  <IonItem>
                    <IonLabel className="ion-text-center">
                      <h3>No payment history</h3>
                      <p>Your payment history will appear here</p>
                    </IonLabel>
                  </IonItem>
                ) : (
                  historySplits.map((split) => (
                    <IonItem key={split.id} button>
                      <IonAvatar slot="start">
                        <img src="/images/user_placeholder.jpg" alt="" />
                      </IonAvatar>
                      <IonLabel>
                        <h2>{split.expense?.title}</h2>
                        <p>
                          {split.assigned_to === split.assigned_by ? 
                            'Self payment' : 
                            split.assigned_by ? 
                              `Paid to: ${split.assignedByTenant?.tenantUser?.full_name}` :
                              `Received from: ${split.assignedTenant?.tenantUser?.full_name}`
                          }
                        </p>
                        <p>Category: {split.expense?.category}</p>
                        <p>Paid: {split.paid_date ? new Date(split.paid_date).toLocaleDateString() : 'N/A'}</p>
                      </IonLabel>
                      {tenantId && split.assigned_to === tenantId ? (
                        <IonChip color="danger" slot="end">LKR {formatAmount(split.split_amount)}</IonChip>
                      ) : (
                        <IonChip color="success" slot="end">LKR {formatAmount(split.split_amount)}</IonChip>
                      )}
                    </IonItem>
                  ))
                )}
              </IonItemGroup>
            </IonList>
          </IonSegmentContent>
        </IonSegmentView>
        <IonFab vertical="bottom" horizontal="end" slot="fixed" >
          <IonFabButton onClick={() => openModal()}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>

    </IonPage>
  );
};

export default Expenses;