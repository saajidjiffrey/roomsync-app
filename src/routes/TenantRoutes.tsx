import React from 'react';
import { Route } from 'react-router-dom';
import { FindPropertyPage, PropertyRequestsPage, TenantPropertyDetailPage } from '../pages/tenant';

const TenantRoutes: React.FC = () => {
  return (
    <>
      <Route path="/tenant/find-property">
        <FindPropertyPage />
      </Route>      
      <Route path="/tenant/property-requests">
        <PropertyRequestsPage />
      </Route>
      <Route path="/tenant/property-details">
        <TenantPropertyDetailPage />
      </Route>
    </>
  );
};

export default TenantRoutes;
