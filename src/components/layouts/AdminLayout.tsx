import React from 'react';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, IonRouterOutlet } from '@ionic/react';
import { home, people, settings } from 'ionicons/icons';
import { Route, Redirect } from 'react-router-dom';

// Placeholder components - you can replace these with actual admin pages
const AdminDashboard = () => <div>Admin Dashboard</div>;
const UserManagement = () => <div>User Management</div>;
const SystemSettings = () => <div>System Settings</div>;

const AdminLayout: React.FC = () => {
  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/admin/dashboard" component={AdminDashboard} />
          <Route exact path="/admin/users" component={UserManagement} />
          <Route exact path="/admin/settings" component={SystemSettings} />
          <Route exact path="/admin">
            <Redirect to="/admin/dashboard" />
          </Route>
        </IonRouterOutlet>
        
        <IonTabBar slot="bottom">
          <IonTabButton tab="dashboard" href="/admin/dashboard">
            <IonIcon aria-hidden="true" icon={home} />
            <IonLabel>Dashboard</IonLabel>
          </IonTabButton>
          
          <IonTabButton tab="users" href="/admin/users">
            <IonIcon aria-hidden="true" icon={people} />
            <IonLabel>Users</IonLabel>
          </IonTabButton>
          
          <IonTabButton tab="settings" href="/admin/settings">
            <IonIcon aria-hidden="true" icon={settings} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </>
  );
};

export default AdminLayout;
