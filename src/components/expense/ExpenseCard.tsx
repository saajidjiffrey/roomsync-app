import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import React from 'react';
import './ExpenseCard.css';
import { airplane } from 'ionicons/icons';

const ExpenseCard: React.FC = () => {

  return (
      <IonItem button={false} detail={false} className='ion-align-items-start'>
        <div className='icon-wrapper rounded-2 d-flex align-items-center justify-content-center me-3 mt-3'>
          <IonIcon aria-hidden="true" icon={airplane} slot="start"></IonIcon>
        </div>
        <IonLabel>
          <h1 className='ion-text-wrap'>Lunch groceries for the week</h1>
          <p>Roommate #1</p>
          <div className='d-flex justify-content-between align-items-center'>
            <span className='text-danger'>LKR 1000</span>
            <IonButton className='ion-align-self-end' fill="solid" color="primary">Pay</IonButton>
          </div>
        </IonLabel>
      </IonItem>
  );
};

export default ExpenseCard;