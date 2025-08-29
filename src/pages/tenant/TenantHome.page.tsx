import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonLabel,
  IonListHeader,
  IonList,
  IonItemGroup
} from '@ionic/react';
import './TenantHome.css';
import ExpenseCard from '../../components/expense/ExpenseCard';

const TenantHome: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle >Home</IonTitle>
        </IonToolbar>
      </IonHeader>

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
            {/* <IonItemDivider>
              <IonLabel>May 26, 2025</IonLabel>
            </IonItemDivider> */}
            
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