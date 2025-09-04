import React, { useState } from 'react';
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
  IonChip,
} from '@ionic/react';
import { addOutline, cameraOutline, closeOutline } from 'ionicons/icons';
import { useAppDispatch } from '../store/hooks';
import { createProperty } from '../store/slices/propertySlice';
import { showLoadingSpinner, stopLoadingSpinner } from '../utils/spinnerUtils';

interface FormErrors {
  name?: string;
  address?: string;
  coordinates?: string;
  description?: string;
  space_available?: string;
  property_image?: string;
  tags?: string;
}

const CreatePropertyModal = ({ dismiss }: { dismiss: (data?: string | null | undefined | number, role?: string) => void }) => {
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    description: '',
    space_available: '',
    property_image: '',
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      // Clear tags error if it exists
      if (errors.tags) {
        setErrors(prev => ({ ...prev, tags: undefined }));
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Property name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Property name must be at least 2 characters';
    }
    
    if (!formData.address.trim()) {
      newErrors.address= 'Address is required';
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.space_available) {
      newErrors.space_available = 'Available slots is required';
    } else {
      const spaceNum = parseInt(formData.space_available.trim(), 10);
      if (isNaN(spaceNum) || spaceNum < 1) {
        newErrors.space_available = 'Available slots must be at least 1';
      }
    }
    
    if (!formData.tags.length) {
      newErrors.tags = 'At least one tag is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    showLoadingSpinner('Creating property...');
    
    try {
      const createPropertyData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
        space_available: parseInt(formData.space_available.trim(), 10),
        property_image: formData.property_image || undefined,
        tags: formData.tags,
        coordinates: formData.coordinates.latitude !== 0 && formData.coordinates.longitude !== 0 
          ? formData.coordinates 
          : undefined
      };

      const result = await dispatch(createProperty(createPropertyData));
      
      // Check if the action was fulfilled (successful)
      if (createProperty.fulfilled.match(result)) {
        // Property created successfully, close the modal
        dismiss(null, 'confirm');
      }
      // If rejected, the error will be handled by the slice and shown in toast
    } catch (error) {
      console.error('Create property error:', error);
    } finally {
      stopLoadingSpinner();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => dismiss(null, 'cancel')}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Create Property</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSubmit} strong={true}>
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ position: 'relative' }}>
          <IonImg
            src={'https://placehold.co/400'}
            alt="Property Image"
            style={{ height: '200px', objectFit: 'cover' }}
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
          >
            <IonIcon icon={cameraOutline} />
          </IonButton>
        </div>
        
        <IonList mode='ios' lines='inset' className='input-wrapper ion-padding-vertical'>
          <IonListHeader className='ion-margin-bottom'>
            <IonLabel>Property Details</IonLabel>
          </IonListHeader>
          
          <IonItem>
            <IonInput 
              labelPlacement="stacked" 
              mode='md' 
              type='text' 
              label="Property Name" 
              placeholder="Enter Property name"
              value={formData.name}
              onIonInput={(e) => handleInputChange('name', e.detail.value!)}
              className={errors.name ? 'ion-invalid ion-touched' : ''}
            />
            {errors.name && <IonLabel color="danger" style={{ fontSize: '0.8rem' }}>{errors.name}</IonLabel>}
          </IonItem>
          
          <IonItem>
            <IonInput 
              labelPlacement="stacked" 
              mode='md' 
              type='text' 
              label="Address" 
              placeholder="Enter Address"
              value={formData.address}
              onIonInput={(e) => handleInputChange('address', e.detail.value!)}
              className={errors.address ? 'ion-invalid ion-touched' : ''}
            />
            {errors.address && <IonLabel color="danger" style={{ fontSize: '0.8rem' }}>{errors.address}</IonLabel>}
          </IonItem>
          
          <IonItem>
            <IonTextarea 
              label="Description" 
              labelPlacement="stacked" 
              rows={5}
              placeholder="Enter property description"
              value={formData.description}
              onIonInput={(e) => handleInputChange('description', e.detail.value!)}
              className={errors.description ? 'ion-invalid ion-touched' : ''}
            />
            {errors.description && <IonLabel color="danger" style={{ fontSize: '0.8rem' }}>{errors.description}</IonLabel>}
          </IonItem>
          
          <IonItem>
            <IonInput 
              labelPlacement="stacked" 
              mode='md' 
              type='number' 
              label="Available slots" 
              placeholder="Enter Available slots"
              value={formData.space_available}
              onIonInput={(e) => handleInputChange('space_available', e.detail.value!)}
              className={errors.space_available ? 'ion-invalid ion-touched' : ''}
            />
            {errors.space_available && <IonLabel color="danger" style={{ fontSize: '0.8rem' }}>{errors.space_available}</IonLabel>}
          </IonItem>
        </IonList>

        <IonList mode='ios' lines='inset' className='input-wrapper ion-padding-vertical'>
          <IonListHeader className='ion-margin-bottom'>
            <IonLabel>Tags</IonLabel>
          </IonListHeader>
          
          <IonItem>
            <IonInput 
              labelPlacement="stacked" 
              mode='md' 
              type='text' 
              label="Add Tag" 
              placeholder="Enter tag and press add"
              value={newTag}
              onIonInput={(e) => setNewTag(e.detail.value!)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <IonButton 
              fill="clear" 
              size="small" 
              onClick={addTag}
              disabled={!newTag.trim()}
            >
              <IonIcon icon={addOutline} slot="icon-only" />
            </IonButton>
          </IonItem>
          
          <IonItem>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%' }}>
              {formData.tags.map((tag, index) => (
                <IonChip key={index} color="primary">
                  <IonLabel>{tag}</IonLabel>
                  <IonIcon 
                    icon={closeOutline} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => removeTag(tag)}
                  />
                </IonChip>
              ))}
              {formData.tags.length === 0 && (
                <IonLabel color="medium">No tags added yet</IonLabel>
              )}
            </div>
            {errors.tags && <IonLabel color="danger" style={{ fontSize: '0.8rem' }}>{errors.tags}</IonLabel>}
          </IonItem>
        </IonList>

        {/* <IonList mode='ios' lines='inset' className='input-wrapper ion-padding-vertical'>
          <IonListHeader className='ion-margin-bottom'>
            <IonLabel>Property Location</IonLabel>
          </IonListHeader>
          
          <IonItem>
            <div className="map-container" style={{ width: '100%', height: '300px', position: 'relative' }}>
              <MapContainer
                center={[6.9271, 79.8612]}
                zoom={13}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                                
                {true && (
                  <Marker position={[6.9271, 79.8612]}>
                    <Popup>
                      <div>
                        <strong>Selected Property Location</strong>
                        <br />
                        Lat: {6.9271.toFixed(6)}
                        <br />
                        Lng: {79.8612.toFixed(6)}
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
              
              <div 
                style={{ 
                  position: 'absolute', 
                  bottom: '10px', 
                  right: '10px', 
                  zIndex: 1000 
                }}
              >
                <IonButton 
                  fill="solid" 
                  size="small" 
                  onClick={() => {}}
                  style={{ 
                    '--background': '#3880ff',
                    '--color': 'white',
                    '--border-radius': '50%',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <IonIcon icon={locationOutline} />
                </IonButton>
              </div>
            </div>
          </IonItem>
          
          {true && (
            <IonItem>
              <IonLabel>
                <h3>Selected Location</h3>
                <p>Latitude: {6.9271.toFixed(6)}</p>
                <p>Longitude: {79.8612.toFixed(6)}</p>
                {true && (
                  <p>Address: {'123, King\'s street, Kandy'}</p>
                )}
              </IonLabel>
              <IonIcon icon={checkmarkCircle} color="success" slot="end" />
            </IonItem>
          )}
        </IonList> */}
        
      </IonContent>
    </IonPage>
  );
};

export default CreatePropertyModal;