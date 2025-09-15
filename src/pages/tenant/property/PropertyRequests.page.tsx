import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, IonText, useIonAlert } from "@ionic/react"
import TenantPropertyRequestCard from "../../../components/tenant/PropertyRequest/TenantPropertyRequestCard"
import PageHeader from "../../../components/common/PageHeader"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { fetchMyJoinRequests, deleteJoinRequest } from "../../../store/slices/propertyJoinRequestSlice"
import { showLoadingSpinner, stopLoadingSpinner } from "../../../utils/spinnerUtils"
import { PropertyJoinRequest } from "../../../types/propertyJoinRequest"

const PropertyRequests = () => {
  const dispatch = useAppDispatch()
  const { myRequests, isLoading } = useAppSelector((state) => state.joinRequest)
  const [presentAlert] = useIonAlert()

  useEffect(() => {
    const load = async () => {
      showLoadingSpinner('Loading requests...')
      try {
        await dispatch(fetchMyJoinRequests())
      } finally {
        stopLoadingSpinner()
      }
    }
    load()
  }, [dispatch])

  const handleDeleteRequest = async (request: PropertyJoinRequest) => {
    presentAlert({
      header: 'Delete Request',
      message: 'Are you sure you want to delete this property request? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            try {
              showLoadingSpinner('Deleting request...');
              await dispatch(deleteJoinRequest(request.id));
              // Refresh requests after deletion
              await dispatch(fetchMyJoinRequests());
            } catch (error) {
              console.error('Error deleting request:', error);
            } finally {
              stopLoadingSpinner();
            }
          },
        },
      ],
    });
  };
  return (
    <IonPage>
        <PageHeader title="My Requests" />
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">My Requests</IonTitle>
            </IonToolbar>
          </IonHeader>
          {(!myRequests || myRequests.length === 0) && !isLoading ? (
            <div className='ion-text-center ion-padding ion-margin-top'>
              <IonText>
                <p>No requests found.</p>
              </IonText>
            </div>
          ) : (
            <IonList lines='inset' inset={true}>
              {myRequests.map((req) => (
                <TenantPropertyRequestCard 
                  key={req.id} 
                  request={req} 
                  onDelete={handleDeleteRequest}
                />
              ))}
            </IonList>
          )}
        </IonContent>
    </IonPage>
  )
}

export default PropertyRequests