import React from 'react';
import { Route } from 'react-router-dom';
import { LandingPage, LoginPage, SignupPage } from '../pages/auth';
import TestPage from '../pages/TestPage';

const AuthRoutes: React.FC = () => {
  return (
    <>
      <Route path="/landing" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/test" component={TestPage} />
    </>
  );
};

export default AuthRoutes;
