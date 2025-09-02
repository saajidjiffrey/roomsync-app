import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import TenantPropertyRequestCard from "../../../components/tenant/PropertyRequest/TenantPropertyRequestCard"
import PageHeader from "../../../components/common/PageHeader"
import AppMenu from "../../../components/common/AppMenu"

const PropertyRequests = () => {
  return (
    <>
      <AppMenu menuId="main-content"/>
      <IonPage id="main-content">
        <PageHeader title="Property Requests" />
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
    </>
  )
}

export default PropertyRequests