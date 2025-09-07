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
import { useAuth } from '../../../hooks/useAuth';
import { leaveProperty } from '../../../store/slices/propertySlice';
import { fetchToPaySplits, fetchToReceiveSplits, fetchSplitSummary } from '../../../store/slices/splitSlice';
import { useHistory } from 'react-router-dom';

const TenantPropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { user, refreshUserProfile } = useAuth();
  const { currentPropertyAd: ad } = useAppSelector((state) => state.propertyAd);
  const availableGroups = useAppSelector(selectAvailableGroups);
  const groupsLoading = useAppSelector(selectGroupIsLoading);
  const property = ad?.Property as unknown as Property | null;
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      showLoadingSpinner('Loading property...');
      try {
        await dispatch(fetchPropertyAdById(parseInt(id, 10)));
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

  // Check if user is currently a tenant of this property
  const isCurrentTenant = user?.tenant_profile?.property_id === property?.id;
  
  // Check if user is in a group
  const isInGroup = user?.tenant_profile?.group_id !== null && user?.tenant_profile?.group_id !== undefined;

  const handleLeaveProperty = () => {
    if (isInGroup) {
      // Show action sheet with message that they need to leave group first
      setShowLeaveConfirm(true);
      return;
    }
    // Show confirmation action sheet
    setShowLeaveConfirm(true);
  };

  const handleLeaveConfirm = async () => {
    if (property?.id) {
      try {
        // First fetch splits to check totals
        await Promise.all([
          dispatch(fetchToPaySplits()),
          dispatch(fetchToReceiveSplits()),
          dispatch(fetchSplitSummary())
        ]);
        
        // Leave the property
        const result = await dispatch(leaveProperty(property.id));
        
        if (leaveProperty.fulfilled.match(result)) {
          // Fetch updated profile to get null group_id
          await refreshUserProfile();
          
          // Redirect to home page
          history.push('/tenant/home');
        }
        
        setShowLeaveConfirm(false);
      } catch (error) {
        console.error('Error leaving property:', error);
        setShowLeaveConfirm(false);
      }
    }
  };
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
                groupImageUrl={group.group_image_url}
                groupId={group.id}
                onView={() => {}}
              />
            ))
          )}
        </IonList>
        
      </IonContent>
      <IonFooter className='ion-padding'>
        {isCurrentTenant ? (
          <IonButton expand="block" color="danger" onClick={handleLeaveProperty}>
            Leave Property
          </IonButton>
        ) : (
          <IonButton expand="block" onClick={() => setShowConfirm(true)}>
            Request to Join
          </IonButton>
        )}
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
              const result = await dispatch(createJoinRequest({ property_ad_id: parseInt(id, 10) }));
              if (createJoinRequest.fulfilled.match(result)) {
                // Fetch updated profile to get new property_id
                await refreshUserProfile();
                
                // Redirect to home page
                history.push('/tenant/home');
              }
            },
          },
          {
            text: 'No',
            role: 'cancel',
          },
        ]}
      />
      <IonActionSheet
        isOpen={showLeaveConfirm}
        onDidDismiss={() => setShowLeaveConfirm(false)}
        header={isInGroup ? "Cannot leave property" : "Are you sure you want to leave this property?"}
        subHeader={isInGroup ? "You need to leave your group first before leaving the property." : undefined}
        buttons={isInGroup ? [
          {
            text: 'OK',
            role: 'cancel',
          },
        ] : [
          {
            text: 'Yes, Leave',
            role: 'destructive',
            handler: handleLeaveConfirm,
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ]}
      />
    </IonPage>
  );
};

export default TenantPropertyDetail;