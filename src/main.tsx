import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux'
import { store, persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import LoadingSpinner from './components/common/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Global error handlers to prevent page refreshes
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);