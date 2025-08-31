import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthRoutes from './AuthRoutes';
import LandingPage from '../pages/auth/LandingPage';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return null;
  }

  const getDefaultRedirect = () => {
    if (!isAuthenticated) return '/landing';
    
    switch (userRole) {
      case 'owner':
        return '/owner/my-properties';
      case 'tenant':
        return '/tenant/find-property';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/landing';
    }
  };

  return (
    <>
      {/* Public routes - accessible to everyone */}
      <Route exact path="/landing" component={LandingPage} />
      <AuthRoutes />
      
      {/* Default redirect */}
      <Route exact path="/">
        <Redirect to={getDefaultRedirect()} />
      </Route>
    </>
  );
};

export default AppRoutes;
