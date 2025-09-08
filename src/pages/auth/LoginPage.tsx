import { IonButton, IonContent, IonFooter, IonHeader, IonInput, IonItem, IonList, IonPage, IonTitle, IonToolbar, IonText, IonInputPasswordToggle, IonActionSheet } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useHistory } from 'react-router';
import toastService from '../../services/toast';
import { showLoadingSpinner, stopLoadingSpinner } from '../../utils/spinnerUtils';
import './LoginPage.css';
import PageHeader from '../../components/common/PageHeader';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, isLoading, error, clearError, isAuthenticated, user } = useAuth();
  const [showForgot, setShowForgot] = useState(false);
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

    showLoadingSpinner('Logging you in...');
    
    try {
      await login({ email, password });
      // Success toast will be shown in the Redux slice
      // Redirect will be handled by useEffect above
    } catch (error) {
      // Error is handled by the Redux slice and shown via useEffect above
      // Don't throw the error to prevent page refresh
      console.error('Login error:', error);
    } finally {
      stopLoadingSpinner();
    }
  };

  return (
    <IonPage>
      <PageHeader title="Login" showMenu={false} showBack={true} defaultHref='/landing'/>
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
                labelPlacement="stacked" 
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
                labelPlacement="stacked" 
                mode='md' 
                type='password' 
                label="Password" 
                placeholder="Enter password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value || '')}
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
          </IonList>
          <div className='ion-text-center d-flex flex-row justify-content-center align-items-center'>
            <IonText>
              <small>Don't have an account? </small>
            </IonText>
            <IonButton fill="clear" size="small" routerLink="/signup">Sign up</IonButton>
          </div>
          {/* <div className='ion-text-center'>
            <IonButton fill="clear" size="small" onClick={() => setShowForgot(true)}>Forgot password?</IonButton>
          </div> */}
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
          Login
        </IonButton>
      </IonFooter>
      <IonActionSheet
        isOpen={showForgot}
        onDidDismiss={() => setShowForgot(false)}
        header="Forgot password"
        buttons={[
          {
            text: 'Send reset link',
            role: 'confirm',
            handler: async () => {
              // Placeholder: wire backend flow if available later
              toastService.success('If this were enabled, a reset link would be sent.');
            },
          },
          { text: 'Cancel', role: 'cancel' },
        ]}
      />
    </IonPage>
  );
};

export default LoginPage;
