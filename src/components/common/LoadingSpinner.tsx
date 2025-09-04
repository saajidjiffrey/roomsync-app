import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  // Optional override props for local usage
  isVisible?: boolean;
  message?: string;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  isVisible: localIsVisible, 
  message: localMessage, 
  overlay = true 
}) => {
  const { isVisible: globalIsVisible, message: globalMessage } = useSelector(
    (state: RootState) => state.spinner
  );

  // Use local props if provided, otherwise use global state
  const isVisible = localIsVisible !== undefined ? localIsVisible : globalIsVisible;
  const message = localMessage || globalMessage || 'Loading...';

  if (!isVisible) return null;

  const spinnerContent = (
    <div className="d-flex flex-column align-items-center justify-content-center text-center">
      <div className="mb-3">
        <img 
          src="/logo-spinner.gif" 
          alt="Loading..." 
          className="img-fluid"
          style={{ width: '80px', height: '80px' }}
          onError={(e) => {
            // Fallback to CSS spinner if GIF fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) {
              fallback.classList.remove('d-none');
              fallback.classList.add('d-flex');
            }
          }}
        />
        <div 
          className="spinner-fallback d-none align-items-center justify-content-center"
          style={{ width: '80px', height: '80px' }}
        >
          <div 
            className="spinner-circle"
            style={{
              width: '60px',
              height: '60px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          ></div>
        </div>
      </div>
      {message && (
        <p className="text-white mb-0 fs-6 fw-medium">
          {message}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
           style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 9999 }}>
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;
