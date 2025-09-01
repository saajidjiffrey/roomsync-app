import React, { Component, ErrorInfo, ReactNode } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonText } from '@ionic/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Something went wrong</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <IonText color="danger">
                <h2>Oops! Something went wrong</h2>
              </IonText>
              <p>We're sorry, but something unexpected happened. Please try again.</p>
              
              <div style={{ marginTop: '2rem' }}>
                <IonButton onClick={this.handleReset} color="primary">
                  Try Again
                </IonButton>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details style={{ marginTop: '2rem', textAlign: 'left' }}>
                  <summary>Error Details (Development)</summary>
                  <pre style={{ 
                    background: '#f5f5f5', 
                    padding: '1rem', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '12px'
                  }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </IonContent>
        </IonPage>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
