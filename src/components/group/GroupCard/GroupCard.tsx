import { IonAvatar, IonChip, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonText } from '@ionic/react';
import React from 'react';
import './GroupCard.css';

const GroupCard: React.FC = () => {

  return (
    <IonItemSliding>
      <IonItem button={true} detail={true}>
        <IonAvatar aria-hidden="true" slot="start" className='group-avatar ion-align-self-start avatar-square'>
          <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </IonAvatar>
        <IonLabel className='ion-align-self-start'>
          <strong>Group Name</strong>
          <IonText color="medium" className='ion-text-wrap'>
            <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit.
            </p>
          </IonText>
          <div>
            <IonChip color="primary">5 Tenants</IonChip>
          </div>
        </IonLabel>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption>View</IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default GroupCard;