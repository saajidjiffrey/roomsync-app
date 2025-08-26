import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import OwnerRoutes from './OwnerRoutes';
import TabRoutes from './TabRoutes';

const AppRoutes: React.FC = () => {
  return (
    <>
      <AuthRoutes />
      <OwnerRoutes />
      <TabRoutes />
      <Route exact path="/">
        <Redirect to="/tab1" />
      </Route>
    </>
  );
};

export default AppRoutes;
