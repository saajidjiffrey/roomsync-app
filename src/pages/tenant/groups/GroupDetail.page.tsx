import {
  IonContent,
  IonImg,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonText,
} from '@ionic/react';
import './GroupDetail.css';
import RoommateCard from '../../../components/roommate/RoommateCard';

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

          <RoommateCard showCheckbox={false} />
          <RoommateCard showCheckbox={false} />
        </IonList>
        
      </IonContent>
    </IonPage>
  );
};

export default GroupDetail;