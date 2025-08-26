import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import TenantPropertyRequestCard from "../../../components/tenant/PropertyRequest/TenantPropertyRequestCard"

const PropertyRequests = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle >Property Requests</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Property Requests</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList lines='inset' inset={true}>
          <TenantPropertyRequestCard />
          <TenantPropertyRequestCard />
          <TenantPropertyRequestCard />
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default PropertyRequests