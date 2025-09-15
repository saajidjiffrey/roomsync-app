import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonText, IonIcon, IonButton } from '@ionic/react';
import { mailOutline, homeOutline } from 'ionicons/icons';
import PageHeader from '../../components/common/PageHeader';

const About = () => {
  return (
    <IonPage>
      <PageHeader title="About" />
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">About RoomSync</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
          <IonCard>
            <IonCardContent>
              <div className="ion-text-center ion-margin-bottom">
                <IonIcon icon={homeOutline} size="large" color="primary" />
              </div>
              <IonText>
                <h2 className="ion-text-center">RoomSync</h2>
                <p className="ion-text-center ion-margin-top">
                  A property management app for owners and tenants to manage properties, 
                  expenses, and tasks together.
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardContent>
              <IonText>
                <h3>
                  <IonIcon icon={mailOutline} className="ion-margin-end" />
                  Contact
                </h3>
                <p>For questions or support, please contact us:</p>
                <div className="ion-margin-top">
                  <IonButton 
                    expand="block" 
                    fill="outline" 
                    href="mailto:mohamedsaajid22@gmail.com"
                    className="ion-margin-bottom"
                  >
                    <IonIcon icon={mailOutline} slot="start" />
                    Email Support
                  </IonButton>
                  <p className="ion-text-center ion-text-small ion-color-medium">
                    mohamedsaajid22@gmail.com
                  </p>
                </div>
              </IonText>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default About;
