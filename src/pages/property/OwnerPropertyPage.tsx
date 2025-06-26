import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import './OwnerPropertyPage.css';
import { PropertyCard } from '../../components/property/PropertyCard';

const OwnerPropertyPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Properties</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='ion-padding'>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Properties</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default OwnerPropertyPage;