import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react"
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
      </IonContent>
    </IonPage>
  )
}

export default FindProperty