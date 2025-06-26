import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import Tab1 from './../pages/Tab1';
import Tab2 from './../pages/Tab2';
import Tab3 from './../pages/Tab3';
import { SignupPage, LandingPage, LoginPage } from '../pages/auth';
import OwnerPropertyPage from '../pages/property/OwnerPropertyPage';

const AppRoutes: React.FC = () => {
  return (
    <>
      <Route exact path="/tab1">
        <Tab1 />
      </Route>
      <Route exact path="/tab2">
        <Tab2 />
      </Route>
      <Route path="/tab3">
        <Tab3 />
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
        <OwnerPropertyPage />
      </Route>      
      <Route exact path="/">
        <Redirect to="/tab1" />
      </Route>
    </>
  );
};

export default AppRoutes;
