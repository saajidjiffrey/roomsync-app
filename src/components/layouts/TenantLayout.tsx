import React from 'react';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, IonRouterOutlet } from '@ionic/react';
import { document, documentText, home, notifications } from 'ionicons/icons';
import { Route, Redirect } from 'react-router-dom';
import { 
  FindPropertyPage, 
  PropertyRequestsPage, 
  TenantPropertyDetailPage, 
  SelectGroupPage, 
  GroupDetailPage, 
  TenantHome, 
  TenantExpenses, 
  ExpenseDetailPage,
  Tasks,
  Notifications
} from '../../pages/tenant';
import AppMenu from '../common/AppMenu';

const TenantLayout: React.FC = () => {

  return (
    <>
      <AppMenu menuId="tenant-content" />
      <IonTabs>
        <IonRouterOutlet id="tenant-content">
          {/* Main tab routes */}
          <Route exact path="/tenant/home" component={TenantHome} />
          <Route exact path="/tenant/expenses" component={TenantExpenses} />
          <Route exact path="/tenant/tasks" component={Tasks} />
          <Route exact path="/tenant/notifications" component={Notifications} />
          
          {/* Additional tenant routes */}
          <Route path="/tenant/property-details/:id" component={TenantPropertyDetailPage} />
          <Route path="/tenant/group-detail/:groupId" component={GroupDetailPage} />
          <Route path="/tenant/expenses-detail/:expenseId" component={ExpenseDetailPage} />
          <Route path="/tenant/find-property" component={FindPropertyPage} />
          <Route path="/tenant/select-group" component={SelectGroupPage} />
          <Route path="/tenant/my-requests" component={PropertyRequestsPage} />
          
          {/* Default redirect */}
          <Route exact path="/tenant">
            <Redirect to="/tenant/home" />
          </Route>
        </IonRouterOutlet>
        
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/tenant/home">
            <IonIcon aria-hidden="true" icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="expenses" href="/tenant/expenses">
            <IonIcon aria-hidden="true" icon={document} />
            <IonLabel>Expenses</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tasks" href="/tenant/tasks">
            <IonIcon aria-hidden="true" icon={documentText} />
            <IonLabel>Tasks</IonLabel>
          </IonTabButton>
          <IonTabButton tab="notifications" href="/tenant/notifications">
            <IonIcon aria-hidden="true" icon={notifications} />
            <IonLabel>Notifications</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </>
  );
};

export default TenantLayout;
