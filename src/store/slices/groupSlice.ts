import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiError } from '../../types/api';
import { GroupState, Group, CreateGroupRequest, JoinGroupRequest } from '../../types/group';
import { groupApi } from '../../api/groupApi';
import toastService from '../../services/toast';
import type { RootState } from '..';

const extractErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const apiError = error as ApiError;
  if (apiError.response?.data?.errors && apiError.response.data.errors.length > 0) {
    return apiError.response.data.errors[0].message;
  }
  return apiError.response?.data?.message || apiError.message || fallbackMessage;
};

// Async thunks
export const fetchAvailableGroups = createAsyncThunk(
  'group/fetchAvailableGroups',
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await groupApi.getAvailableGroups(propertyId);
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [response.data];
      } else {
        return rejectWithValue(response.message || 'Failed to fetch available groups');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch available groups'));
    }
  }
);

export const fetchMyGroups = createAsyncThunk(
  'group/fetchMyGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await groupApi.getMyGroups();
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [response.data];
      } else {
        return rejectWithValue(response.message || 'Failed to fetch my groups');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch my groups'));
    }
  }
);

export const createGroup = createAsyncThunk(
  'group/createGroup',
  async (groupData: CreateGroupRequest, { rejectWithValue }) => {
    try {
      const response = await groupApi.createGroup(groupData);
      if (response.success && response.data) {
        toastService.success(response.message || 'Group created successfully');
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to create group');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to create group'));
    }
  }
);

export const joinGroup = createAsyncThunk(
  'group/joinGroup',
  async (joinData: JoinGroupRequest, { rejectWithValue }) => {
    try {
      const response = await groupApi.joinGroup(joinData);
      if (response.success && response.data) {
        toastService.success(response.message || 'Successfully joined group');
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to join group');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to join group'));
    }
  }
);

export const leaveGroup = createAsyncThunk(
  'group/leaveGroup',
  async (groupId: number, { rejectWithValue }) => {
    try {
      const response = await groupApi.leaveGroup(groupId);
      if (response.success) {
        toastService.success(response.message || 'Successfully left group');
        return groupId;
      } else {
        return rejectWithValue(response.message || 'Failed to leave group');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to leave group'));
    }
  }
);

export const fetchGroupDetails = createAsyncThunk(
  'group/fetchGroupDetails',
  async (groupId: number, { rejectWithValue }) => {
    try {
      const response = await groupApi.getGroupDetails(groupId);
      if (response.success && response.data) {
        // Ensure we return a single Group object, not an array
        const groupData = Array.isArray(response.data) ? response.data[0] : response.data;
        return groupData;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch group details');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch group details'));
    }
  }
);

const initialState: GroupState = {
  availableGroups: [],
  myGroups: [],
  currentGroup: null,
  isLoading: false,
  error: null,
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearGroups: (state) => {
      state.availableGroups = [];
      state.myGroups = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Available Groups
      .addCase(fetchAvailableGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableGroups.fulfilled, (state, action: PayloadAction<Group[]>) => {
        state.isLoading = false;
        state.availableGroups = action.payload;
      })
      .addCase(fetchAvailableGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Fetch My Groups
      .addCase(fetchMyGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyGroups.fulfilled, (state, action: PayloadAction<Group[]>) => {
        state.isLoading = false;
        state.myGroups = action.payload;
      })
      .addCase(fetchMyGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Create Group
      .addCase(createGroup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        const group = action.payload as Group;
        // Add the new group to available groups
        state.availableGroups.push(group);
        // Add to my groups as well since user created it
        state.myGroups.push(group);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Join Group
      .addCase(joinGroup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        const group = action.payload as Group;
        // Add to my groups
        state.myGroups.push(group);
        // Update the group in available groups to show it's joined
        const index = state.availableGroups.findIndex(g => g.id === group.id);
        if (index !== -1) {
          state.availableGroups[index] = { ...state.availableGroups[index], is_joined: true };
        }
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Leave Group
      .addCase(leaveGroup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(leaveGroup.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        // Remove from my groups
        state.myGroups = state.myGroups.filter(group => group.id !== action.payload);
        // Update the group in available groups to show it's not joined
        const index = state.availableGroups.findIndex(group => group.id === action.payload);
        if (index !== -1) {
          state.availableGroups[index] = { ...state.availableGroups[index], is_joined: false };
        }
      })
      .addCase(leaveGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Fetch Group Details
      .addCase(fetchGroupDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupDetails.fulfilled, (state, action: PayloadAction<Group>) => {
        state.isLoading = false;
        state.currentGroup = action.payload;
      })
      .addCase(fetchGroupDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      });
  },
});

export const { clearError, clearGroups } = groupSlice.actions;

// Selectors
export const selectGroupState = (state: RootState) => state.group;
export const selectAvailableGroups = (state: RootState) => state.group.availableGroups;
export const selectMyGroups = (state: RootState) => state.group.myGroups;
export const selectCurrentGroup = (state: RootState) => state.group.currentGroup;
export const selectGroupIsLoading = (state: RootState) => state.group.isLoading;
export const selectGroupError = (state: RootState) => state.group.error;

export default groupSlice.reducer;
