import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiError } from '../../types/api';
import { PropertyJoinRequestState, PropertyJoinRequest, CreateJoinRequestPayload, RespondJoinRequestPayload } from '../../types/propertyJoinRequest';
import { propertyJoinRequestApi } from '../../api/propertyJoinRequestApi';
import toastService from '../../services/toast';
import type { RootState } from '..';

const extractErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const apiError = error as ApiError;
  if (apiError.response?.data?.errors && apiError.response.data.errors.length > 0) {
    return apiError.response.data.errors[0].message;
  } else if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  } else if (apiError.message) {
    return apiError.message;
  }
  return fallbackMessage;
};

export const fetchMyJoinRequests = createAsyncThunk(
  'joinRequest/fetchMyJoinRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await propertyJoinRequestApi.getMyJoinRequests();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch join requests');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch join requests'));
    }
  }
);

export const fetchOwnerReceivedJoinRequests = createAsyncThunk(
  'joinRequest/fetchOwnerReceivedJoinRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await propertyJoinRequestApi.getOwnerReceivedJoinRequests();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch owner join requests');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch owner join requests'));
    }
  }
);

export const createJoinRequest = createAsyncThunk(
  'joinRequest/createJoinRequest',
  async (payload: CreateJoinRequestPayload, { rejectWithValue }) => {
    try {
      const response = await propertyJoinRequestApi.createJoinRequest(payload);
      if (response.success && response.data) {
        toastService.success(response.message || 'Join request created successfully');
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to create join request');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to create join request'));
    }
  }
);

export const respondToJoinRequest = createAsyncThunk(
  'joinRequest/respondToJoinRequest',
  async ({ requestId, status }: RespondJoinRequestPayload, { rejectWithValue }) => {
    try {
      const response = await propertyJoinRequestApi.respondToJoinRequest(requestId, status);
      if (response.success && response.data) {
        toastService.success(response.message || 'Join request updated successfully');
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to update join request');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to update join request'));
    }
  }
);

export const deleteJoinRequest = createAsyncThunk(
  'joinRequest/deleteJoinRequest',
  async (requestId: number, { rejectWithValue }) => {
    try {
      const response = await propertyJoinRequestApi.deleteJoinRequest(requestId);
      if (response.success) {
        toastService.success(response.message || 'Join request deleted successfully');
        return requestId;
      } else {
        return rejectWithValue(response.message || 'Failed to delete join request');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to delete join request'));
    }
  }
);

const initialState: PropertyJoinRequestState = {
  myRequests: [],
  isLoading: false,
  error: null,
};

const joinRequestSlice = createSlice({
  name: 'joinRequest',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearJoinRequests: (state) => {
      state.myRequests = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyJoinRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyJoinRequests.fulfilled, (state, action: PayloadAction<PropertyJoinRequest[]>) => {
        state.isLoading = false;
        state.myRequests = action.payload;
      })
      .addCase(fetchMyJoinRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      .addCase(fetchOwnerReceivedJoinRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOwnerReceivedJoinRequests.fulfilled, (state, action: PayloadAction<PropertyJoinRequest[]>) => {
        state.isLoading = false;
        state.myRequests = action.payload;
      })
      .addCase(fetchOwnerReceivedJoinRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      .addCase(createJoinRequest.fulfilled, (state, action: PayloadAction<PropertyJoinRequest>) => {
        state.myRequests.unshift(action.payload);
      })
      .addCase(respondToJoinRequest.fulfilled, (state, action: PayloadAction<PropertyJoinRequest>) => {
        const updated = action.payload;
        const idx = state.myRequests.findIndex(r => r.id === updated.id);
        if (idx !== -1) {
          state.myRequests[idx] = updated;
        }
      })
      .addCase(deleteJoinRequest.fulfilled, (state, action: PayloadAction<number>) => {
        state.myRequests = state.myRequests.filter(r => r.id !== action.payload);
      });
  },
});

export const { clearError, clearJoinRequests } = joinRequestSlice.actions;
export default joinRequestSlice.reducer;

// Selectors
export const selectOwnerActiveJoinRequests = (state: RootState) =>
  state.joinRequest.myRequests.filter((r) => r.status === 'pending');