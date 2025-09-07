import { IonAvatar, IonChip, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonText, useIonRouter } from '@ionic/react';
import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './GroupCard.css';

type GroupCardProps = {
  name?: string;
  description?: string;
  memberCount?: number;
  groupImageUrl?: string;
  groupId?: number;
  onView?: () => void;
};

const GroupCard: React.FC<GroupCardProps> = ({ name = 'Group Name', description, memberCount, groupImageUrl, groupId, onView }) => {
  const { userRole } = useAuth();
  const router = useIonRouter();

  const handleCardClick = () => {
    if (groupId) {
      // Navigate based on user role
      if (userRole === 'owner') {
        router.push('/owner/group-detail/' + groupId, 'forward');
      } else if (userRole === 'tenant') {
        router.push('/tenant/group-detail/' + groupId, 'forward');
      }
    }
  };

  return (
    <IonItemSliding>
      <IonItem button={true} detail={true} onClick={handleCardClick}>
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
        </IonLabel>
        <IonChip color="primary">{typeof memberCount === 'number' ? `${memberCount} Tenants` : 'Tenants'}</IonChip>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption onClick={onView}>View</IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default GroupCard;