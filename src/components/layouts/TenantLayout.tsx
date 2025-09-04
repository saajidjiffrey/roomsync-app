import React from 'react';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, IonRouterOutlet } from '@ionic/react';
import { search, document } from 'ionicons/icons';
import { Route, Redirect } from 'react-router-dom';
import { 
  FindPropertyPage, 
  PropertyRequestsPage, 
  TenantPropertyDetailPage, 
  SelectGroupPage, 
  GroupDetailPage, 
  TenantHome, 
  TenantExpenses, 
  ExpenseDetailPage 
} from '../../pages/tenant';
import TestRoute from '../../pages/tenant/TestRoute';

const TenantLayout: React.FC = () => {
  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          {/* Tab routes */}
          <Route exact path="/tenant/find-property" component={FindPropertyPage} />
          <Route exact path="/tenant/my-requests" component={PropertyRequestsPage} />
          
          {/* Additional tenant routes */}
          <Route path="/tenant/property-details/:id" component={TenantPropertyDetailPage} />
          <Route path="/tenant/select-group" component={SelectGroupPage} />
          <Route path="/tenant/group-detail" component={GroupDetailPage} />
          <Route path="/tenant/home" component={TenantHome} />
          <Route path="/tenant/expenses" component={TenantExpenses} />
          <Route path="/tenant/expenses-detail" component={ExpenseDetailPage} />
          <Route path="/tenant/test" component={TestRoute} />
          
          {/* Default redirect */}
          <Route exact path="/tenant">
            <Redirect to="/tenant/find-property" />
          </Route>
        </IonRouterOutlet>
        
        <IonTabBar slot="bottom">
          <IonTabButton tab="find-property" href="/tenant/find-property">
            <IonIcon aria-hidden="true" icon={search} />
            <IonLabel>Find Property</IonLabel>
          </IonTabButton>
          
          <IonTabButton tab="my-requests" href="/tenant/my-requests">
            <IonIcon aria-hidden="true" icon={document} />
            <IonLabel>My Requests</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </>
  );
};

export default TenantLayout;
