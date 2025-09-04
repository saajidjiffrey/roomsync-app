import { IonButton, IonContent, IonFooter, IonHeader, IonInput, IonItem, IonList, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, IonText, IonInputPasswordToggle } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useHistory } from 'react-router';
import toastService from '../../services/toast';
import { showLoadingSpinner, stopLoadingSpinner } from '../../utils/spinnerUtils';
import './SignupPage.css';
import PageHeader from '../../components/common/PageHeader';

interface FormErrors {
  full_name?: string;
  phone_no?: string;
  occupation?: string;
  role?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_no: '',
    occupation: '',
    role: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  
  const { register, isLoading, error, clearError, isAuthenticated, user } = useAuth();
  const history = useHistory();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      switch (user.role) {
        case 'owner':
          history.push('/owner/my-properties');
          break;
        case 'tenant':
          history.push('/tenant/find-property');
          break;
        case 'admin':
          history.push('/admin/dashboard');
          break;
        default:
          history.push('/');
      }
    }
  }, [isAuthenticated, user, history]);

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      toastService.error(error);
    }
  }, [error]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Full name validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }
    
    // Phone number validation
    if (!formData.phone_no.trim()) {
      newErrors.phone_no = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone_no.trim())) {
      newErrors.phone_no = 'Please enter a valid phone number';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }

    showLoadingSpinner('Creating your account...');
    
    try {
      // Map role from UI to API format
      const roleMapping: { [key: string]: string } = {
        'property-owner': 'owner',
        'tenant': 'tenant'
      };

      const registerData = {
        full_name: formData.full_name.trim(),
        email: formData.email,
        password: formData.password,
        phone_no: formData.phone_no.trim(),
        occupation: formData.occupation.trim() || undefined,
        role: roleMapping[formData.role] as 'owner' | 'tenant'
      };

      await register(registerData);
      // Success toast will be shown in the Redux slice
      // Redirect will be handled by useEffect above
    } catch (error) {
      // Error is handled by the Redux slice and shown via useEffect above
      // Don't throw the error to prevent page refresh
      console.error('Registration error:', error);
    } finally {
      stopLoadingSpinner();
    }
  };

  return (
    <IonPage>
      <PageHeader title="Signup" showMenu={false} showBack={true} defaultHref='/landing'/>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Signup</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <form onSubmit={handleSubmit}>
          <IonList mode='ios' lines='inset' inset className='input-wrapper ion-padding-vertical'>
            <IonItem>
              <IonInput 
                labelPlacement="stacked" 
                mode='md' 
                type='text' 
                label="Full Name" 
                placeholder="Enter full name"
                value={formData.full_name}
                onIonInput={(e) => handleInputChange('full_name', e.detail.value || '')}
                className={errors.full_name ? 'ion-invalid' : ''}
              />
            </IonItem>
            {errors.full_name && (
              <IonText color="danger" className="ion-padding-start">
                <small>{errors.full_name}</small>
              </IonText>
            )}
            
            <IonItem>
              <IonInput 
                labelPlacement="stacked" 
                mode='md' 
                type='tel' 
                label="Phone Number" 
                placeholder="Enter phone number"
                value={formData.phone_no}
                onIonInput={(e) => handleInputChange('phone_no', e.detail.value || '')}
                className={errors.phone_no ? 'ion-invalid' : ''}
              />
            </IonItem>
            {errors.phone_no && (
              <IonText color="danger" className="ion-padding-start">
                <small>{errors.phone_no}</small>
              </IonText>
            )}
            
            <IonItem>
              <IonInput 
                labelPlacement="stacked" 
                mode='md' 
                type='text' 
                label="Occupation" 
                placeholder="Enter occupation (optional)"
                value={formData.occupation}
                onIonInput={(e) => handleInputChange('occupation', e.detail.value || '')}
              />
            </IonItem>
            
            <IonItem>
              <IonSelect 
                interface="action-sheet" 
                label="Select Role" 
                labelPlacement="stacked" 
                placeholder="Select Role"
                value={formData.role}
                onIonChange={(e) => handleInputChange('role', e.detail.value)}
                className={errors.role ? 'ion-invalid' : ''}
              >
                <IonSelectOption value="tenant">Tenant</IonSelectOption>
                <IonSelectOption value="property-owner">Property Owner</IonSelectOption>
              </IonSelect>
            </IonItem>
            {errors.role && (
              <IonText color="danger" className="ion-padding-start">
                <small>{errors.role}</small>
              </IonText>
            )}
            
            <IonItem>
              <IonInput 
                labelPlacement="stacked" 
                mode='md' 
                type='email' 
                label="Email" 
                placeholder="Enter email"
                value={formData.email}
                onIonInput={(e) => handleInputChange('email', e.detail.value || '')}
                className={errors.email ? 'ion-invalid' : ''}
              />
            </IonItem>
            {errors.email && (
              <IonText color="danger" className="ion-padding-start">
                <small>{errors.email}</small>
              </IonText>
            )}
            
            <IonItem>
              <IonInput 
                labelPlacement="stacked" 
                mode='md' 
                type='password' 
                label="Password" 
                placeholder="Enter password"
                value={formData.password}
                onIonInput={(e) => handleInputChange('password', e.detail.value || '')}
                className={errors.password ? 'ion-invalid' : ''}
               >
                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
              </IonInput>
            </IonItem>
            {errors.password && (
              <IonText color="danger" className="ion-padding-start">
                <small>{errors.password}</small>
              </IonText>
            )}
            
            <IonItem>
              <IonInput 
                labelPlacement="stacked" 
                mode='md' 
                type='password' 
                label="Confirm Password" 
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onIonInput={(e) => handleInputChange('confirmPassword', e.detail.value || '')}
                className={errors.confirmPassword ? 'ion-invalid' : ''}
              >
                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
              </IonInput>
            </IonItem>
            {errors.confirmPassword && (
              <IonText color="danger" className="ion-padding-start">
                <small>{errors.confirmPassword}</small>
              </IonText>
            )}
          </IonList>
            <div className='ion-text-center d-flex flex-row justify-content-center align-items-center'>
              <IonText>
              <small>Already have an account? </small>
            </IonText>
            <IonButton fill="clear" size="small" routerLink="/login">Log in</IonButton>
          </div>
        </form>
      </IonContent>
      <IonFooter className='ion-padding ion-no-border'>
        <IonButton 
          shape="round" 
          size='default' 
          expand="block"
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Signup
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default SignupPage;
