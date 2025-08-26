import { IonButton, IonContent, IonFooter, IonHeader, IonInput, IonItem, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList mode='ios' lines='inset' inset className='input-wrapper ion-padding-vertical'>
          <IonItem>
            <IonInput labelPlacement="floating" mode='md' type='email' label="Email" placeholder="Enter email"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput labelPlacement="floating" mode='md' type='password' label="Password" placeholder="Enter password"></IonInput>
          </IonItem>   
        </IonList>
      </IonContent>
      <IonFooter className='ion-padding ion-no-border'>
        <IonButton shape="round" size='default' expand="block" routerLink="/owner/property">Login</IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default LoginPage;
