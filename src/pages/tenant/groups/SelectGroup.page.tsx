import React, { useEffect } from 'react';
import {
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonText,
  IonChip,
  IonFab,
  IonFabButton,
  useIonModal,
  IonIcon
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { CreateGroupModal } from '../../../modals';
import { addOutline } from 'ionicons/icons';
import { useAuth } from '../../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAvailableGroups, joinGroup, selectAvailableGroups, selectGroupIsLoading } from '../../../store/slices/groupSlice';
import { showLoadingSpinner, stopLoadingSpinner } from '../../../utils/spinnerUtils';

const SelectGroup = () => {
  const { user, refreshUserProfile } = useAuth();
  const dispatch = useAppDispatch();
  const availableGroups = useAppSelector(selectAvailableGroups);
  const isLoading = useAppSelector(selectGroupIsLoading);
  
  const [present, dismiss] = useIonModal(CreateGroupModal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  });

  const propertyId = user?.tenant_profile?.property_id;

  useEffect(() => {
    if (propertyId) {
      const loadGroups = async () => {
        showLoadingSpinner('Loading groups...');
        try {
          await dispatch(fetchAvailableGroups(propertyId));
        } finally {
          stopLoadingSpinner();
        }
      };
      loadGroups();
    }
  }, [dispatch, propertyId]);

  function openModal() {
    present({
      onWillDismiss: async (event: CustomEvent<OverlayEventDetail>) => {
        if (event.detail.role === 'confirm') {
          // Refresh user profile to get updated group_id after creating/joining group
          await refreshUserProfile();
          console.log(`Group created/joined: ${event.detail.data}`);
        }
      },
    });
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Select Group</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!propertyId ? (
          <div className="ion-text-center ion-margin-top">
            <IonText>
              <h2>No Property Selected</h2>
              <p>You need to join a property first to see available groups.</p>
            </IonText>
          </div>
        ) : availableGroups.length === 0 && !isLoading ? (
          <div className="ion-text-center ion-margin-top">
            <IonText>
              <h2>No Groups Available</h2>
              <p>There are no groups available in your property. Create one to get started!</p>
            </IonText>
          </div>
        ) : (
          <IonList>
            {availableGroups.map((group) => (
              <IonItem key={group.id} button detail={false}>
                <IonAvatar aria-hidden="true" slot="start" className='group-avatar ion-align-self-start avatar-square'>
                  <img alt="" src={group.group_image_url || "/images/group_placeholder.jpg"} />
                </IonAvatar>
                <IonLabel className='ion-align-self-start'>
                  <strong>{group.name}</strong>
                  <IonText color="medium" className='ion-text-wrap'>
                    <p>{group.description || 'No description available'}</p>
                  </IonText>
                  <div className='ion-align-items-center d-flex gap-2'>
                    <IonChip color="primary">
                      {group.member_count || 0}/{group.max_members || '∞'} Members
                    </IonChip>
                    {group.is_joined ? (
                      <IonChip color="success">Joined</IonChip>
                    ) : (
                      <IonButton 
                        size='small' 
                        color="primary"
                        onClick={async () => {
                          try {
                            await dispatch(joinGroup({ group_id: group.id }));
                            // Refresh user profile to get updated group_id
                            await refreshUserProfile();
                          } catch (error) {
                            console.error('Failed to join group:', error);
                          }
                        }}
                      >
                        Join
                      </IonButton>
                    )}
                  </div>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" >
          <IonFabButton onClick={openModal}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default SelectGroup;