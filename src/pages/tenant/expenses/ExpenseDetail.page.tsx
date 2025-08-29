import {
  IonContent,
  IonHeader,
  IonImg,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  IonChip,
  IonCol,
  IonRow,
  IonItem,
  IonAvatar,
} from '@ionic/react';
import RoommateCard from '../../../components/roommate/RoommateCard';

const ExpenseDetail: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle >Expense Detail</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='ion-padding'>
          <IonChip color="primary" ><IonLabel>Roommate 123</IonLabel></IonChip>
          <h1>Expense Title Expense Title 123</h1>
          <p className='mb-0'>28 Aug, 2025</p>
          <p className='mb-0'>Roommate 123</p>
          <p className='mt-3 mb-0'>Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus..</p>
        </div>
        <IonRow className='ion-padding-horizontal'>
          <IonCol size="4" className='ion-text-center'>
            <IonImg className='receipt-image' src="https://ionicframework.com/docs/img/demos/avatar.svg" />
          </IonCol>
          <IonCol size="4" className='ion-text-center'>
            <IonImg className='receipt-image' src="https://ionicframework.com/docs/img/demos/avatar.svg" />
          </IonCol>
          <IonCol size="4" className='ion-text-center'>
            <IonImg className='receipt-image' src="https://ionicframework.com/docs/img/demos/avatar.svg" />
          </IonCol>
        </IonRow>

        <div className='ion-padding ion-margin bg-light rounded-2'>
          <div className='d-flex justify-content-between align-items-center'>
            <IonLabel>Receipt Total</IonLabel>
            <IonLabel>LKR 4000</IonLabel>
          </div>
          <div className='d-flex justify-content-between align-items-center'>
            <IonLabel>Split Total</IonLabel>
            <IonLabel>LKR 2000</IonLabel>
          </div>
          <div className='d-flex justify-content-between align-items-center'>
            <IonLabel className='fw-bold text-danger'>Remaining</IonLabel>
            <IonLabel className='fw-bold text-danger'>LKR 2000</IonLabel>
          </div>
        </div>

        <IonList lines='inset'>
          <IonListHeader>
            <IonLabel >Split With</IonLabel>
          </IonListHeader>

          <IonItem>
            <IonAvatar aria-hidden="true" slot="start" className='user-avatar ion-align-self-start avatar-square'>
              <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            </IonAvatar>
            <IonLabel className='ion-align-self-start'>
              <strong>Roommate #1</strong>
              <span className='text-danger'>LKR 1000</span>
            </IonLabel>
            <IonChip color="primary" slot="end"><IonLabel>Paid</IonLabel></IonChip>
          </IonItem>
          <IonItem>
            <IonAvatar aria-hidden="true" slot="start" className='user-avatar ion-align-self-start avatar-square'>
              <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            </IonAvatar>
            <IonLabel className='ion-align-self-start'>
              <strong>Roommate #1</strong>
              <span className='text-danger'>LKR 1000</span>
            </IonLabel>
            <IonChip color="primary" slot="end"><IonLabel>Paid</IonLabel></IonChip>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ExpenseDetail;