import { IonButton, IonContent, IonFooter, IonHeader, IonInput, IonItem, IonList, IonPage, IonTitle, IonToolbar, IonText, IonSpinner } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useHistory } from 'react-router';
import toastService from '../../services/toast';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, isLoading, error, clearError, isAuthenticated, user } = useAuth();
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

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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

    try {
      await login({ email, password });
      // Success toast will be shown in the Redux slice
      // Redirect will be handled by useEffect above
    } catch (error) {
      // Error is handled by the Redux slice and shown via useEffect above
      // Don't throw the error to prevent page refresh
      console.error('Login error:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <form onSubmit={handleSubmit}>
          <IonList mode='ios' lines='inset' inset className='input-wrapper ion-padding-vertical'>
            <IonItem>
              <IonInput 
                labelPlacement="floating" 
                mode='md' 
                type='email' 
                label="Email" 
                placeholder="Enter email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value || '')}
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
                labelPlacement="floating" 
                mode='md' 
                type='password' 
                label="Password" 
                placeholder="Enter password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value || '')}
                className={errors.password ? 'ion-invalid' : ''}
              />
            </IonItem>
            {errors.password && (
              <IonText color="danger" className="ion-padding-start">
                <small>{errors.password}</small>
              </IonText>
            )}
          </IonList>
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
          {isLoading ? (
            <>
              <IonSpinner name="crescent" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default LoginPage;
