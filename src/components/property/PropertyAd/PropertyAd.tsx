import { IonAvatar, IonChip, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonNote } from '@ionic/react';
import React from 'react';
import './PropertyAd.css';

const PropertyAd: React.FC = () => {

  return (
    <IonItemSliding>
      <IonItemOptions side="start">
        <IonItemOption color="success">Archive</IonItemOption>
      </IonItemOptions>
      <IonItem button={true} detail={true}>
        <IonAvatar aria-hidden="true" slot="start" className='property-avatar ion-align-self-start avatar-square'>
          <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </IonAvatar>
        <IonLabel className='ion-align-self-start'>
          <strong>Property Name</strong>
          <IonNote color="medium" className="ion-text-wrap">
            123, King's street, Kandy
          </IonNote>
          <br />
          
          <IonChip color="secondary">Looking for 1 tenant(s)</IonChip>
        </IonLabel>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption>Favorite</IonItemOption>
        <IonItemOption color="danger">Delete</IonItemOption>
      </IonItemOptions>
      </IonItemSliding>
  );
};

export default PropertyAd;