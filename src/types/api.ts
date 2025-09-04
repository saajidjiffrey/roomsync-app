// General API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// API Error interface for error handling
export interface ApiError {
  response?: {
    data?: {
      success?: boolean;
      message?: string;
      errors?: Array<{
        field: string;
        message: string;
      }>;
    };
    status?: number;
  };
  message?: string;
}
