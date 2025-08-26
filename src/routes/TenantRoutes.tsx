import React from 'react';
import { Route } from 'react-router-dom';
import { FindPropertyPage, PropertyRequestsPage, TenantPropertyDetailPage, SelectGroupPage } from '../pages/tenant';

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

      {/* Group Routes */}
      <Route path="/tenant/select-group">
        <SelectGroupPage />
      </Route>
      <Route path="/tenant/group-details">
        {/* <GroupDetailPage /> */}
      </Route>
    </>
  );
};

export default TenantRoutes;
