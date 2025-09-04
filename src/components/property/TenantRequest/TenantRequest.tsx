import { IonAvatar, IonButton, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonNote } from '@ionic/react';
import React from 'react';
import './TenantRequest.css';
import { checkmark, close } from 'ionicons/icons';
import { PropertyJoinRequest } from '../../../types/propertyJoinRequest';
import { useAppDispatch } from '../../../store/hooks';
import { respondToJoinRequest } from '../../../store/slices/propertyJoinRequestSlice';

type Props = { request: PropertyJoinRequest };

const TenantRequest: React.FC<Props> = ({ request }) => {
  const dispatch = useAppDispatch();

  return (
    <IonItemSliding>
      <IonItem>
        <IonAvatar aria-hidden="true" slot="start" className='user-avatar ion-align-self-start'>
          <img alt="" src={"/images/user_placeholder.jpg"} />
        </IonAvatar>
        <IonLabel className='ion-align-self-start'>
          <strong>{request.tenant?.tenantUser?.full_name ?? `${request.tenant?.tenantUser?.full_name} #${request.tenant_id}`}</strong>
          <IonNote color="medium" className="ion-text-wrap">
            Wants to be a tenant of the property <span>{request.propertyAd?.property?.name ?? `Ad #${request.property_ad_id}`}</span>
          </IonNote>
        </IonLabel>
        <div className='button-container ion-margin-top'>
          <IonButton shape="round" color='danger' size='small' onClick={() => dispatch(respondToJoinRequest({ requestId: request.id, status: 'rejected' }))}>
            <IonIcon slot="icon-only" icon={close}></IonIcon>
          </IonButton>
          <IonButton shape="round" color='success' size='small' onClick={() => dispatch(respondToJoinRequest({ requestId: request.id, status: 'approved' }))}>
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