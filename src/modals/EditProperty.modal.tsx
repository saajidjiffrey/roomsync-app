import React, { useState, useEffect } from 'react';
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
import { propertyAPI } from '../api/propertyApi';
import { showLoadingSpinner, stopLoadingSpinner } from '../utils/spinnerUtils';
import { pickAndUpload } from '../services/imageService';
import { useIonActionSheet, useIonToast } from '@ionic/react';
import { Property } from '../types/property';
import './EditProperty.modal.css';

interface FormErrors {
  name?: string;
  address?: string;
  description?: string;
  space_available?: string;
  property_image?: string;
  tags?: string;
}

interface EditPropertyModalProps {
  dismiss: (data?: string | null | undefined | number, role?: string) => void;
  property: Property;
}

const EditPropertyModal = ({ dismiss, property }: EditPropertyModalProps) => {
  const [presentActionSheet] = useIonActionSheet();
  const [presentToast] = useIonToast();

  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: property?.name || '',
    address: property?.address || '',
    description: property?.description || '',
    space_available: property?.space_available?.toString() || '',
    property_image: property?.property_image || '',
    tags: property?.tags || [],
  });

  // Safety check - if property is not available, close modal
  useEffect(() => {
    if (!property) {
      presentToast({
        message: 'Property data not available',
        duration: 2000,
        color: 'danger'
      });
      dismiss();
    }
  }, [property, dismiss, presentToast]);

  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Property name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Property name must be at least 2 characters';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
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

    showLoadingSpinner('Updating property...');
    
    try {
      const updateData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
        space_available: parseInt(formData.space_available.trim(), 10),
        property_image: formData.property_image || undefined,
        tags: formData.tags,
      };

      const response = await propertyAPI.updateProperty(property.id, updateData);
      
      if (response.success) {
        presentToast({
          message: 'Property updated successfully!',
          duration: 2000,
          color: 'success'
        });
        dismiss(null, 'confirm');
      } else {
        presentToast({
          message: response.message || 'Failed to update property',
          duration: 3000,
          color: 'danger'
        });
      }
    } catch (error) {
      console.error('Error updating property:', error);
      presentToast({
        message: 'Failed to update property',
        duration: 3000,
        color: 'danger'
      });
    } finally {
      stopLoadingSpinner();
    }
  };

  const handlePickImage = async () => {
    presentActionSheet({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Camera',
          handler: async () => {
            try {
              const url = await pickAndUpload({ source: 'camera', pathPrefix: 'properties' });
              setFormData(prev => ({ ...prev, property_image: url }));
            } catch {
              presentToast({ message: 'Failed to pick image', duration: 2000, color: 'danger' });
            }
          }
        },
        {
          text: 'Gallery',
          handler: async () => {
            try {
              const url = await pickAndUpload({ source: 'gallery', pathPrefix: 'properties' });
              setFormData(prev => ({ ...prev, property_image: url }));
            } catch {
              presentToast({ message: 'Failed to pick image', duration: 2000, color: 'danger' });
            }
          }
        },
        { text: 'Cancel', role: 'cancel' }
      ]
    });
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => dismiss(null, 'cancel')}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Edit Property</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSubmit} strong={true}>
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="image-container">
          <IonImg
            src={formData.property_image || "/images/property_placeholder.jpg"}
            alt="Property Image"
            className="property-image"
          />
          <IonButton
            fill="solid"
            size="small"
            className="camera-button"
            onClick={handlePickImage}
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
            <div className="tags-display">
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
        
      </IonContent>
    </IonPage>
  );
};

export default EditPropertyModal;
