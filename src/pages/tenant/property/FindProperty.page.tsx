import { IonContent, IonFab, IonFabButton, IonHeader, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonText } from "@ionic/react"
import PropertyAd from "../../../components/property/PropertyAd/PropertyAd"
import PageHeader from "../../../components/common/PageHeader"
import { useEffect } from "react"
import { showLoadingSpinner, stopLoadingSpinner } from "../../../utils/spinnerUtils"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { fetchAllPropertyAds } from "../../../store/slices/propertyAdSlice"

const FindProperty = () => {
  const dispatch = useAppDispatch()
  const { propertyAds, isLoading } = useAppSelector((state) => state.propertyAd)

  useEffect(() => {
    const load = async () => {
      showLoadingSpinner('Loading properties...')
      try {
        await dispatch(fetchAllPropertyAds({ is_active: true }))
      } finally {
        stopLoadingSpinner()
      }
    }
    load()
  }, [dispatch])
  
  return (
    <IonPage>
        <PageHeader title="Find Properties" />
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Find Properties</IonTitle>
            </IonToolbar>
          </IonHeader>
          {(!propertyAds || propertyAds.length === 0) && !isLoading ? (
            <div className='ion-text-center ion-padding ion-margin-top'>
              <IonText>
                <p>No property ads found.</p>
              </IonText>
            </div>
          ) : (
            <IonList lines='inset' inset={true}>
              {propertyAds.map((ad) => (
                <PropertyAd key={ad.id} ad={ad} />
              ))}
            </IonList>
          )}
          <IonFab vertical="bottom" horizontal="end" slot="fixed" >
            <IonFabButton routerLink="/tenant/group-detail">
              <IonLabel>test</IonLabel>
            </IonFabButton>
          </IonFab>
        </IonContent>
    </IonPage>
  )
}

export default FindProperty