import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../api/authApi';
import { ApiError } from '../../types/api';
import { User, LoginRequest, RegisterRequest, PasswordUpdateRequest, AuthState } from '../../types/user';
import toastService from '../../services/toast';

// Helper to extract detailed API error messages (including field errors)
const extractErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const apiError = error as ApiError;
  if (apiError.response?.data?.errors && Array.isArray(apiError.response.data.errors) && apiError.response.data.errors.length > 0) {
    const fieldErrors = apiError.response.data.errors.map((err: { message?: string }) => err.message).filter(Boolean).join(', ');
    return fieldErrors || (apiError.response?.data?.message || fallbackMessage);
  }
  return apiError.response?.data?.message || apiError.message || fallbackMessage;
};


// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.success && response.data) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      } else {
        // Handle validation errors or other API errors
        let errorMessage = response.message || 'Login failed';
        
        // If there are specific field errors, format them nicely
        if (response.errors && Array.isArray(response.errors)) {
          const fieldErrors = response.errors.map((err) => err.message).join(', ');
          errorMessage = fieldErrors || errorMessage;
        }
        
        return rejectWithValue(errorMessage);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      let errorMessage = 'Login failed';
      
      // Provide more specific error messages
      if (apiError.response?.status === 400) {
        // Handle validation errors from 400 response
        if (apiError.response.data?.errors && Array.isArray(apiError.response.data.errors)) {
          const fieldErrors = apiError.response.data.errors.map((err) => err.message).join(', ');
          errorMessage = fieldErrors;
        } else {
          errorMessage = apiError.response.data?.message || 'Invalid input data';
        }
      } else if (apiError.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (apiError.response?.status === 422) {
        // Handle validation errors from response
        if (apiError.response.data?.errors && Array.isArray(apiError.response.data.errors)) {
          const fieldErrors = apiError.response.data.errors.map((err) => err.message).join(', ');
          errorMessage = fieldErrors;
        } else {
          errorMessage = apiError.response.data?.message || 'Invalid input data';
        }
      } else if (apiError.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      if (response.success && response.data) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      } else {
        // Handle validation errors or other API errors
        let errorMessage = response.message || 'Registration failed';
        
        // If there are specific field errors, format them nicely
        if (response.errors && Array.isArray(response.errors)) {
          const fieldErrors = response.errors.map((err) => err.message).join(', ');
          errorMessage = fieldErrors || errorMessage;
        }
        
        return rejectWithValue(errorMessage);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      let errorMessage = 'Registration failed';
      
      // Provide more specific error messages
      if (apiError.response?.status === 400) {
        // Handle validation errors from 400 response
        if (apiError.response.data?.errors && Array.isArray(apiError.response.data.errors)) {
          const fieldErrors = apiError.response.data.errors.map((err) => err.message).join(', ');
          errorMessage = fieldErrors;
        } else {
          errorMessage = apiError.response.data?.message || 'Invalid input data';
        }
      } else if (apiError.response?.status === 409) {
        errorMessage = 'Email already exists. Please use a different email.';
      } else if (apiError.response?.status === 422) {
        // Handle validation errors from response
        if (apiError.response.data?.errors && Array.isArray(apiError.response.data.errors)) {
          const fieldErrors = apiError.response.data.errors.map((err) => err.message).join(', ');
          errorMessage = fieldErrors;
        } else {
          errorMessage = apiError.response.data?.message || 'Invalid input data';
        }
      } else if (apiError.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to get profile');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || apiError.message || 'Failed to get profile');
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData: PasswordUpdateRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.updatePassword(passwordData);
      if (response.success && response.data) {
        toastService.success('Password updated successfully');
        return response.data;
      } else {
        const message = response.errors && Array.isArray(response.errors) && response.errors.length > 0
          ? response.errors.map((e: { message?: string }) => e.message).filter(Boolean).join(', ')
          : (response.message || 'Password update failed');
        return rejectWithValue(message);
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Password update failed'));
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      if (response.success && response.data) {
        toastService.success('Profile updated successfully');
        return response.data;
      } else {
        const message = response.errors && Array.isArray(response.errors) && response.errors.length > 0
          ? response.errors.map((e: { message?: string }) => e.message).filter(Boolean).join(', ')
          : (response.message || 'Profile update failed');
        return rejectWithValue(message);
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Profile update failed'));
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error: unknown) {
      // Even if logout API fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || apiError.message || 'Logout failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Initialize auth state from localStorage
    initializeAuth: (state) => {
      const token = localStorage.getItem('token');
      
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
        // Don't set user from localStorage - let getProfile fetch the latest data
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Update user profile
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    
    // Refresh user profile from server
    refreshUserProfile: () => {
      // This will be handled by the getProfile thunk
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        // Show success toast
        toastService.success('Login successful!');
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Show error toast
        toastService.error(action.payload as string);
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        // Show success toast
        toastService.success('Registration successful!');
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Show error toast
        toastService.error(action.payload as string);
      });

    // Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        // Update localStorage with the latest user data
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        
        // If it's a 401 error, clear the auth state (token expired/invalid)
        const errorMessage = action.payload as string;
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          state.token = null;
          state.isAuthenticated = false;
          state.user = null;
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } else {
          // Show error toast for other errors
          toastService.error(errorMessage);
        }
      });

    // Update Password
    builder
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Show error toast
        toastService.error(action.payload as string);
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        // Show error toast
        toastService.error('Logout failed');
      });
  },
});

// Export actions
export const { initializeAuth, clearError, updateUser, refreshUserProfile } = authSlice.actions;

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;

// Export reducer
export default authSlice.reducer;
