import { IonAvatar, IonButton, IonIcon, IonItem, IonItemSliding, IonLabel, IonNote, IonChip } from '@ionic/react';
import React from 'react';
import './TenantRequest.css';
import { checkmark, close } from 'ionicons/icons';
import { PropertyJoinRequest } from '../../../types/propertyJoinRequest';
import { useAppDispatch } from '../../../store/hooks';
import { respondToJoinRequest } from '../../../store/slices/propertyJoinRequestSlice';

type Props = { 
  request: PropertyJoinRequest;
  showActions?: boolean;
};

const TenantRequest: React.FC<Props> = ({ request, showActions = true }) => {
  const dispatch = useAppDispatch();

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      default: return 'medium';
    }
  };

  return (
    <IonItemSliding>
      <IonItem>
        <IonAvatar aria-hidden="true" slot="start" className='user-avatar ion-align-self-start'>
          <img alt="" src={request.tenant?.tenantUser?.profile_url ?? "/images/user_placeholder.jpg"} />
        </IonAvatar>
        <IonLabel className='ion-align-self-start'>
          <strong>{request.tenant?.tenantUser?.full_name ?? `${request.tenant?.tenantUser?.full_name} #${request.tenant_id}`}</strong>
          <IonNote color="medium" className="ion-text-wrap">
            Wants to be a tenant of the property <span>{request.propertyAd?.property?.name ?? `Ad #${request.property_ad_id}`}</span>
          </IonNote>
        </IonLabel>
        {showActions ? (
          <div className='button-container ion-margin-top'>
            <IonButton shape="round" color='danger' size='small' onClick={() => dispatch(respondToJoinRequest({ requestId: request.id, status: 'rejected' }))}>
              <IonIcon slot="icon-only" icon={close}></IonIcon>
            </IonButton>
            <IonButton shape="round" color='success' size='small' onClick={() => dispatch(respondToJoinRequest({ requestId: request.id, status: 'approved' }))}>
              <IonIcon slot="icon-only" icon={checkmark}></IonIcon>
            </IonButton>
          </div>
        ) : (
          <div className='ion-margin-top'>
            <IonChip color={getStatusChipColor(request.status)}>
              <IonLabel>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</IonLabel>
            </IonChip>
          </div>
        )}
      </IonItem>
      </IonItemSliding>
  );
};

export default TenantRequest;