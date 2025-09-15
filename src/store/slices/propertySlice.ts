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

export const fetchPropertyById = createAsyncThunk(
  'property/fetchPropertyById',
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await propertyAPI.getPropertyById(propertyId);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch property');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch property'));
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

export const updateProperty = createAsyncThunk(
  'property/updateProperty',
  async ({ id, data }: { id: number; data: Partial<CreatePropertyRequest> }, { rejectWithValue }) => {
    try {
      const response = await propertyAPI.updateProperty(id, data);
      if (response.success && response.data) {
        toastService.success(response.message || 'Property updated successfully');
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to update property');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to update property'));
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'property/deleteProperty',
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await propertyAPI.deleteProperty(propertyId);
      if (response.success) {
        toastService.success(response.message || 'Property deleted successfully');
        return propertyId;
      } else {
        return rejectWithValue(response.message || 'Failed to delete property');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to delete property'));
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
      // Fetch property by ID
      .addCase(fetchPropertyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action: PayloadAction<Property>) => {
        state.isLoading = false;
        state.currentProperty = action.payload;
        state.error = null;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
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
      })
      // Update property
      .addCase(updateProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action: PayloadAction<Property>) => {
        state.isLoading = false;
        const index = state.properties.findIndex(property => property.id === action.payload.id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Delete property
      .addCase(deleteProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.properties = state.properties.filter(property => property.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      });
  },
});

export const { clearError, clearProperties } = propertySlice.actions;
export default propertySlice.reducer;
