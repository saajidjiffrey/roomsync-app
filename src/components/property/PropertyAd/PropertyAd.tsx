import { IonAvatar, IonChip, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonNote } from '@ionic/react';
import React from 'react';
import './PropertyAd.css';
import { PropertyAd as PropertyAdType } from '../../../types/propertyAd';

type Props = {
  ad: PropertyAdType;
};

const PropertyAd: React.FC<Props> = ({ ad }) => {
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
          <strong>{ad.property?.name ?? `Property #${ad.property_id}`}</strong>
          {ad.property?.address && (
            <IonNote color="medium" className="ion-text-wrap">
              {ad.property.address}
            </IonNote>
          )}
          <br />
          <IonChip color={ad.is_active ? 'secondary' : 'medium'}>
            Looking for {ad.number_of_spaces_looking_for} tenant(s)
          </IonChip>
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