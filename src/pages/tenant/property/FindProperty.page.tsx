import { IonContent, IonFab, IonFabButton, IonHeader, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import PropertyCard from "../../../components/property/PropertyCard/PropertyCard"
import PageHeader from "../../../components/common/PageHeader"
import AppMenu from "../../../components/common/AppMenu"

const FindProperty = () => {
  
  return (
    <>
      <AppMenu menuId="main-content" />
      <IonPage id="main-content">
        <PageHeader title="Find Properties" />
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
            <IonFabButton routerLink="/tenant/group-detail">
              <IonLabel>test</IonLabel>
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonPage>
    </>
    
  )
}

export default FindProperty