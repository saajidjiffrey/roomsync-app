import { IonButton, IonContent, IonFooter, IonImg, IonPage, IonText, IonTitle } from '@ionic/react';
import React from 'react';
import './LandingPage.css';

const LandingPage: React.FC = () => {

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonImg
          src="https://docs-demo.ionic.io/assets/madison.jpg"
          alt="The Wisconsin State Capitol building in Madison, WI at night"
        ></IonImg>
        <div className='ion-padding'>
          <IonTitle size="large" className='ion-no-padding'>Welcome</IonTitle>
          <IonText>
            <p>
              RoomSync is a platform that allows you to sync your roommates' schedules and find the best time to meet.
            </p>
          </IonText>
        </div>
      </IonContent> 
      <IonFooter className='ion-padding'>
        <div className='button-container'>
          <IonButton shape="round" routerLink="/signup" expand="block">Sign Up</IonButton>
          <IonButton shape="round" routerLink="/login" expand='block'>Login</IonButton>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default LandingPage;