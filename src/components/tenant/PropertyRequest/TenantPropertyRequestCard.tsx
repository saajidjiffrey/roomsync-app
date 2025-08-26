import { IonAvatar, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonNote, IonText } from '@ionic/react';
import React from 'react';
import './TenantPropertyRequestCard.css';

const TenantPropertyRequestCard: React.FC = () => {

  return (
    <IonItemSliding>
      <IonItem button={true} detail={true} href='/tenant/property-details' routerDirection='forward'>
        <IonAvatar aria-hidden="true" slot="start" className='property-avatar ion-align-self-start avatar-square'>
          <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </IonAvatar>
        <IonLabel className='ion-align-self-start'>
          <strong>Property Name</strong>
          <IonNote color="medium" className="ion-text-wrap">
            123, King's street, Kandy
          </IonNote>
          <br />
          <IonText color="primary" className='ion-text-wrap'>
            <p>
              02 remaining spaces available
            </p>
          </IonText>
        </IonLabel>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption color="danger">Delete</IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default TenantPropertyRequestCard;