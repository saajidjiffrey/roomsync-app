import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonInput,
  IonText,
  IonFooter,
  IonButton,
  IonNote,
  IonImg,
  IonModal,
  IonInputPasswordToggle,
  IonButtons
} from '@ionic/react';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../store/hooks';
import { updateProfile, updatePassword, getProfile } from '../../store/slices/authSlice';
import { pickImage, uploadImage } from '../../services/imageService';
import { cameraOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { useIonActionSheet, useIonToast, useIonLoading } from '@ionic/react';

interface FormErrors {
  full_name?: string;
  phone_no?: string;
  email?: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone_no: user?.phone_no || '',
    occupation: user?.occupation || '',
    email: user?.email || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdErrors, setPwdErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>({});
  const [presentActionSheet] = useIonActionSheet();
  const [presentToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();

  useEffect(() => {
    setFormData({
      full_name: user?.full_name || '',
      phone_no: user?.phone_no || '',
      occupation: user?.occupation || '',
      email: user?.email || '',
    });
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.phone_no.trim()) newErrors.phone_no = 'Phone number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    await dispatch(updateProfile({
      full_name: formData.full_name.trim(),
      phone_no: formData.phone_no.trim(),
      occupation: formData.occupation.trim() || undefined,
      email: formData.email,
    }));
  };

  const submitChangePassword = async () => {
    const errs: typeof pwdErrors = {};
    if (!pwdForm.currentPassword) errs.currentPassword = 'Current password is required';
    if (!pwdForm.newPassword) errs.newPassword = 'New password is required';
    if (pwdForm.newPassword && pwdForm.newPassword.length < 6) errs.newPassword = 'Minimum 6 characters';
    if (pwdForm.newPassword !== pwdForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setPwdErrors(errs);
    if (Object.keys(errs).length > 0) return;
    await dispatch(updatePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword }));
    await dispatch(getProfile());
    setShowChangePwd(false);
    setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <IonPage>
      <PageHeader title="Profile" showMenu={false} showBack={true} />
      <IonContent fullscreen>
        <div style={{ position: 'relative' }}>
          <IonImg
            src={user?.profile_url || "/images/user_placeholder.jpg"}
            alt="Profile cover"
            style={{ objectPosition: 'center' }}
          ></IonImg>
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
            onClick={() =>
              presentActionSheet({
                header: 'Select Image Source',
                buttons: [
                  {
                    text: 'Camera',
                    handler: async () => {
                      try {
                        // First pick the image (may open system UI). No loading yet
                        const { blob } = await pickImage('camera');
                        await presentLoading({ message: 'Uploading image...', spinner: 'crescent' });
                        const url = await uploadImage(blob, 'profiles');
                        await dispatch(updateProfile({ profile_url: url }));
                        await dispatch(getProfile());
                      } catch {
                        presentToast({ message: 'Failed to pick image', duration: 2000, color: 'danger' });
                      } finally {
                        await dismissLoading();
                      }
                    }
                  },
                  {
                    text: 'Gallery',
                    handler: async () => {
                      try {
                        const { blob } = await pickImage('gallery');
                        await presentLoading({ message: 'Uploading image...', spinner: 'crescent' });
                        const url = await uploadImage(blob, 'profiles');
                        await dispatch(updateProfile({ profile_url: url }));
                        await dispatch(getProfile());
                      } catch {
                        presentToast({ message: 'Failed to pick image', duration: 2000, color: 'danger' });
                      } finally {
                        await dismissLoading();
                      }
                    }
                  },
                  { text: 'Cancel', role: 'cancel' }
                ]
              })
            }
          >
            <IonIcon icon={cameraOutline} />
          </IonButton>
        </div>

        <div className='ion-align-self-start ion-padding-horizontal ion-margin-top'>
          <IonText>
            <h1>{user?.full_name || 'Your Profile'}</h1>
          </IonText>
          <IonNote color="medium">{user?.role?.toUpperCase()}</IonNote>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
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
          </IonList>
          <div className='ion-text-center'>
            <IonButton fill="clear" size="small" onClick={() => setShowChangePwd(true)}>Change password</IonButton>
          </div>
        </form>
      </IonContent>
      <IonFooter className='ion-padding ion-no-border'>
        <IonButton
          shape="round"
          size='default'
          expand="block"
          onClick={handleSave}
        >
          Save Changes
        </IonButton>
      </IonFooter>

      <IonModal isOpen={showChangePwd} onDidDismiss={() => setShowChangePwd(false)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton color="medium" onClick={() => setShowChangePwd(false)}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>Change Password</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={submitChangePassword} strong={true}>Update</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
          <IonList mode='ios' lines='inset' inset className='input-wrapper ion-padding-vertical'>
            <IonItem>
              <IonInput
                labelPlacement="stacked"
                mode='md'
                type='password'
                label="Current Password"
                placeholder="Enter current password"
                value={pwdForm.currentPassword}
                onIonInput={(e) => setPwdForm(p => ({ ...p, currentPassword: e.detail.value || '' }))}
                className={pwdErrors.currentPassword ? 'ion-invalid' : ''}
              >
                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
              </IonInput>
            </IonItem>
            {pwdErrors.currentPassword && (
              <IonText color="danger" className="ion-padding-start"><small>{pwdErrors.currentPassword}</small></IonText>
            )}
            <IonItem>
              <IonInput
                labelPlacement="stacked"
                mode='md'
                type='password'
                label="New Password"
                placeholder="Enter new password"
                value={pwdForm.newPassword}
                onIonInput={(e) => setPwdForm(p => ({ ...p, newPassword: e.detail.value || '' }))}
                className={pwdErrors.newPassword ? 'ion-invalid' : ''}
              >
                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
              </IonInput>
            </IonItem>
            {pwdErrors.newPassword && (
              <IonText color="danger" className="ion-padding-start"><small>{pwdErrors.newPassword}</small></IonText>
            )}
            <IonItem>
              <IonInput
                labelPlacement="stacked"
                mode='md'
                type='password'
                label="Confirm New Password"
                placeholder="Confirm new password"
                value={pwdForm.confirmPassword}
                onIonInput={(e) => setPwdForm(p => ({ ...p, confirmPassword: e.detail.value || '' }))}
                className={pwdErrors.confirmPassword ? 'ion-invalid' : ''}
              >
                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
              </IonInput>
            </IonItem>
            {pwdErrors.confirmPassword && (
              <IonText color="danger" className="ion-padding-start"><small>{pwdErrors.confirmPassword}</small></IonText>
            )}
          </IonList>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default ProfilePage;


