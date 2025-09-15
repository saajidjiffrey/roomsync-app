import { IonAvatar, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonText, IonChip } from '@ionic/react';
import React from 'react';
import './TenantPropertyRequestCard.css';
import { PropertyJoinRequest } from '../../../types/propertyJoinRequest';

type Props = { 
  request: PropertyJoinRequest;
  onDelete?: (request: PropertyJoinRequest) => void;
};

const TenantPropertyRequestCard: React.FC<Props> = ({ request, onDelete }) => {
  const property = request.PropertyAd?.Property;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      default: return 'medium';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <IonItemSliding>
      <IonItem button={true} detail={true} routerLink={`/tenant/property-details/${request.PropertyAd?.property_id}`} routerDirection='forward'>
        <IonAvatar aria-hidden="true" slot="start" className='property-avatar ion-align-self-start avatar-square'>
          <img alt="" src={property?.property_image || "/images/property_placeholder.jpg"} />
        </IonAvatar>
        <IonLabel className='ion-align-self-start'>
          <strong>{property?.name ?? `Property #${request.PropertyAd?.property_id}`}</strong>
          <IonText color="medium" className='ion-text-wrap'>
            <p>Requested: {formatDate(request.createdAt)}</p>
          </IonText>
          <IonChip color={getStatusColor(request.status)}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </IonChip>
          {request.move_in_date && (
            <IonText color="medium" className='ion-text-wrap'>
              <p>Move-in: {formatDate(request.move_in_date)}</p>
            </IonText>
          )}
          
        </IonLabel>
      </IonItem>
      {onDelete && (
        <IonItemOptions side="end">
          <IonItemOption 
            color="danger" 
            onClick={() => onDelete(request)}
          >
            Delete
          </IonItemOption>
        </IonItemOptions>
      )}
    </IonItemSliding>
  );
};

export default TenantPropertyRequestCard;