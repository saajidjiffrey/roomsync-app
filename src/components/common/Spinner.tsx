import { IonSpinner } from "@ionic/react";

const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    backgroundColor: '#121212',
    zIndex: 1000, 
  }}>
    <IonSpinner name="crescent" />
    <p style={{ marginTop: '1rem' }}>Loading your data...</p>
  </div>
)

export default LoadingSpinner;