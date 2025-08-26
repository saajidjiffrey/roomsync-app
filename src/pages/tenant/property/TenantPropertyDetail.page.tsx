import {
  IonButton,
  IonChip,
  IonContent,
  IonFooter,
  IonImg,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonText,
} from '@ionic/react';
import './TenantPropertyDetail.css';
import { GroupCard } from '../../../components/group/GroupCard';

const TenantPropertyDetail: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonImg
          src="https://docs-demo.ionic.io/assets/madison.jpg"
          alt="The Wisconsin State Capitol building in Madison, WI at night"
        ></IonImg>

        <div className='ion-align-self-start ion-padding-horizontal'>
          <IonText>
            <h1>Propety Name</h1>
          </IonText>
          <IonNote color="medium" className="ion-text-wrap">
            123, King's street, Kandy
          </IonNote>
          <br />
          <IonText className='ion-text-wrap'>
            <p>
              02 remaining spaces available
            </p>
          </IonText>
        </div>
        <div className='ion-padding-horizontal'>
          <IonText className='ion-text-wrap'>
            <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus..
            </p>
          </IonText>
          <div>
            <IonChip color="dark">AC Room</IonChip>
            <IonChip color="dark">AC Room</IonChip>
          </div>
        </div>
        <IonList lines='inset' inset={true}>
          <IonListHeader className='ion-margin-bottom'>
            <IonLabel>Groups</IonLabel>
          </IonListHeader>

          <GroupCard/>
          <GroupCard/>
          <GroupCard/>
          <GroupCard/>
        </IonList>
        
      </IonContent>
      <IonFooter className='ion-padding'>
        <IonButton expand="block">Request to Join</IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default TenantPropertyDetail;