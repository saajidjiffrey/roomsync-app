import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { propertyAPI } from '../../api/propertyApi';
import { ApiError } from '../../types/api';
import { Property, PropertyState, CreatePropertyRequest } from '../../types/property';
import toastService from '../../services/toast';

// Helper function to extract error message from API error
const extractErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const apiError = error as ApiError;
  
  // Extract specific field error message if available
  if (apiError.response?.data?.errors && apiError.response.data.errors.length > 0) {
    // Get the first field error message
    return apiError.response.data.errors[0].message;
  } else if (apiError.response?.data?.message) {
    // Fallback to general message
    return apiError.response.data.message;
  } else if (apiError.message) {
    // Fallback to error message
    return apiError.message;
  }
  
  return fallbackMessage;
};

// Async thunks
export const fetchMyProperties = createAsyncThunk(
  'property/fetchMyProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await propertyAPI.getMyProperties();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch properties');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch properties'));
    }
  }
);

export const createProperty = createAsyncThunk(
  'property/createProperty',
  async (propertyData: CreatePropertyRequest, { rejectWithValue }) => {
    try {
      const response = await propertyAPI.createProperty(propertyData);
      if (response.success && response.data) {
        // Show the actual response message if available, otherwise fallback to generic message
        toastService.success(response.message || 'Property created successfully');
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to create property');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to create property'));
    }
  }
);

export const leaveProperty = createAsyncThunk(
  'property/leaveProperty',
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await propertyAPI.leaveProperty(propertyId);
      if (response.success) {
        toastService.success(response.message || 'Successfully left the property');
        return propertyId;
      } else {
        return rejectWithValue(response.message || 'Failed to leave property');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to leave property'));
    }
  }
);

// Initial state
const initialState: PropertyState = {
  properties: [],
  currentProperty: null,
  isLoading: false,
  error: null,
};

// Property slice
const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProperties: (state) => {
      state.properties = [];
      state.currentProperty = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my properties (owner)
      .addCase(fetchMyProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProperties.fulfilled, (state, action: PayloadAction<Property[]>) => {
        state.isLoading = false;
        state.properties = action.payload;
        state.error = null;
      })
      .addCase(fetchMyProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Create property (owner)
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action: PayloadAction<Property>) => {
        state.isLoading = false;
        state.properties.unshift(action.payload);
        state.error = null;
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Leave property (tenant)
      .addCase(leaveProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(leaveProperty.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        // Remove the property from the list if it exists
        state.properties = state.properties.filter(property => property.id !== action.payload);
        state.error = null;
      })
      .addCase(leaveProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      });
  },
});

export const { clearError, clearProperties } = propertySlice.actions;
export default propertySlice.reducer;
