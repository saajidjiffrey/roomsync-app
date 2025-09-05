import React from 'react';
import { 
  IonPage, 
  IonContent,
  IonLabel,
  IonListHeader,
  IonList,
  IonItemGroup,
  IonButton,
  IonText
} from '@ionic/react';
import './TenantHome.css';
import ExpenseCard from '../../components/expense/ExpenseCard';
import { useAuth } from '../../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';

const TenantHome: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  
  const propertyId = user?.tenant_profile?.property_id;
  const groupId = user?.tenant_profile?.group_id;

  // If no property, show join property message
  if (!propertyId) {
    return (
      <IonPage>
        <PageHeader title="Home" />
        <IonContent className="ion-padding">
          <div className="ion-text-center ion-margin-top">
            <IonText>
              <h2>Please join a property</h2>
              <p>You need to join a property to access group features.</p>
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
        <PageHeader title="Home" />
        <IonContent className="ion-padding">
          <div className="ion-text-center ion-margin-top">
            <IonText>
              <h2>Please join a group</h2>
              <p>You need to join a group to access expense and task features.</p>
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

  // If both property and group exist, show normal home content
  return (
    <IonPage>
      <PageHeader title="Home" />

      <IonContent fullscreen>
        {/* Group Information */}
        <div className="p-3">
          <div className="row g-2">
            <div className="col-12">
              <div className="card p-3 bg-primary text-white">
                <IonLabel className="d-block mb-2">Monthly Total Group Expenses</IonLabel>
                <h2 className="mb-0">LKR 6500</h2>
              </div>
            </div>
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

        <IonList lines='full' inset>
          <IonListHeader className='ion-margin-bottom'>
            <IonLabel className='ion-no-margin'>Recent Expenses</IonLabel>
          </IonListHeader>
          <IonItemGroup>
            <ExpenseCard />
            <ExpenseCard />
            <ExpenseCard />
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TenantHome;