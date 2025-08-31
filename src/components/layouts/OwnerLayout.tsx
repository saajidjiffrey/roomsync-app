import React from 'react';
import { 
  IonIcon, 
  IonLabel, 
  IonTabBar, 
  IonTabButton, 
  IonTabs, 
  IonRouterOutlet,
} from '@ionic/react';
import { home, newspaper, people } from 'ionicons/icons';
import { Route, Redirect } from 'react-router-dom';
import { OwnerPropertyListPage, OwnerAdsListPage, OwnerRequestListPage } from '../../pages/owner';
import PropertyDetailPage from '../../pages/property/PropertyDetail.page';
import AppMenu from '../common/AppMenu';

const OwnerLayout: React.FC = () => {
  return (
    <>
      <AppMenu menuId="owner-menu" />
      <IonTabs id="owner-menu">
        <IonRouterOutlet>
          {/* Tab routes */}
          <Route exact path="/owner/my-properties" component={OwnerPropertyListPage} />
          <Route exact path="/owner/my-ads" component={OwnerAdsListPage} />
          <Route exact path="/owner/join-requests" component={OwnerRequestListPage} />
          
          {/* Additional owner routes */}
          <Route path="/owner/property-details" component={PropertyDetailPage} />
          
          {/* Default redirect */}
          <Route exact path="/owner">
            <Redirect to="/owner/my-properties" />
          </Route>
        </IonRouterOutlet>
        
        <IonTabBar slot="bottom">
          <IonTabButton tab="my-properties" href="/owner/my-properties">
            <IonIcon aria-hidden="true" icon={home} />
            <IonLabel>My Properties</IonLabel>
          </IonTabButton>
          
          <IonTabButton tab="my-ads" href="/owner/my-ads">
            <IonIcon aria-hidden="true" icon={newspaper} />
            <IonLabel>My Ads</IonLabel>
          </IonTabButton>
          
          <IonTabButton tab="join-requests" href="/owner/join-requests">
            <IonIcon aria-hidden="true" icon={people} />
            <IonLabel>Join Requests</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </>
  );
};

export default OwnerLayout;
