import { toastController } from '@ionic/core';
import { checkmarkCircle, closeCircle, informationCircle, refreshOutline, warningOutline } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';

export interface ToastOptions {
  message: string;
  duration?: number;
  position?: 'top' | 'bottom' | 'middle';
  color?: 'success' | 'danger' | 'warning' | 'primary' | 'secondary' | 'tertiary' | 'medium' | 'light' | 'dark';
  icon?: string;
  buttons?: Array<{
    text: string;
    role?: 'cancel' | 'destructive';
    handler?: () => void;
  }>;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: string[];
    };
  };
  message?: string;
}

interface ApiResponse {
  message?: string;
}

class ToastService {
  private defaultOptions: Partial<ToastOptions> = {
    duration: 3000,
    position: 'top',
  };

  /**
   * Show a toast message
   */
  async show(options: ToastOptions): Promise<void> {
    // On native, also attempt Capacitor Toast plugin as a backup to ensure visibility
    if (Capacitor.isNativePlatform()) {
      const capAny = Capacitor as unknown as { Plugins?: Record<string, unknown> };
      const plugins = capAny.Plugins as Record<string, { show?: (opts: { text: string; duration?: 'short' | 'long' }) => Promise<void> }> | undefined;
      if (plugins?.Toast?.show) {
        try {
          // Fire-and-forget native toast; still attempt Ionic overlay for styling
          plugins.Toast.show({
            text: options.message,
            duration: (options.duration && options.duration >= 3500) ? 'long' : 'short',
          });
        } catch {
          // ignore
        }
      }
    }
    // Use Ionic-styled toast (supports color, icon, position)
    try {
      // Slight defer can help overlay z-index settling on device
      await new Promise((r) => requestAnimationFrame(() => r(undefined)));
      const toast = await toastController.create({
        ...this.defaultOptions,
        ...options,
      });
      await toast.present();
    } catch {
      // Last resort fallback so users still see feedback
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(options.message);
      } else {
        /* no-op */
      }
    }
  }

  /**
   * Show a success toast
   */
  async success(message: string, options?: Partial<ToastOptions>): Promise<void> {
    await this.show({
      message,
      color: 'success',
      icon: checkmarkCircle,
      ...options,
    });
  }

  /**
   * Show an error toast
   */
  async error(message: string, options?: Partial<ToastOptions>): Promise<void> {
    await this.show({
      message,
      color: 'danger',
      icon: closeCircle,
      duration: 5000, // Longer duration for errors
      ...options,
    });
  }

  /**
   * Show a warning toast
   */
  async warning(message: string, options?: Partial<ToastOptions>): Promise<void> {
    await this.show({
      message,
      color: 'warning',
      icon: warningOutline,
      ...options,
    });
  }

  /**
   * Show an info toast
   */
  async info(message: string, options?: Partial<ToastOptions>): Promise<void> {
    await this.show({
      message,
      color: 'primary',
      icon: informationCircle,
      ...options,
    });
  }

  /**
   * Show a loading toast
   */
  async loading(message: string = 'Loading...', options?: Partial<ToastOptions>): Promise<HTMLIonToastElement> {
    const toast = await toastController.create({
      message,
      color: 'primary',
      icon: refreshOutline,
      duration: 0, // No auto-dismiss
      ...this.defaultOptions,
      ...options,
    });

    await toast.present();
    return toast;
  }

  /**
   * Dismiss all toasts
   */
  async dismiss(): Promise<void> {
    await toastController.dismiss();
  }

  /**
   * Show API error toast
   */
  async showApiError(error: ApiError): Promise<void> {
    let message = 'An error occurred. Please try again.';

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      message = error.response.data.errors.join(', ');
    } else if (error.message) {
      message = error.message;
    }

    await this.error(message);
  }

  /**
   * Show API success toast
   */
  async showApiSuccess(response: ApiResponse): Promise<void> {
    const message = response?.message || 'Operation completed successfully.';
    await this.success(message);
  }
}

// Create singleton instance
const toastService = new ToastService();

export default toastService;
