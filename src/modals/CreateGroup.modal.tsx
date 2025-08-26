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
  IonImg,
  IonIcon,
  IonList,
  IonListHeader,
  IonLabel,
  IonTextarea,
} from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';

const CreateGroup = ({ dismiss }: { dismiss: (data?: string | null | undefined | number, role?: string) => void }) => {
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
          <IonTitle>Create Group</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => dismiss(inputRef.current?.value, 'confirm')} strong={true}>
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ position: 'relative' }}>
          <IonImg
            src={'https://placehold.co/400'}
            alt="Property Image"
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <IonButton
            fill="solid"
            size="small"
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              '--background': '#3880ff',
              '--color': 'white',
              '--border-radius': '50%',
              width: '40px',
              height: '40px'
            }}
          >
            <IonIcon icon={cameraOutline} />
          </IonButton>
        </div>
        
        <IonList mode='ios' lines='inset' className='input-wrapper ion-padding-vertical'>
          <IonListHeader className='ion-margin-bottom'>
            <IonLabel>Group Details</IonLabel>
          </IonListHeader>
          
          <IonItem>
            <IonInput 
              labelPlacement="stacked" 
              mode='md' 
              type='text' 
              label="Group Name" 
              placeholder="Enter Group name"
            />
          </IonItem>
          
          <IonItem>
            <IonTextarea 
              label="Description" 
              labelPlacement="stacked" 
              rows={5}
              placeholder="Enter group description"
            />
          </IonItem>
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default CreateGroup;