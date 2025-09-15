import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonText, IonIcon, IonButton } from '@ionic/react';
import { helpCircleOutline, mailOutline } from 'ionicons/icons';
import PageHeader from '../../components/common/PageHeader';

const HelpSupport = () => {
  return (
    <IonPage>
      <PageHeader title="Help & Support" />
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Help & Support</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
          <IonCard>
            <IonCardContent>
              <div className="ion-text-center ion-margin-bottom">
                <IonIcon icon={helpCircleOutline} size="large" color="primary" />
              </div>
              <IonText>
                <h2 className="ion-text-center">Need Help?</h2>
                <p className="ion-text-center ion-margin-top">
                  If you have any questions or need assistance, please contact us.
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardContent>
              <IonText>
                <h3>
                  <IonIcon icon={mailOutline} className="ion-margin-end" />
                  Contact Support
                </h3>
                <p>Send us an email and we'll get back to you as soon as possible.</p>
                
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

export default HelpSupport;
