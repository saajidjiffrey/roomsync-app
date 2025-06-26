import { IonButton, IonContent, IonFooter, IonHeader, IonInput, IonItem, IonList, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import './SignupPage.css';

const SignupPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Signup</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Signup</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList mode='ios' lines='inset' inset className='input-wrapper ion-padding-vertical'>
          <IonItem>
            <IonInput labelPlacement="floating" mode='md' type='text' label="Full Name" placeholder="Enter full name"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput labelPlacement="floating" mode='md' type='tel' label="Phone Number" placeholder="Enter phone number"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput labelPlacement="floating" mode='md' type='text' label="Occupation" placeholder="Enter occupation"></IonInput>
          </IonItem>
          <IonItem>
            <IonSelect interface="action-sheet" label="Select Role" labelPlacement="floating" placeholder="Select Role">
              <IonSelectOption value="tenant">Tenant</IonSelectOption>
              <IonSelectOption value="property-owner">Property Owner</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonInput labelPlacement="floating" mode='md' type='email' label="Email" placeholder="Enter email"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput labelPlacement="floating" mode='md' type='password' label="Password" placeholder="Enter password"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput labelPlacement="floating" mode='md' type='password' label="Confirm Password" placeholder="Confirm password"></IonInput>
          </IonItem>     
        </IonList>
      </IonContent>
      <IonFooter className='ion-padding'>
        <IonButton shape="round" size='default' expand="block">Signup</IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default SignupPage;
