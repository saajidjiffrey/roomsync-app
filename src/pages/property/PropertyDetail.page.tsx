import {
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonText,
  IonSpinner,
  useIonModal,
} from '@ionic/react';
import './PropertyDetail.page.css';
import { GroupCard } from '../../components/group/GroupCard';
import PageHeader from '../../components/common/PageHeader';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAvailableGroups, selectAvailableGroups, selectGroupIsLoading } from '../../store/slices/groupSlice';
import { propertyAPI } from '../../api/propertyApi';
import { Property } from '../../types/property';
import { showLoadingSpinner, stopLoadingSpinner } from '../../utils/spinnerUtils';
import { CreatePropertyAdModal, EditPropertyModal } from '../../modals';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { add, create, globe, newspaperOutline, pencil } from 'ionicons/icons';

const OwnerPropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const availableGroups = useAppSelector(selectAvailableGroups);
  const groupsLoading = useAppSelector(selectGroupIsLoading);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal hooks
  const [presentCreateAd, dismissCreateAd] = useIonModal(CreatePropertyAdModal, {
    dismiss: (data: string, role: string) => dismissCreateAd(data, role),
  });

  const [presentEditProperty, dismissEditProperty] = useIonModal(EditPropertyModal, {
    dismiss: (data: string, role: string) => dismissEditProperty(data, role),
    property: property,
  });

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        setError('Property ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        showLoadingSpinner('Loading property...');
        
        const response = await propertyAPI.getPropertyById(parseInt(id, 10));
        
        if (response.success && response.data) {
          setProperty(response.data);
        } else {
          setError(response.message || 'Failed to load property');
        }
      } catch (err) {
        setError('Failed to load property');
        console.error('Error loading property:', err);
      } finally {
        setLoading(false);
        stopLoadingSpinner();
      }
    };

    loadProperty();
  }, [id]);

  useEffect(() => {
    if (property?.id) {
      dispatch(fetchAvailableGroups(property.id));
    }
  }, [dispatch, property?.id]);

  if (loading) {
    return (
      <IonPage>
        <PageHeader title="Property Detail" showMenu={false} showBack={true} />
        <IonContent fullscreen className="ion-padding">
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Loading property...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (error || !property) {
    return (
      <IonPage>
        <PageHeader title="Property Detail" showMenu={false} showBack={true} />
        <IonContent fullscreen className="ion-padding">
          <div className="ion-text-center ion-padding">
            <IonText color="danger">
              <h3>{error || 'Property not found'}</h3>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <PageHeader title="Property Detail" showMenu={false} showBack={true} />
      <IonContent fullscreen>
        <IonImg
          src={property.property_image || "/images/property_placeholder.jpg"}
          alt={property.name || 'Property'}
          style={{ objectPosition: 'center' }}
        />

        <div className='ion-align-self-start ion-padding-horizontal ion-padding-top'>
          <IonText>
            <h1>{property.name}</h1>
          </IonText>
          <IonNote color="medium" className="ion-text-wrap">
            {property.address}
          </IonNote>
          <br />
          <IonText className='ion-text-wrap'>
            <p>
              {property.space_available} remaining spaces available
            </p>
          </IonText>
        </div>
        
        
        <div className='ion-padding-horizontal'>
          <IonText className='ion-text-wrap'>
            <p>
              {property.description || 'No description available'}
            </p>
          </IonText>
          <div>
            {property.tags?.map((tag, index) => (
              <IonChip key={index} color="dark">{tag}</IonChip>
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
        
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton disabled={loading || !property}>
            <IonIcon icon={pencil}></IonIcon>
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton disabled={loading || !property} onClick={() => {
              if (property && property.id && !loading) {
                presentEditProperty({
                  onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
                    if (event.detail.role === 'confirm') {
                      // Reload property data after successful edit
                      const loadProperty = async () => {
                        try {
                          showLoadingSpinner('Refreshing property...');
                          const response = await propertyAPI.getPropertyById(property.id);
                          if (response.success && response.data) {
                            setProperty(response.data);
                          }
                        } catch (err) {
                          console.error('Error reloading property:', err);
                        } finally {
                          stopLoadingSpinner();
                        }
                      };
                      loadProperty();
                    }
                  },
                });
              } else {
                console.error('Property data not available for editing');
              }
            }}>
              <IonIcon icon={create}></IonIcon>
            </IonFabButton>
            <IonFabButton disabled={loading || !property} onClick={() => {
              presentCreateAd({
                onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
                  if (event.detail.role === 'confirm') {
                    // Refresh property data if needed
                    console.log('Property ad created successfully');
                  }
                },
              });
            }}>
              <IonIcon icon={newspaperOutline}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default OwnerPropertyDetailPage;