import { IonContent, IonFab, IonFabButton, IonHeader, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import { PropertyCard } from "../../../components/property/PropertyCard"
import PageHeader from "../../../components/common/PageHeader"
import AppMenu from "../../../components/common/AppMenu"
import { Property } from "../../../types/property"

const FindProperty = () => {
  // Mock data for demonstration - in a real app, this would come from an API
  const mockProperties: Property[] = [
    {
      id: 1,
      name: "Sunset Apartments",
      address: "123 Main Street, City Center",
      description: "Modern apartment complex with great amenities",
      space_available: 3,
      property_image: "https://ionicframework.com/docs/img/demos/avatar.svg",
      tags: ["AC Room", "Furnished"],
      owner_id: 1,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Downtown Residences",
      address: "456 Oak Avenue, Downtown",
      description: "Luxury living in the heart of the city",
      space_available: 1,
      property_image: "https://ionicframework.com/docs/img/demos/avatar.svg",
      tags: ["Premium", "Pet Friendly"],
      owner_id: 2,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      name: "Garden View Complex",
      address: "789 Pine Street, Suburbs",
      description: "Peaceful living with beautiful garden views",
      space_available: 2,
      property_image: "https://ionicframework.com/docs/img/demos/avatar.svg",
      tags: ["Garden View", "Quiet"],
      owner_id: 3,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 4,
      name: "Riverside Apartments",
      address: "321 River Road, Riverside",
      description: "Scenic riverside location with modern facilities",
      space_available: 4,
      property_image: "https://ionicframework.com/docs/img/demos/avatar.svg",
      tags: ["Riverside", "Modern"],
      owner_id: 4,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 5,
      name: "Mountain View Lodge",
      address: "654 Hill Street, Mountain View",
      description: "Breathtaking mountain views and luxury amenities",
      space_available: 1,
      property_image: "https://ionicframework.com/docs/img/demos/avatar.svg",
      tags: ["Mountain View", "Luxury"],
      owner_id: 5,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    }
  ];
  
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
            {mockProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
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