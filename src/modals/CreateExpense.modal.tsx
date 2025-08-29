import React, { useRef } from 'react';
import {
  IonButtons,
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
  IonInput,
  IonList,
  IonListHeader,
  IonLabel,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonImg,
  IonRow,
  IonCol,
} from '@ionic/react';
import RoommateCard from '../components/roommate/RoommateCard';
import { addOutline, trashOutline } from 'ionicons/icons';

const CreateExpenseModal = ({ dismiss }: { dismiss: (data?: string | null | undefined | number, role?: string) => void }) => {
  const inputRef = useRef<HTMLIonInputElement>(null);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => dismiss(null, 'cancel')}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Create Expense</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => dismiss(inputRef.current?.value, 'confirm')} strong={true}>
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList mode='ios' lines='inset' inset className='input-wrapper'>
          <IonListHeader>
            <IonLabel className='ion-no-margin'>Expense Details</IonLabel>
          </IonListHeader>
          
          <IonItem>
            <IonSelect label="Select Category" interface="action-sheet" labelPlacement="floating" placeholder="Select Category">
              <IonSelectOption value="1">Category 1</IonSelectOption>
              <IonSelectOption value="2">Category 2</IonSelectOption>
              <IonSelectOption value="3">Category 3</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput 
              labelPlacement="stacked" 
              mode='md' 
              type='text' 
              label="Expense Title" 
              placeholder="Enter Expense Title"
            />
          </IonItem>

          <IonItem>
            <IonTextarea 
              labelPlacement="stacked" 
              mode='md' 
              rows={5}
              label="Description" 
              placeholder="Enter Expense Description"
            />
          </IonItem>
          
          <IonItem>
            <IonInput 
              labelPlacement="stacked" 
              mode='md' 
              type='number' 
              label="Receipt Amount" 
              placeholder="Enter Receipt Amount"
            />
          </IonItem>
        </IonList>

        <IonList mode='ios' lines='inset' inset className='input-wrapper'>
          <IonListHeader>
            <IonLabel className='ion-no-margin'>Select Roommates</IonLabel>
            <IonButton 
              fill="clear" 
              size="small" 
            >
              Select All
            </IonButton>
          </IonListHeader>
          <RoommateCard showCheckbox={true} />
          <RoommateCard showCheckbox={true} />
          <RoommateCard showCheckbox={true} />
        </IonList>

        <div className='ion-padding-horizontal'>
          <IonListHeader>
            <IonLabel className='ion-no-margin'>Receipts (Optional)</IonLabel>
            <IonButton 
              fill="clear" 
              size='small'
            >
              <IonIcon icon={addOutline} />
              Add Receipt
            </IonButton>
          </IonListHeader>
        </div>
        <IonRow className='ion-padding'>
          <IonCol size="4" className='ion-text-center'>
            <IonImg className="receipt-image" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            <IonButton fill="clear" size='small'>
              <IonIcon icon={trashOutline} />
              Delete
            </IonButton>
          </IonCol>
          <IonCol size="4" className='ion-text-center'>
            <IonImg className="receipt-image" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            <IonButton fill="clear" size='small'>
              <IonIcon icon={trashOutline} />
              Delete
            </IonButton>
          </IonCol>
          <IonCol size="4" className='ion-text-center'>
            <IonImg className="receipt-image" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            <IonButton fill="clear" size='small'>
              <IonIcon icon={trashOutline} />
              Delete
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default CreateExpenseModal;