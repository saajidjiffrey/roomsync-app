import {
  IonAvatar,
  IonChip,
  IonContent,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonText,
} from '@ionic/react';
import './GroupDetail.css';

const GroupDetail: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonImg
          src="https://docs-demo.ionic.io/assets/madison.jpg"
          alt="The Wisconsin State Capitol building in Madison, WI at night"
        ></IonImg>

        <div className='ion-align-self-start ion-padding-horizontal'>
          <IonText>
            <h1>Group Name 123</h1>
          </IonText>
          <IonText className='ion-text-wrap'>
            <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus..
            </p>
          </IonText>
        </div>
        <IonList lines='inset'>
          <IonListHeader className='ion-margin-bottom'>
            <IonLabel>Group Members</IonLabel>
          </IonListHeader>

          <IonItem button={true} detail={true}>
            <IonAvatar aria-hidden="true" slot="start" className='user-avatar ion-align-self-start avatar-square'>
              <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            </IonAvatar>
            <IonLabel className='ion-align-self-start'>
              <strong>Roommate #1</strong>
              <div>
                <IonChip color="primary">Occupation</IonChip>
              </div>
            </IonLabel>
          </IonItem>
          <IonItem button={true} detail={true}>
            <IonAvatar aria-hidden="true" slot="start" className='user-avatar ion-align-self-start avatar-square'>
              <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            </IonAvatar>
            <IonLabel className='ion-align-self-start'>
              <strong>Roommate #1</strong>
              <div>
                <IonChip color="primary">Occupation</IonChip>
              </div>
            </IonLabel>
          </IonItem>
        </IonList>
        
      </IonContent>
    </IonPage>
  );
};

export default GroupDetail;