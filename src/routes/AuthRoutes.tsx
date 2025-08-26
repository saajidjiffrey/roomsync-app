import React from 'react';
import { Route } from 'react-router-dom';
import { SignupPage, LandingPage, LoginPage } from '../pages/auth';

const AuthRoutes: React.FC = () => {
  return (
    <>
      <Route path="/landing">
        <LandingPage />
      </Route>
      <Route path="/signup">
        <SignupPage />
      </Route>      
      <Route path="/login">
        <LoginPage />
      </Route>
    </>
  );
};

export default AuthRoutes;
