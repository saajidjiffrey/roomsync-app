import {
  IonButton,
  IonChip,
  IonContent,
  IonImg,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonText,
} from '@ionic/react';
import './PropertyDetail.page.css';
import { GroupCard } from '../../components/group/GroupCard';

const OwnerPropertyDetailPage: React.FC = () => {
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
        <div className='button-container ion-padding-horizontal'>
          <IonButton size='small' shape="round" routerLink="#" expand="block">Edit Property</IonButton>
          <IonButton size='small' shape="round" routerLink="#" expand='block'>Create Ad</IonButton>
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
    </IonPage>
  );
};

export default OwnerPropertyDetailPage;