import {
  IonButton,
  IonChip,
  IonContent,
  IonFooter,
  IonImg,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonText,
  IonActionSheet,
  IonItem,
} from '@ionic/react';
import './TenantPropertyDetail.css';
import { GroupCard } from '../../../components/group/GroupCard';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Property } from '../../../types/property';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPropertyAdById } from '../../../store/slices/propertyAdSlice';
import { showLoadingSpinner, stopLoadingSpinner } from '../../../utils/spinnerUtils';
import { createJoinRequest } from '../../../store/slices/propertyJoinRequestSlice';
import PageHeader from '../../../components/common/PageHeader';
import { fetchAvailableGroups, selectAvailableGroups, selectGroupIsLoading } from '../../../store/slices/groupSlice';

const TenantPropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentPropertyAd: ad } = useAppSelector((state) => state.propertyAd);
  const availableGroups = useAppSelector(selectAvailableGroups);
  const groupsLoading = useAppSelector(selectGroupIsLoading);
  const property = ad?.property as unknown as Property | null;
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      showLoadingSpinner('Loading property...');
      try {
        await dispatch(fetchPropertyAdById(parseInt(id, 10)));
        const propId = parseInt(id, 10);
      } finally {
        stopLoadingSpinner();
      }
    };
    load();
  }, [dispatch, id]);

  useEffect(() => {
    if (property?.id) {
      dispatch(fetchAvailableGroups(property.id));
    }
  }, [dispatch, property?.id]);
  return (
    <IonPage>
      <PageHeader title="Property Detail" showMenu={false} showBack={true} />
      <IonContent fullscreen>
        <IonImg
          src={property?.property_image || "images/property_placeholder.jpg"}
          alt={property?.name || 'Property'}
          style={{ objectPosition: 'center' }}
        ></IonImg>

        <div className='ion-align-self-start ion-padding-horizontal ion-padding-top'>
          <IonText>
            <h1>{property?.name ?? 'Property'}</h1>
          </IonText>
          <IonNote color="medium" className="ion-text-wrap">
            {property?.address}
          </IonNote>
          <br />
          <IonText className='ion-text-wrap'>
            <p>
              {property?.space_available} remaining spaces available
            </p>
          </IonText>
        </div>
        <div className='ion-padding-horizontal'>
          <IonText className='ion-text-wrap'>
            <p>
            {property?.description}
            </p>
          </IonText>
          <div>
            {property?.tags?.map((t, i) => (
              <IonChip key={i} color="dark">{t}</IonChip>
            ))}
          </div>
        </div>
        <IonList lines='inset' inset={true}>
          <IonListHeader className='ion-margin-bottom'>
            <IonLabel>Groups</IonLabel>
          </IonListHeader>

          {groupsLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <IonItem key={idx}>
                <IonNote className='ion-text-wrap' style={{ width: '100%' }}>
                  Loading group...
                </IonNote>
              </IonItem>
            ))
          ) : (availableGroups || []).length === 0 ? (
            <IonItem>
              <IonLabel>No groups yet for this property</IonLabel>
            </IonItem>
          ) : (
            availableGroups.map(group => (
              <GroupCard
                key={group.id}
                name={group.name}
                description={group.description}
                memberCount={group.member_count ?? group.members?.length}
                onView={() => {}}
              />
            ))
          )}
        </IonList>
        
      </IonContent>
      <IonFooter className='ion-padding'>
        <IonButton expand="block" onClick={() => setShowConfirm(true)}>Request to Join</IonButton>
      </IonFooter>
      <IonActionSheet
        isOpen={showConfirm}
        onDidDismiss={() => setShowConfirm(false)}
        header="Are you sure you want to send a join request?"
        buttons={[
          {
            text: 'Yes',
            role: 'confirm',
            handler: async () => {
              await dispatch(createJoinRequest({ property_ad_id: parseInt(id, 10) }));
            },
          },
          {
            text: 'No',
            role: 'cancel',
          },
        ]}
      />
    </IonPage>
  );
};

export default TenantPropertyDetail;