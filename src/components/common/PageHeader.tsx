import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonBackButton,
} from '@ionic/react';
import { caretBack } from 'ionicons/icons';

interface PageHeaderProps {
  title: string;
  showMenu?: boolean;
  showBack?: boolean;
  defaultHref?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, showMenu = true, showBack = false, defaultHref = '/' }) => {
  return (
    <IonHeader>
      <IonToolbar>
        {showMenu && (
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
        )}
        {showBack && (
          <IonButtons slot="start">
            <IonBackButton defaultHref={defaultHref}></IonBackButton>
          </IonButtons>
        )}
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default PageHeader;
