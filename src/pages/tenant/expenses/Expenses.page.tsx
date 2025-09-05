import React from 'react';
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
  IonText
} from '@ionic/react';
import ExpenseCard from '../../../components/expense/ExpenseCard';
import { add } from 'ionicons/icons';
import CreateExpenseModal from '../../../modals/CreateExpense.modal';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { useAuth } from '../../../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';

const Expenses: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [present, dismiss] = useIonModal(CreateExpenseModal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  });
  
  const propertyId = user?.tenant_profile?.property_id;
  const groupId = user?.tenant_profile?.group_id;

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
        {/* Group Information */}
        <div className="p-3">
          <div className="row g-2">
            <div className="col-6">
              <div className="card p-3 bg-success text-white">
                <IonLabel className="d-block mb-2">To be received</IonLabel>
                <h2 className="mb-0">LKR 2000</h2>
              </div>
            </div>
            <div className="col-6">
              <div className="card p-3 bg-warning text-dark">
                <IonLabel className="d-block mb-2">To be paid</IonLabel>
                <h2 className="mb-0">LKR 400</h2>
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
                {/* <IonItemDivider>
                  <IonLabel>May 26, 2025</IonLabel>
                </IonItemDivider> */}
                
                <ExpenseCard />
                <ExpenseCard />
                <ExpenseCard />
              </IonItemGroup>
            </IonList>
          </IonSegmentContent>
          <IonSegmentContent id="to_receive">
            <IonList lines='full' inset>
              <IonListHeader className='ion-margin-bottom'>
                <IonLabel className='ion-no-margin'>To Receive</IonLabel>
              </IonListHeader>
              <IonItemGroup>
                {/* <IonItemDivider>
                  <IonLabel>May 26, 2025</IonLabel>
                </IonItemDivider> */}
                
                <ExpenseCard />
                <ExpenseCard />
                <ExpenseCard />
              </IonItemGroup>
            </IonList>
          </IonSegmentContent>
          <IonSegmentContent id="history">
            <IonList lines='full' inset>
              <IonListHeader className='ion-margin-bottom'>
                <IonLabel className='ion-no-margin'>History</IonLabel>
              </IonListHeader>
              <IonItemGroup>
                {/* <IonItemDivider>
                  <IonLabel>May 26, 2025</IonLabel>
                </IonItemDivider> */}
                
                <ExpenseCard />
                <ExpenseCard />
                <ExpenseCard />
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