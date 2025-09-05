import { IonAvatar, IonChip, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonText } from '@ionic/react';
import React from 'react';
import './GroupCard.css';

type GroupCardProps = {
  name?: string;
  description?: string;
  memberCount?: number;
  groupImageUrl?: string;
  onView?: () => void;
};

const GroupCard: React.FC<GroupCardProps> = ({ name = 'Group Name', description, memberCount, groupImageUrl, onView }) => {
  return (
    <IonItemSliding>
      <IonItem button={true} detail={true}>
        <IonAvatar aria-hidden="true" slot="start" className='group-avatar ion-align-self-start avatar-square'>
          <img alt="" src={groupImageUrl || "/images/group_placeholder.jpg"} />
        </IonAvatar>
        <IonLabel className='ion-align-self-start'>
          <strong>{name}</strong>
          <IonText color="medium" className='ion-text-wrap'>
            <p>
            {description || 'No description provided.'}
            </p>
          </IonText>
          <div>
            <IonChip color="primary">{typeof memberCount === 'number' ? `${memberCount} Tenants` : 'Tenants'}</IonChip>
          </div>
        </IonLabel>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption onClick={onView}>View</IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default GroupCard;