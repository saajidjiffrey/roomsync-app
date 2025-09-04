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
  IonList,
  IonListHeader,
  IonLabel,
} from '@ionic/react';
import { } from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMyProperties } from '../store/slices/propertySlice';
import { createPropertyAd } from '../store/slices/propertyAdSlice';
import { showLoadingSpinner, stopLoadingSpinner } from '../utils/spinnerUtils';
import { useEffect } from 'react';
import { IonSelect, IonSelectOption, IonToggle } from '@ionic/react';

interface FormErrors {
  property_id?: string;
  number_of_spaces_looking_for?: string;
}

const CreatePropertyAdModal = ({ dismiss }: { dismiss: (data?: string | null | undefined | number, role?: string) => void }) => {
  const dispatch = useAppDispatch();
  const { properties } = useAppSelector((state) => state.property);

  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    property_id: '' as string | number,
    number_of_spaces_looking_for: '' as string,
    is_active: true,
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.property_id) {
      newErrors.property_id = 'Property is required';
    }
    if (!formData.number_of_spaces_looking_for) {
      newErrors.number_of_spaces_looking_for = 'Number of spaces is required';
    } else {
      const num = parseInt(formData.number_of_spaces_looking_for.trim(), 10);
      if (isNaN(num) || num < 1) {
        newErrors.number_of_spaces_looking_for = 'Must be at least 1';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    showLoadingSpinner('Creating property ad...');
    
    try {
      const createAdData = {
        property_id: typeof formData.property_id === 'string' ? parseInt(formData.property_id, 10) : formData.property_id,
        number_of_spaces_looking_for: parseInt(formData.number_of_spaces_looking_for.trim(), 10),
        is_active: formData.is_active,
      };

      const result = await dispatch(createPropertyAd(createAdData));
      
      // Check if the action was fulfilled (successful)
      if (createPropertyAd.fulfilled.match(result)) {
        // Property ad created successfully, close the modal
        dismiss(null, 'confirm');
      }
      // If rejected, the error will be handled by the slice and shown in toast
    } catch (error) {
      console.error('Create property ad error:', error);
    } finally {
      stopLoadingSpinner();
    }
  };

  useEffect(() => {
    // Ensure properties are loaded for the select list
    if (!properties || properties.length === 0) {
      dispatch(fetchMyProperties());
    }
  }, [dispatch, properties]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => dismiss(null, 'cancel')}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Create Property Ad</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSubmit} strong={true}>
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList mode='ios' lines='inset' className='input-wrapper ion-padding-vertical'>
          {/* <IonListHeader className='ion-margin-bottom'>
            <IonLabel>Ad Details</IonLabel>
          </IonListHeader> */}

          <IonItem>
            <IonSelect 
              labelPlacement="stacked"
              label="Select Property"
              interface="action-sheet"
              placeholder="Select property"
              value={formData.property_id}
              onIonChange={(e) => handleInputChange('property_id', e.detail.value)}
              className={errors.property_id ? 'ion-invalid ion-touched' : ''}
            >
              {properties.map((p) => (
                <IonSelectOption key={p.id} value={p.id}>{p.name}</IonSelectOption>
              ))}
            </IonSelect>
            {errors.property_id && <IonLabel color="danger" style={{ fontSize: '0.8rem' }}>{errors.property_id}</IonLabel>}
          </IonItem>

          <IonItem>
            <IonInput 
              labelPlacement="stacked" 
              mode='md' 
              type='number' 
              label="Number of tenants needed" 
              placeholder="Enter number"
              value={formData.number_of_spaces_looking_for}
              onIonInput={(e) => handleInputChange('number_of_spaces_looking_for', e.detail.value!)}
              className={errors.number_of_spaces_looking_for ? 'ion-invalid ion-touched' : ''}
            />
            {errors.number_of_spaces_looking_for && <IonLabel color="danger" style={{ fontSize: '0.8rem' }}>{errors.number_of_spaces_looking_for}</IonLabel>}
          </IonItem>

          <IonItem>
            <IonLabel>Ad Status</IonLabel>
            <IonToggle
              slot="end"
              checked={formData.is_active}
              onIonChange={(e) => handleInputChange('is_active', e.detail.checked)}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CreatePropertyAdModal;