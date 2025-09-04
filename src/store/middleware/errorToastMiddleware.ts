import { Middleware } from '@reduxjs/toolkit';
import toastService from '../../services/toast';

export const errorToastMiddleware: Middleware = () => (next) => (action) => {
  // Check if action was rejected
  if (action && typeof action === 'object' && 'type' in action && typeof action.type === 'string' && action.type.endsWith('/rejected')) {
    const typedAction = action as { type: string; payload?: string; error?: { message?: string } };
    const errorMessage = typedAction.payload || typedAction.error?.message || 'An error occurred';
    
    // Don't show toast for auth actions (handled separately in auth slice)
    const silentActions = [
      'auth/login/rejected',
      'auth/register/rejected',
      'auth/getProfile/rejected',
      'auth/updatePassword/rejected',
      'auth/logout/rejected',
    ];
    
    // Custom error messages for specific actions
    const customErrorMessages: Record<string, string> = {
      'property/fetchProperties/rejected': 'Failed to fetch properties',
      'property/fetchMyProperties/rejected': 'Failed to fetch your properties',
      'property/fetchPropertyById/rejected': 'Failed to fetch property details',
      'property/createProperty/rejected': 'Failed to create property',
      'property/updateProperty/rejected': 'Failed to update property',
      'property/deleteProperty/rejected': 'Failed to delete property',
    };
    
    if (!silentActions.includes(typedAction.type)) {
      // Prioritize the actual error message from the backend over custom messages
      const message = typedAction.payload || customErrorMessages[typedAction.type] || errorMessage;
      toastService.error(message);
    }
  }
  
  return next(action);
};
