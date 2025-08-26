import { IonContent, IonFab, IonFabButton, IonHeader, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import PropertyCard from "../../../components/property/PropertyCard/PropertyCard"

const FindProperty = () => {
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle >Find Properties</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Find Properties</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList lines='inset' inset={true}>
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed" >
          <IonFabButton routerLink="/tenant/select-group">
            <IonLabel>test</IonLabel>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default FindProperty