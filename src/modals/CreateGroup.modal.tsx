import React, { useRef, useState } from 'react';
import {
  IonButtons,
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
  IonInput,
  IonImg,
  IonIcon,
  IonList,
  IonListHeader,
  IonLabel,
  IonTextarea,
} from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch } from '../store/hooks';
import { createGroup } from '../store/slices/groupSlice';
import { useIonActionSheet, useIonToast } from '@ionic/react';
import { pickAndUpload } from '../services/imageService';

const CreateGroup = ({ dismiss }: { dismiss: (data?: string | null | undefined | number, role?: string) => void }) => {
  const nameRef = useRef<HTMLIonInputElement>(null);
  const descriptionRef = useRef<HTMLIonTextareaElement>(null);
  const { user, refreshUserProfile } = useAuth();
  const dispatch = useAppDispatch();
  const [isCreating, setIsCreating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [presentActionSheet] = useIonActionSheet();
  const [presentToast] = useIonToast();

  const propertyId = user?.tenant_profile?.property_id;
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => dismiss(null, 'cancel')}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Create Group</IonTitle>
          <IonButtons slot="end">
            <IonButton 
              onClick={async () => {
                if (!propertyId) {
                  console.error('No property ID available');
                  return;
                }

                const groupName = nameRef.current?.value;
                const groupDescription = descriptionRef.current?.value;

                if (!groupName) {
                  console.error('Group name is required');
                  return;
                }

                setIsCreating(true);
                try {
                  await dispatch(createGroup({
                    name: groupName.toString(),
                    description: groupDescription?.toString(),
                    property_id: propertyId,
                    group_image_url: imageUrl
                  }));
                  
                  // Refresh user profile to get updated group_id
                  await refreshUserProfile();
                  dismiss(groupName, 'confirm');
                } catch (error) {
                  console.error('Failed to create group:', error);
                } finally {
                  setIsCreating(false);
                }
              }} 
              strong={true}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Confirm'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ position: 'relative' }}>
          <IonImg
            src={imageUrl ||"/images/group_placeholder.jpg"}
            alt="Property Image"
            style={{objectPosition: 'center'}}
          />
          <IonButton
            fill="solid"
            size="small"
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              '--background': '#3880ff',
              '--color': 'white',
              '--border-radius': '50%',
              width: '40px',
              height: '40px'
            }}
            onClick={async () => {
              presentActionSheet({
                header: 'Select Image Source',
                buttons: [
                  {
                    text: 'Camera',
                    handler: async () => {
                      try {
                        const url = await pickAndUpload({ source: 'camera', pathPrefix: 'groups' });
                        setImageUrl(url);
                      } catch {
                        presentToast({ message: 'Failed to pick image', duration: 2000, color: 'danger' });
                      }
                    }
                  },
                  {
                    text: 'Gallery',
                    handler: async () => {
                      try {
                        const url = await pickAndUpload({ source: 'gallery', pathPrefix: 'groups' });
                        setImageUrl(url);
                      } catch {
                        presentToast({ message: 'Failed to pick image', duration: 2000, color: 'danger' });
                      }
                    }
                  },
                  { text: 'Cancel', role: 'cancel' }
                ]
              });
            }}
          >
            <IonIcon icon={cameraOutline} />
          </IonButton>
        </div>
        
        <IonList mode='ios' lines='inset' className='input-wrapper ion-padding-vertical'>
          <IonListHeader className='ion-margin-bottom'>
            <IonLabel>Group Details</IonLabel>
          </IonListHeader>
          
          <IonItem>
            <IonInput 
              ref={nameRef}
              labelPlacement="stacked" 
              mode='md' 
              type='text' 
              label="Group Name" 
              placeholder="Enter Group name"
              required
            />
          </IonItem>
          
          <IonItem>
            <IonTextarea 
              ref={descriptionRef}
              label="Description" 
              labelPlacement="stacked" 
              rows={5}
              placeholder="Enter group description"
            />
          </IonItem>
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default CreateGroup;