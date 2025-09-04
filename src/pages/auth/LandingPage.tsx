import { IonButton, IonContent, IonFooter, IonImg, IonPage, IonText, IonTitle } from '@ionic/react';
import React from 'react';
import './LandingPage.css';

const LandingPage: React.FC = () => {

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonImg
          src="/images/landing_page.jpg"
          alt="RoomSync"
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
      <IonFooter className='ion-padding ion-no-border'>
        <div className=''>
          <IonButton shape="round" routerLink="/signup" expand="block">Sign Up</IonButton>
          <IonButton shape="round" routerLink="/login" expand='block'>Login</IonButton>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default LandingPage;