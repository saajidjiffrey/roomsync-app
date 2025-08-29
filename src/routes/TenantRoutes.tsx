import React from 'react';
import { Route } from 'react-router-dom';
import { FindPropertyPage, PropertyRequestsPage, TenantPropertyDetailPage, SelectGroupPage, GroupDetailPage, TenantHome, TenantExpenses, ExpenseDetailPage } from '../pages/tenant';

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
      <Route path="/tenant/group-detail">
        <GroupDetailPage />
      </Route>
      <Route path="/tenant/home">
        <TenantHome />
      </Route>
      <Route path="/tenant/expenses">
        <TenantExpenses />
      </Route>
      <Route path="/tenant/expenses-detail">
        <ExpenseDetailPage />
      </Route>
    </>
  );
};

export default TenantRoutes;
