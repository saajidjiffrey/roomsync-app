import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { SignupPage, LandingPage, LoginPage } from '../pages/auth';
import { OwnerPropertyListPage, OwnerAdsListPage, OwnerRequestListPage } from '../pages/owner';
import PropertyDetailPage from '../pages/property/PropertyDetail.page';

const AppRoutes: React.FC = () => {
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
      <Route path="/landing">
        <LandingPage />
      </Route>
      <Route path="/signup">
        <SignupPage />
      </Route>      
      <Route path="/login">
        <LoginPage />
      </Route>      
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
      <Route exact path="/">
        <Redirect to="/tab1" />
      </Route>
    </>
  );
};

export default AppRoutes;
