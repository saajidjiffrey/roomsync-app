import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import OwnerRoutes from './OwnerRoutes';
import TabRoutes from './TabRoutes';
import TenantRoutes from './TenantRoutes';

const AppRoutes: React.FC = () => {
  return (
    <>
      <AuthRoutes />
      <OwnerRoutes />
      <TenantRoutes />
      <TabRoutes />
      <Route exact path="/">
        <Redirect to="/tab1" />
      </Route>
    </>
  );
};

export default AppRoutes;
