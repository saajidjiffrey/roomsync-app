import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, IonText } from "@ionic/react"
import TenantPropertyRequestCard from "../../../components/tenant/PropertyRequest/TenantPropertyRequestCard"
import PageHeader from "../../../components/common/PageHeader"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { fetchMyJoinRequests } from "../../../store/slices/propertyJoinRequestSlice"
import { showLoadingSpinner, stopLoadingSpinner } from "../../../utils/spinnerUtils"

const PropertyRequests = () => {
  const dispatch = useAppDispatch()
  const { myRequests, isLoading } = useAppSelector((state) => state.joinRequest)

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
  return (
    <IonPage>
        <PageHeader title="Property Requests" />
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Property Requests</IonTitle>
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
                <TenantPropertyRequestCard key={req.id} request={req} />
              ))}
            </IonList>
          )}
        </IonContent>
    </IonPage>
  )
}

export default PropertyRequests