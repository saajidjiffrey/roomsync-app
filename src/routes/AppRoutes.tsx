import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { IonRouterOutlet } from '@ionic/react';

// Auth pages
import LandingPage from '../pages/auth/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';

// Test page
import TestPage from '../pages/TestPage';

// Unauthorized page
import UnauthorizedPage from '../pages/UnauthorizedPage';

// Layout components
import OwnerLayout from '../components/layouts/OwnerLayout';
import TenantLayout from '../components/layouts/TenantLayout';
import AdminLayout from '../components/layouts/AdminLayout';

// Protected Route component
import ProtectedRoute from '../components/common/ProtectedRoute';

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
    <IonRouterOutlet>
      <Switch>
        {/* Public routes - accessible to everyone */}
        <Route exact path="/landing" component={LandingPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/signup" component={SignupPage} />
        <Route exact path="/unauthorized" component={UnauthorizedPage} />
        
        {/* Test route - accessible to all authenticated users */}
        <ProtectedRoute exact path="/test">
          <TestPage />
        </ProtectedRoute>
        
        {/* Owner routes */}
        <ProtectedRoute path="/owner" requiredRole="owner">
          <OwnerLayout />
        </ProtectedRoute>
        
        {/* Tenant routes */}
        <ProtectedRoute path="/tenant" requiredRole="tenant">
          <TenantLayout />
        </ProtectedRoute>
        
        {/* Admin routes */}
        <ProtectedRoute path="/admin" requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
        
        {/* Default redirect */}
        <Route exact path="/">
          <Redirect to={getDefaultRedirect()} />
        </Route>
        
        {/* Catch all - redirect to default */}
        <Route path="*">
          <Redirect to={getDefaultRedirect()} />
        </Route>
      </Switch>
    </IonRouterOutlet>
  );
};

export default AppRoutes;
