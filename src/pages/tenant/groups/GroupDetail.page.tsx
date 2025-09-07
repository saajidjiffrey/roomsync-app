import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonImg,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonText,
  IonItem,
  IonAvatar,
  IonSkeletonText,
  IonChip,
  IonButton,
  IonFooter,
  IonActionSheet,
  IonToast,
} from '@ionic/react';
import './GroupDetail.css';
import PageHeader from '../../../components/common/PageHeader';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMyGroups, selectGroupIsLoading, selectMyGroups, leaveGroup, fetchGroupDetails, selectCurrentGroup } from '../../../store/slices/groupSlice';
import { useAuth } from '../../../hooks/useAuth';
import { selectToPaySplits } from '../../../store/slices/splitSlice';
import { useHistory, useParams } from 'react-router-dom';

const GroupDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { groupId: urlGroupId } = useParams<{ groupId: string }>();
  const isLoading = useAppSelector(selectGroupIsLoading);
  const myGroups = useAppSelector(selectMyGroups);
  const currentGroup = useAppSelector(selectCurrentGroup);
  const toPaySplits = useAppSelector(selectToPaySplits);
  const { user, refreshUserProfile } = useAuth();

  const propertyId = user?.tenant_profile?.property_id;
  const userGroupId = user?.tenant_profile?.group_id;
  const groupId = urlGroupId ? parseInt(urlGroupId, 10) : userGroupId;
  
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (groupId) {
      if (urlGroupId) {
        // If groupId is from URL, fetch specific group details
        dispatch(fetchGroupDetails(groupId));
      } else {
        // If no URL groupId, fetch user's groups (legacy behavior)
        dispatch(fetchMyGroups());
      }
    }
  }, [dispatch, groupId, urlGroupId]);

  // Use currentGroup from Redux if available, otherwise fall back to finding in myGroups
  const displayGroup = currentGroup || myGroups?.find(g => g.id === groupId) || myGroups?.[0];
  
  // Check if user is a member of this group
  const isGroupMember = displayGroup?.members?.some(member => member.user_id === user?.id);
  
  // Check if user has unpaid splits
  const hasUnpaidSplits = toPaySplits && toPaySplits.length > 0;

  const handleLeaveGroup = () => {
    if (hasUnpaidSplits) {
      setToastMessage('Please cover your splits before leaving the group.');
      setShowToast(true);
      return;
    }
    // Show confirmation action sheet
    setShowLeaveConfirm(true);
  };

  const handleLeaveConfirm = async () => {
    if (displayGroup?.id) {
      try {
        const result = await dispatch(leaveGroup(displayGroup.id));
        
        if (leaveGroup.fulfilled.match(result)) {
          // Fetch updated profile to get null group_id
          await refreshUserProfile();
          
          // Redirect to home page
          history.push('/tenant/home');
        }
        
        setShowLeaveConfirm(false);
      } catch (error) {
        console.error('Error leaving group:', error);
        setShowLeaveConfirm(false);
      }
    }
  };

  return (
    <IonPage>
      <PageHeader title="Group Detail" showMenu={false} showBack={true} />
      <IonContent fullscreen>
        <IonImg
          src={displayGroup?.group_image_url || "/images/group_placeholder.jpg"}
          alt="Group cover"
          style={{ objectPosition: 'center' }}
        ></IonImg>

        <div className='ion-align-self-start ion-padding-horizontal ion-margin-top'>
          {isLoading ? (
            <>
              <IonSkeletonText animated style={{ width: '60%', height: '2rem' }} />
              <IonSkeletonText animated style={{ width: '100%', height: '4rem', marginTop: '0.5rem' }} />
            </>
          ) : !displayGroup ? (
            <IonText>
              <h2>No group found</h2>
              <p>{propertyId ? 'You have not joined a group yet.' : 'Please join a property first.'}</p>
            </IonText>
          ) : (
            <>
              <IonText>
                <h1>{displayGroup.name}</h1>
              </IonText>
              <IonText className='ion-text-wrap'>
                <p>{displayGroup.description || 'No description provided.'}</p>
              </IonText>
              <div className="card ion-padding">
                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <strong>Property</strong>
                    <p className="mb-0">{displayGroup.Property?.name || `Property #${displayGroup.property_id}`}</p>
                  </div>
                  <div className="col-12 col-md-3">
                    <strong>Members</strong>
                    <p className="mb-0">{displayGroup.member_count ?? displayGroup.members?.length ?? 0}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <IonList lines='inset'>
          <IonListHeader className='ion-margin-bottom'>
            <IonLabel>Group Members</IonLabel>
          </IonListHeader>

          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <IonItem key={idx}>
                <IonSkeletonText animated style={{ width: '100%', height: '4rem' }} />
              </IonItem>
            ))
          ) : (displayGroup?.members || []).length === 0 ? (
            <IonItem>
              <IonLabel>No members found</IonLabel>
            </IonItem>
          ) : (
            displayGroup!.members!.map(member => (
              <IonItem key={member.id} button={true} detail={true}>
                <IonAvatar aria-hidden="true" slot="start" className='user-avatar ion-align-self-start avatar-square'>
                  <img alt="" src={'/images/user_placeholder.jpg'} />
                </IonAvatar>
                <IonLabel className='ion-align-self-start'>
                  <strong>{member.User?.full_name || `Tenant #${member.id}`}</strong>
                  <div>
                    <IonChip color="primary">{member.User?.email || 'Member'}</IonChip>
                  </div>
                </IonLabel>
              </IonItem>
            ))
          )}
        </IonList>
      </IonContent>
      
      {isGroupMember && (
        <IonFooter className='ion-padding'>
          <IonButton expand="block" color="danger" onClick={handleLeaveGroup}>
            Leave Group
          </IonButton>
        </IonFooter>
      )}
      
      <IonActionSheet
        isOpen={showLeaveConfirm}
        onDidDismiss={() => setShowLeaveConfirm(false)}
        header="Are you sure you want to leave this group?"
        buttons={[
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
      
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        color="danger"
      />
    </IonPage>
  );
};

export default GroupDetail;