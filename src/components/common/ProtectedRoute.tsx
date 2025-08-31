import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { IonSpinner, IonContent } from '@ionic/react';

interface ProtectedRouteProps extends RouteProps {
  requiredRole?: string | string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  children,
  ...routeProps
}) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <IonContent className="ion-padding">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <IonSpinner name="crescent" />
        </div>
      </IonContent>
    );
  }

  // Redirect to landing page if not authenticated
  if (!isAuthenticated) {
    return <Redirect to="/landing" />;
  }

  // Check role-based access
  if (requiredRole) {
    const hasAccess = Array.isArray(requiredRole)
      ? requiredRole.includes(userRole || '')
      : userRole === requiredRole;

    if (!hasAccess) {
      return <Redirect to="/unauthorized" />;
    }
  }

  return <Route {...routeProps}>{children}</Route>;
};

export default ProtectedRoute;
