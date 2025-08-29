import React from 'react';
import { IonAvatar, IonCheckbox, IonChip, IonItem, IonLabel } from '@ionic/react';

const RoommateCard: React.FC<{ showCheckbox: boolean }> = ({ showCheckbox = false }) => {
  return (
    <IonItem button={true} detail={!showCheckbox}>
      <IonAvatar aria-hidden="true" slot="start" className='user-avatar ion-align-self-start avatar-square'>
        <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
      </IonAvatar>
      <IonLabel className='ion-align-self-start'>
        <strong>Roommate #1</strong>
        <div>
          <IonChip color="primary">Occupation</IonChip>
        </div>
      </IonLabel>
      {showCheckbox && <IonCheckbox slot="end" />}
    </IonItem>
  );
};

export default RoommateCard;