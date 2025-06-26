import { IonAvatar, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonNote, IonText } from '@ionic/react';
import React from 'react';

const PropertyCard: React.FC = () => {

  return (
    <IonItemSliding>
      <IonItemOptions side="start">
        <IonItemOption color="success">Archive</IonItemOption>
      </IonItemOptions>
      <IonItem button={true} detail={true}>
        <IonAvatar aria-hidden="true" slot="start" className='ion-align-self-start'>
          <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </IonAvatar>
        <IonLabel className='ion-align-self-start'>
          <strong>Rick Astley</strong>
          <IonText>Never Gonna Give You Up</IonText>
          <br />
          <IonNote color="medium" className="ion-text-wrap">
            Never gonna give you up Never gonna let you down Never gonna run...
          </IonNote>
        </IonLabel>
        <div className="metadata-end-wrapper ion-align-self-start" slot="end">
          <IonNote color="medium">06:11</IonNote>
        </div>
      </IonItem>
       <IonItemOptions side="end">
          <IonItemOption>Favorite</IonItemOption>
          <IonItemOption color="danger">Delete</IonItemOption>
        </IonItemOptions>
      </IonItemSliding>
  );
};

export default PropertyCard;