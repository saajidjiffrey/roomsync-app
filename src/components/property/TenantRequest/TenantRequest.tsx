import { IonAvatar, IonButton, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonNote } from '@ionic/react';
import React from 'react';
import './TenantRequest.css';
import { checkmark, close } from 'ionicons/icons';

const TenantRequest: React.FC = () => {

  return (
    <IonItemSliding>
      <IonItemOptions side="start">
        <IonItemOption color="success">Archive</IonItemOption>
      </IonItemOptions>
      <IonItem>
        <IonAvatar aria-hidden="true" slot="start" className='user-avatar ion-align-self-start'>
          <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </IonAvatar>
        <IonLabel className='ion-align-self-start'>
          <strong>Tenant Name</strong>
          <IonNote color="medium" className="ion-text-wrap">
            Wants to be a tenant of the property <span>Property Name ABC</span>
          </IonNote>
        </IonLabel>
        <div className='button-container ion-margin-top'>
          <IonButton shape="round" color='danger' size='small'>
            <IonIcon slot="icon-only" icon={close}></IonIcon>
          </IonButton>
          <IonButton shape="round" color='success' size='small'>
            <IonIcon slot="icon-only" icon={checkmark}></IonIcon>
          </IonButton>
        </div>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption>Favorite</IonItemOption>
        <IonItemOption color="danger">Delete</IonItemOption>
      </IonItemOptions>
      </IonItemSliding>
  );
};

export default TenantRequest;