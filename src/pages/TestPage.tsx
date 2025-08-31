import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
} from '@ionic/react';
import { useAuth } from '../hooks/useAuth';
import toastService from '../services/toast';
import { authAPI } from '../services/api';

const TestPage: React.FC = () => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = async () => {
    try {
      await login({ email, password });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const testToast = async (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        await toastService.success('This is a success message!');
        break;
      case 'error':
        await toastService.error('This is an error message!');
        break;
      case 'warning':
        await toastService.warning('This is a warning message!');
        break;
      case 'info':
        await toastService.info('This is an info message!');
        break;
    }
  };

  const testAPI = async () => {
    try {
      const response = await authAPI.getProfile();
      await toastService.success(`API call successful! User: ${response.data?.full_name}`);
    } catch (error) {
      await toastService.showApiError(error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Test Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Authentication Status</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              {user && (
                <p><strong>User:</strong> {user.full_name} ({user.role})</p>
              )}
            </IonText>
          </IonCardContent>
        </IonCard>

        {!isAuthenticated ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Login Test</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonInput={(e) => setEmail(e.detail.value || '')}
                    placeholder="Enter email"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Password</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value || '')}
                    placeholder="Enter password"
                  />
                </IonItem>
              </IonList>
              <IonButton expand="block" onClick={handleLogin} disabled={isLoading}>
                Login
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Authenticated Actions</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonButton expand="block" onClick={testAPI} color="primary">
                Test API Call
              </IonButton>
              <IonButton expand="block" onClick={handleLogout} color="danger">
                Logout
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Toast Notifications Test</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton expand="block" onClick={() => testToast('success')} color="success">
              Success Toast
            </IonButton>
            <IonButton expand="block" onClick={() => testToast('error')} color="danger">
              Error Toast
            </IonButton>
            <IonButton expand="block" onClick={() => testToast('warning')} color="warning">
              Warning Toast
            </IonButton>
            <IonButton expand="block" onClick={() => testToast('info')} color="primary">
              Info Toast
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default TestPage;
