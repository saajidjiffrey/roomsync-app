import { store } from '../store';
import { showSpinner, hideSpinner } from '../store/slices/spinnerSlice';

/**
 * Shows the global loading spinner
 * @param message - Optional message to display below the spinner
 */
export const showLoadingSpinner = (message?: string): void => {
  store.dispatch(showSpinner(message));
};

/**
 * Hides the global loading spinner
 */
export const stopLoadingSpinner = (): void => {
  store.dispatch(hideSpinner());
};

/**
 * Shows the spinner for a specific duration
 * @param duration - Duration in milliseconds
 * @param message - Optional message to display
 */
export const showTemporarySpinner = (duration: number, message?: string): void => {
  showLoadingSpinner(message);
  setTimeout(() => {
    stopLoadingSpinner();
  }, duration);
};

/**
 * Shows the spinner while executing an async function
 * @param asyncFunction - The async function to execute
 * @param message - Optional message to display
 * @returns Promise with the result of the async function
 */
export const withSpinner = async <T>(
  asyncFunction: () => Promise<T>,
  message?: string
): Promise<T> => {
  try {
    showLoadingSpinner(message);
    const result = await asyncFunction();
    return result;
  } finally {
    stopLoadingSpinner();
  }
};
