import { IonAvatar, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonNote, IonText } from '@ionic/react';
import React from 'react';
import './TenantPropertyRequestCard.css';
import { PropertyJoinRequest } from '../../../types/propertyJoinRequest';

type Props = { request: PropertyJoinRequest };

const TenantPropertyRequestCard: React.FC<Props> = ({ request }) => {
  const property = request.propertyAd?.property;

  return (
    <IonItemSliding>
      <IonItem button={true} detail={true} routerLink={`/tenant/property-details/${request.property_ad_id}`} routerDirection='forward'>
        <IonAvatar aria-hidden="true" slot="start" className='property-avatar ion-align-self-start avatar-square'>
          <img alt="" src={property?.property_image || "/images/property_placeholder.jpg"} />
        </IonAvatar>
        <IonLabel className='ion-align-self-start'>
          <strong>{property?.name ?? `Ad #${request.property_ad_id}`}</strong>
          {property?.address && (
            <IonNote color="medium" className="ion-text-wrap">
              {property.address}
            </IonNote>
          )}
          <br />
          <IonText color="primary" className='ion-text-wrap'>
            <p>
              {property?.space_available} remaining spaces available
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