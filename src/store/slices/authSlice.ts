import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI, User, LoginRequest, RegisterRequest, PasswordUpdateRequest } from '../../services/api';
import toastService from '../../services/toast';

// Error interface
interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: string[];
    };
    status?: number;
  };
  message?: string;
}

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

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
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      let errorMessage = 'Login failed';
      
      // Provide more specific error messages
      if (apiError.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (apiError.response?.status === 422) {
        errorMessage = apiError.response.data?.message || 'Invalid input data';
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
        return rejectWithValue(response.message || 'Registration failed');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || apiError.message || 'Registration failed');
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
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Password update failed');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || apiError.message || 'Password update failed');
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
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
        } catch {
          // Invalid user data, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
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
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
      });
  },
});

// Export actions
export const { initializeAuth, clearError, updateUser } = authSlice.actions;

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;

// Export reducer
export default authSlice.reducer;
