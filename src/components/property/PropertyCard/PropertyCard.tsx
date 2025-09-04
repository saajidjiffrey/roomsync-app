import { IonAvatar, IonChip, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonNote, IonText } from '@ionic/react';
import React from 'react';
import { Property } from '../../../types/property';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {

  return (
    <IonItemSliding>
      <IonItemOptions side="start">
        <IonItemOption color="success">Archive</IonItemOption>
      </IonItemOptions>
      <IonItem button={true} detail={true} routerLink={`/owner/property-details/${property.id}`} routerDirection='forward'>
        <IonAvatar aria-hidden="true" slot="start" className='property-avatar ion-align-self-start avatar-square'>
          <img alt="" src={property.property_image || "/images/property_placeholder.jpg"} />
        </IonAvatar>
        <IonLabel className='ion-align-self-start'>
          <strong>{property.name}</strong>
          <IonNote color="medium" className="ion-text-wrap">
            {property.address}
          </IonNote>
          <br />
          <IonText color="primary" className='ion-text-wrap'>
            <p>
              {property.space_available} remaining spaces available
            </p>
          </IonText>
          <div>
            {Array.isArray(property.tags) && property.tags.length > 0 && (
              <>
                {property.tags.slice(0, 2).map((tag, index) => (
                  <IonChip key={index} color="dark">{tag}</IonChip>
                ))}
                {property.tags.length > 2 && (
                  <IonChip color="dark">{property.tags.length - 2} more..</IonChip>
                )}
              </>
            )}
          </div>
        </IonLabel>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption>Favorite</IonItemOption>
        <IonItemOption color="danger">Delete</IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default PropertyCard;