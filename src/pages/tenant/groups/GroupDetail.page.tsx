import React, { useEffect } from 'react';
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
} from '@ionic/react';
import './GroupDetail.css';
import PageHeader from '../../../components/common/PageHeader';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMyGroups, selectGroupIsLoading, selectMyGroups } from '../../../store/slices/groupSlice';
import { useAuth } from '../../../hooks/useAuth';

const GroupDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectGroupIsLoading);
  const myGroups = useAppSelector(selectMyGroups);
  const { user } = useAuth();

  const propertyId = user?.tenant_profile?.property_id;
  const groupId = user?.tenant_profile?.group_id;

  useEffect(() => {
    if (groupId) {
      dispatch(fetchMyGroups());
    }
  }, [dispatch, groupId]);

  const currentGroup = myGroups?.find(g => g.id === groupId) || myGroups?.[0];

  return (
    <IonPage>
      <PageHeader title="Group Detail" showMenu={false} showBack={true} />
      <IonContent fullscreen>
        <IonImg
          src="/images/group_placeholder.jpg"
          alt="Group cover"
          style={{ objectPosition: 'center' }}
        ></IonImg>

        <div className='ion-align-self-start ion-padding-horizontal ion-margin-top'>
          {isLoading ? (
            <>
              <IonSkeletonText animated style={{ width: '60%', height: '2rem' }} />
              <IonSkeletonText animated style={{ width: '100%', height: '4rem', marginTop: '0.5rem' }} />
            </>
          ) : !currentGroup ? (
            <IonText>
              <h2>No group found</h2>
              <p>{propertyId ? 'You have not joined a group yet.' : 'Please join a property first.'}</p>
            </IonText>
          ) : (
            <>
              <IonText>
                <h1>{currentGroup.name}</h1>
              </IonText>
              <IonText className='ion-text-wrap'>
                <p>{currentGroup.description || 'No description provided.'}</p>
              </IonText>
              <div className="card ion-padding">
                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <strong>Property</strong>
                    <p className="mb-0">{currentGroup.property?.name || `Property #${currentGroup.property_id}`}</p>
                  </div>
                  <div className="col-12 col-md-3">
                    <strong>Members</strong>
                    <p className="mb-0">{currentGroup.member_count ?? currentGroup.members?.length ?? 0}</p>
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
          ) : (currentGroup?.members || []).length === 0 ? (
            <IonItem>
              <IonLabel>No members found</IonLabel>
            </IonItem>
          ) : (
            currentGroup!.members!.map(member => (
              <IonItem key={member.id} button={true} detail={true}>
                <IonAvatar aria-hidden="true" slot="start" className='user-avatar ion-align-self-start avatar-square'>
                  <img alt="" src={'/images/user_placeholder.jpg'} />
                </IonAvatar>
                <IonLabel className='ion-align-self-start'>
                  <strong>{member.tenantUser?.full_name || `Tenant #${member.id}`}</strong>
                  <div>
                    <IonChip color="primary">{member.tenantUser?.email || 'Member'}</IonChip>
                  </div>
                </IonLabel>
              </IonItem>
            ))
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default GroupDetail;