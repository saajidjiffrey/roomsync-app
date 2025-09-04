import React from 'react';
import {
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonText,
  IonChip,
  IonFab,
  IonFabButton,
  useIonModal,
  IonIcon
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { CreateGroupModal } from '../../../modals';
import { addOutline } from 'ionicons/icons';

const SelectGroup = () => {
  const [present, dismiss] = useIonModal(CreateGroupModal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  });

  function openModal() {
    present({
      onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
        if (event.detail.role === 'confirm') {
          console.log(`Hello, ${event.detail.data}!`);
        }
      },
    });
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Select Group</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList >
          <IonItem button detail={false}>
            <IonAvatar aria-hidden="true" slot="start" className='group-avatar ion-align-self-start avatar-square'>
              <img alt="" src={"/images/user_placeholder.jpg"} />
            </IonAvatar>
            <IonLabel className='ion-align-self-start'>
              <strong>Group Name</strong>
              <IonText color="medium" className='ion-text-wrap'>
                <p>
                Lorem ipsum dolor sit amet consectetur.
                </p>
              </IonText>
              <div className='ion-align-items-center d-flex gap-2' >
                <IonChip color="primary">5/10 Tenants</IonChip>
                <IonButton size='small' color="primary">Join</IonButton>
              </div>
            </IonLabel>
          </IonItem>
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed" >
          <IonFabButton onClick={openModal}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default SelectGroup;