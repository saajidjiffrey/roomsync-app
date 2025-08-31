import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
} from '@ionic/react';

interface PageHeaderProps {
  title: string;
  showMenu?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, showMenu = true }) => {
  return (
    <IonHeader>
      <IonToolbar>
        {showMenu && (
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
        )}
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default PageHeader;
