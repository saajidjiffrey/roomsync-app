import React from 'react';
import { Route } from 'react-router-dom';
import { OwnerPropertyListPage, OwnerAdsListPage, OwnerRequestListPage } from '../pages/owner';
import PropertyDetailPage from '../pages/property/PropertyDetail.page';

const OwnerRoutes: React.FC = () => {
  return (
    <>
      <Route path="/owner/property">
        <OwnerPropertyListPage />
      </Route>      
      <Route path="/owner/ads">
        <OwnerAdsListPage />
      </Route>      
      <Route path="/owner/requests">
        <OwnerRequestListPage />
      </Route>      
      <Route path="/owner/property-details">
        <PropertyDetailPage />
      </Route>
    </>
  );
};

export default OwnerRoutes;
