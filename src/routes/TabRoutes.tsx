import React from 'react';
import { Route } from 'react-router-dom';
import { OwnerPropertyListPage, OwnerAdsListPage, OwnerRequestListPage } from '../pages/owner';

const TabRoutes: React.FC = () => {
  return (
    <>
      <Route exact path="/tab1">
        <OwnerPropertyListPage />
      </Route>
      <Route exact path="/tab2">
        <OwnerAdsListPage />
      </Route>
      <Route path="/tab3">
        <OwnerRequestListPage />
      </Route>
    </>
  );
};

export default TabRoutes;
