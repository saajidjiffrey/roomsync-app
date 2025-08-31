import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { initializeAuth } from './store/slices/authSlice';
import { useAuth } from './hooks/useAuth';
import OwnerLayout from './components/layouts/OwnerLayout';
import TenantLayout from './components/layouts/TenantLayout';
import AdminLayout from './components/layouts/AdminLayout';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
// import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import AppRoutes from './routes/AppRoutes';

setupIonicReact();

// Auth initializer component
const AuthInitializer: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return null;
};

// Main app component
const AppContent: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();

  const renderRoleBasedLayouts = () => {
    switch (userRole) {
      case 'owner':
        return <OwnerLayout />;
      case 'tenant':
        return <TenantLayout />;
      case 'admin':
        return <AdminLayout />;
      default:
        return <IonRouterOutlet><AppRoutes /></IonRouterOutlet>;
    }
  };

  return (
    <IonApp>
      <AuthInitializer />
      <IonReactRouter>
        {isAuthenticated ? (
          renderRoleBasedLayouts()
        ) : (
          <IonRouterOutlet>
            <AppRoutes />
          </IonRouterOutlet>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

// Root app component with Redux providers
const App: React.FC = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppContent />
    </PersistGate>
  </Provider>
);

export default App;
