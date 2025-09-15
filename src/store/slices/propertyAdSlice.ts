import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { propertyAdApi } from '../../api/propertyAdApi';
import { ApiError } from '../../types/api';
import { PropertyAd, PropertyAdState, CreatePropertyAdRequest } from '../../types/propertyAd';
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
export const fetchAllPropertyAds = createAsyncThunk(
  'propertyAd/fetchAllPropertyAds',
  async (filters: { is_active?: boolean } | undefined, { rejectWithValue }) => {
    try {
      const response = await propertyAdApi.getAllPropertyAds(filters);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch property ads');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch property ads'));
    }
  }
);
export const fetchMyPropertyAds = createAsyncThunk(
  'propertyAd/fetchMyPropertyAds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await propertyAdApi.getMyPropertyAds();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch property ads');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch property ads'));
    }
  }
);

export const createPropertyAd = createAsyncThunk(
  'propertyAd/createPropertyAd',
  async (propertyAdData: CreatePropertyAdRequest, { rejectWithValue }) => {
    try {
      const response = await propertyAdApi.createPropertyAd(propertyAdData);
      if (response.success && response.data) {
        toastService.success(response.message || 'Property ad created successfully');
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to create property ad');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to create property ad'));
    }
  }
);

export const fetchPropertyAdById = createAsyncThunk(
  'propertyAd/fetchPropertyAdById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await propertyAdApi.getPropertyAdById(id);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch property ad');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch property ad'));
    }
  }
);

export const updatePropertyAd = createAsyncThunk(
  'propertyAd/updatePropertyAd',
  async ({ id, data }: { id: number; data: Partial<CreatePropertyAdRequest> }, { rejectWithValue }) => {
    try {
      const response = await propertyAdApi.updatePropertyAd(id, data);
      if (response.success && response.data) {
        toastService.success(response.message || 'Property ad updated successfully');
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to update property ad');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to update property ad'));
    }
  }
);

export const deletePropertyAd = createAsyncThunk(
  'propertyAd/deletePropertyAd',
  async (adId: number, { rejectWithValue }) => {
    try {
      const response = await propertyAdApi.deletePropertyAd(adId);
      if (response.success) {
        toastService.success(response.message || 'Property ad deleted successfully');
        return adId;
      } else {
        return rejectWithValue(response.message || 'Failed to delete property ad');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to delete property ad'));
    }
  }
);

export const togglePropertyAdStatus = createAsyncThunk(
  'propertyAd/togglePropertyAdStatus',
  async (adId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { propertyAd: PropertyAdState };
      const ad = state.propertyAd.propertyAds.find(ad => ad.id === adId);
      if (!ad) {
        return rejectWithValue('Property ad not found');
      }
      
      const response = await propertyAdApi.updatePropertyAd(adId, { is_active: !ad.is_active });
      if (response.success && response.data) {
        const status = response.data.is_active ? 'activated' : 'deactivated';
        toastService.success(`Property ad ${status} successfully`);
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to toggle property ad status');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to toggle property ad status'));
    }
  }
);

// Initial state
const initialState: PropertyAdState = {
  propertyAds: [],
  currentPropertyAd: null,
  isLoading: false,
  error: null,
};

// Property slice
const propertyAdSlice = createSlice({
  name: 'propertyAd',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPropertyAds: (state) => {
      state.propertyAds = [];
      state.currentPropertyAd = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch property ad by id
      .addCase(fetchPropertyAdById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyAdById.fulfilled, (state, action: PayloadAction<PropertyAd>) => {
        state.isLoading = false;
        state.currentPropertyAd = action.payload;
        state.error = null;
      })
      .addCase(fetchPropertyAdById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Fetch all property ads (public)
      .addCase(fetchAllPropertyAds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPropertyAds.fulfilled, (state, action: PayloadAction<PropertyAd[]>) => {
        state.isLoading = false;
        state.propertyAds = action.payload;
        state.error = null;
      })
      .addCase(fetchAllPropertyAds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Fetch my property ads (owner)
      .addCase(fetchMyPropertyAds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyPropertyAds.fulfilled, (state, action: PayloadAction<PropertyAd[]>) => {
        state.isLoading = false;
        state.propertyAds = action.payload;
        state.error = null;
      })
      .addCase(fetchMyPropertyAds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Create property ad (owner)
      .addCase(createPropertyAd.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPropertyAd.fulfilled, (state, action: PayloadAction<PropertyAd>) => {
        state.isLoading = false;
        state.propertyAds.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPropertyAd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Update property ad
      .addCase(updatePropertyAd.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePropertyAd.fulfilled, (state, action: PayloadAction<PropertyAd>) => {
        state.isLoading = false;
        const index = state.propertyAds.findIndex(ad => ad.id === action.payload.id);
        if (index !== -1) {
          state.propertyAds[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePropertyAd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Delete property ad
      .addCase(deletePropertyAd.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePropertyAd.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.propertyAds = state.propertyAds.filter(ad => ad.id !== action.payload);
        state.error = null;
      })
      .addCase(deletePropertyAd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Toggle property ad status
      .addCase(togglePropertyAdStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(togglePropertyAdStatus.fulfilled, (state, action: PayloadAction<PropertyAd>) => {
        state.isLoading = false;
        const index = state.propertyAds.findIndex(ad => ad.id === action.payload.id);
        if (index !== -1) {
          state.propertyAds[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(togglePropertyAdStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      });
  },
});

export const { clearError, clearPropertyAds } = propertyAdSlice.actions;
export default propertyAdSlice.reducer;
