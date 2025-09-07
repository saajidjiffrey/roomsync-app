import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiError } from '../../types/api';
import { SplitState, Split, SplitSummary } from '../../types/split';
import { splitApi } from '../../api/splitApi';
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
export const fetchToPaySplits = createAsyncThunk(
  'split/fetchToPaySplits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await splitApi.getToPaySplits();
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [response.data];
      } else {
        return rejectWithValue(response.message || 'Failed to fetch to pay splits');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch to pay splits'));
    }
  }
);

export const fetchToReceiveSplits = createAsyncThunk(
  'split/fetchToReceiveSplits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await splitApi.getToReceiveSplits();
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [response.data];
      } else {
        return rejectWithValue(response.message || 'Failed to fetch to receive splits');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch to receive splits'));
    }
  }
);

export const fetchSplitHistory = createAsyncThunk(
  'split/fetchSplitHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await splitApi.getSplitHistory();
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [response.data];
      } else {
        return rejectWithValue(response.message || 'Failed to fetch split history');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch split history'));
    }
  }
);

export const fetchSplitSummary = createAsyncThunk(
  'split/fetchSplitSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await splitApi.getSplitSummary();
      if (response.success && response.data) {
        return response.data as SplitSummary;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch split summary');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch split summary'));
    }
  }
);

export const fetchSplitsByExpense = createAsyncThunk(
  'split/fetchSplitsByExpense',
  async (expenseId: number, { rejectWithValue }) => {
    try {
      const response = await splitApi.getSplitsByExpense(expenseId);
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [response.data];
      } else {
        return rejectWithValue(response.message || 'Failed to fetch splits by expense');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch splits by expense'));
    }
  }
);

export const updateSplitStatus = createAsyncThunk(
  'split/updateSplitStatus',
  async ({ splitId, status }: { splitId: number; status: 'unpaid' | 'pending' | 'paid' }, { rejectWithValue }) => {
    try {
      const response = await splitApi.updateSplitStatus(splitId, status);
      if (response.success && response.data) {
        toastService.success('Split status updated successfully');
        return { splitId, status, split: response.data };
      } else {
        return rejectWithValue(response.message || 'Failed to update split status');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to update split status'));
    }
  }
);

const initialState: SplitState = {
  toPaySplits: [],
  toReceiveSplits: [],
  historySplits: [],
  splitsByExpense: [],
  summary: null,
  isLoading: false,
  error: null,
};

const splitSlice = createSlice({
  name: 'split',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSplits: (state) => {
      state.toPaySplits = [];
      state.toReceiveSplits = [];
      state.historySplits = [];
      state.summary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch To Pay Splits
      .addCase(fetchToPaySplits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchToPaySplits.fulfilled, (state, action: PayloadAction<Split[]>) => {
        state.isLoading = false;
        state.toPaySplits = action.payload;
      })
      .addCase(fetchToPaySplits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Fetch To Receive Splits
      .addCase(fetchToReceiveSplits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchToReceiveSplits.fulfilled, (state, action: PayloadAction<Split[]>) => {
        state.isLoading = false;
        state.toReceiveSplits = action.payload;
      })
      .addCase(fetchToReceiveSplits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Fetch Split History
      .addCase(fetchSplitHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSplitHistory.fulfilled, (state, action: PayloadAction<Split[]>) => {
        state.isLoading = false;
        state.historySplits = action.payload;
      })
      .addCase(fetchSplitHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Fetch Split Summary
      .addCase(fetchSplitSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSplitSummary.fulfilled, (state, action: PayloadAction<SplitSummary>) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSplitSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Update Split Status
      .addCase(updateSplitStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Fetch splits by expense
      .addCase(fetchSplitsByExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSplitsByExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.splitsByExpense = action.payload;
        state.error = null;
      })
      .addCase(fetchSplitsByExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      .addCase(updateSplitStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const { splitId, status } = action.payload;
        
        // Update the split in all relevant arrays
        const updateSplitInArray = (splits: Split[]) => {
          const index = splits.findIndex(split => split.id === splitId);
          if (index !== -1) {
            splits[index] = { ...splits[index], status, paid_date: status === 'paid' ? new Date().toISOString() : null };
          }
        };
        
        updateSplitInArray(state.toPaySplits);
        updateSplitInArray(state.toReceiveSplits);
        updateSplitInArray(state.historySplits);
      })
      .addCase(updateSplitStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      });
  },
});

export const { clearError, clearSplits } = splitSlice.actions;

// Selectors
export const selectSplitState = (state: RootState) => state.split;
export const selectToPaySplits = (state: RootState) => state.split.toPaySplits;
export const selectToReceiveSplits = (state: RootState) => state.split.toReceiveSplits;
export const selectHistorySplits = (state: RootState) => state.split.historySplits;
export const selectSplitsByExpense = (state: RootState) => state.split.splitsByExpense;
export const selectSplitSummary = (state: RootState) => state.split.summary;
export const selectSplitIsLoading = (state: RootState) => state.split.isLoading;
export const selectSplitError = (state: RootState) => state.split.error;

export default splitSlice.reducer;
