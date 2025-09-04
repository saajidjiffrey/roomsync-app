import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { propertyAPI } from '../../api/propertyApi';
import { ApiError } from '../../types/api';
import { CreatePropertyRequest, PropertyState } from '../../types/property';
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
export const createProperty = createAsyncThunk(
  'property/createProperty',
  async (data: CreatePropertyRequest, { rejectWithValue }) => {
    try {
      const response = await propertyAPI.createProperty(data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Create property failed'));
    }
  }
);

export const fetchProperties = createAsyncThunk(
  'property/fetchProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await propertyAPI.getAllProperties();
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Fetch properties failed'));
    }
  }
);

export const fetchMyProperties = createAsyncThunk(
  'property/fetchMyProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await propertyAPI.getMyProperties();
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Fetch my properties failed'));
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  'property/fetchPropertyById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await propertyAPI.getPropertyById(id);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Fetch property failed'));
    }
  }
);

export const updateProperty = createAsyncThunk(
  'property/updateProperty',
  async ({ id, data }: { id: number; data: Partial<CreatePropertyRequest> }, { rejectWithValue }) => {
    try {
      const response = await propertyAPI.updateProperty(id, data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Update property failed'));
    }
  }
);

export const deleteProperty = createAsyncThunk<number, number, { rejectValue: string }>(
  'property/deleteProperty',
  async (id: number, { rejectWithValue }) => {
    try {
      await propertyAPI.deleteProperty(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Delete property failed'));
    }
  }
);

// Property slice
const propertySlice = createSlice({
  name: 'property',
  initialState: {
    properties: [],
    currentProperty: null,
    isLoading: false,
    error: null,
  } as PropertyState,
  
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    },
    setCurrentProperty: (state, action) => {
      state.currentProperty = action.payload;
    }
  },
  
  extraReducers: (builder) => {
    // Create Property
    builder
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.properties.push(action.payload);
        }
        state.error = null;
        toastService.success('Property created successfully!');
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Error toast is handled automatically by middleware
        // toastService.error(action.payload as string || 'Failed to create property');
      });

    // Fetch Properties
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.properties = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch My Properties
    builder
      .addCase(fetchMyProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.properties = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchMyProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Property by ID
    builder
      .addCase(fetchPropertyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.currentProperty = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Property
    builder
      .addCase(updateProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.properties.findIndex(p => p.id === action.payload?.id);
          if (index !== -1) {
            state.properties[index] = action.payload;
          }
          if (state.currentProperty?.id === action.payload?.id) {
            state.currentProperty = action.payload;
          }
        }
        state.error = null;
        toastService.success('Property updated successfully!');
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Error toast is handled automatically by middleware
      });

    // Delete Property
    builder
      .addCase(deleteProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload;
        if (deletedId) {
          state.properties = state.properties.filter(p => p.id !== deletedId);
          if (state.currentProperty?.id === deletedId) {
            state.currentProperty = null;
          }
        }
        state.error = null;
        toastService.success('Property deleted successfully!');
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Error toast is handled automatically by middleware
      });
  },
});

// Export actions
export const { clearError, clearCurrentProperty, setCurrentProperty } = propertySlice.actions;

// Export selectors
export const selectPropertyState = (state: { property: PropertyState }) => state.property;
export const selectProperties = (state: { property: PropertyState }) => state.property.properties;
export const selectCurrentProperty = (state: { property: PropertyState }) => state.property.currentProperty;
export const selectPropertyLoading = (state: { property: PropertyState }) => state.property.isLoading;
export const selectPropertyError = (state: { property: PropertyState }) => state.property.error;

export default propertySlice.reducer;
