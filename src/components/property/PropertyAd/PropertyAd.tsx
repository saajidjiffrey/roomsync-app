import { IonAvatar, IonChip, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonNote } from '@ionic/react';
import React from 'react';
import './PropertyAd.css';
import { PropertyAd as PropertyAdType } from '../../../types/propertyAd';
import { useAppSelector } from '../../../store/hooks';

type Props = {
  ad: PropertyAdType;
};

const PropertyAd: React.FC<Props> = ({ ad }) => {
  const role = useAppSelector((state) => state.auth.user?.role);
  const detailsPath = role === 'owner' ? `/owner/property-details/${ad.property_id}` : `/tenant/property-details/${ad.id}`;
  return (
    <IonItemSliding>
      <IonItemOptions side="start">
        <IonItemOption color="success">Archive</IonItemOption>
      </IonItemOptions>
      <IonItem button={true} detail={true} routerLink={detailsPath} routerDirection='forward'>
        <IonAvatar aria-hidden="true" slot="start" className='property-avatar ion-align-self-start avatar-square'>
          <img alt="" src={ad.Property?.property_image ||"/images/ad_placeholder.jpg"} />
        </IonAvatar>
        <IonLabel className='ion-align-self-start'>
          <strong>{ad.Property?.name ?? `Property #${ad.property_id}`}</strong>
          {ad.Property?.address && (
            <IonNote color="medium" className="ion-text-wrap">
              {ad.Property.address}
            </IonNote>
          )}
          <br />
          <IonChip color={'primary'}>
            {ad.number_of_spaces_looking_for} tenant(s)
          </IonChip>
          <IonChip color={ad.is_active ? 'success' : 'warning'}>
          {ad.is_active ? 'Active' : 'Inactive'}
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