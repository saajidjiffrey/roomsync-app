import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiError } from '../../types/api';
import { ExpenseState, Expense, CreateExpenseRequest } from '../../types/expense';
import { expenseApi } from '../../api/expenseApi';
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
export const createExpense = createAsyncThunk(
  'expense/createExpense',
  async (expenseData: CreateExpenseRequest, { rejectWithValue }) => {
    try {
      const response = await expenseApi.createExpense(expenseData);
      if (response.success && response.data) {
        toastService.success('Expense created successfully');
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to create expense');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to create expense'));
    }
  }
);

export const fetchExpensesByGroup = createAsyncThunk(
  'expense/fetchExpensesByGroup',
  async (groupId: number, { rejectWithValue }) => {
    try {
      const response = await expenseApi.getExpensesByGroup(groupId);
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [response.data];
      } else {
        return rejectWithValue(response.message || 'Failed to fetch expenses');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch expenses'));
    }
  }
);

export const fetchExpenseById = createAsyncThunk(
  'expense/fetchExpenseById',
  async (expenseId: number, { rejectWithValue }) => {
    try {
      const response = await expenseApi.getExpenseById(expenseId);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch expense');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch expense'));
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expense/updateExpense',
  async ({ expenseId, expenseData }: { expenseId: number; expenseData: Partial<CreateExpenseRequest> }, { rejectWithValue }) => {
    try {
      const response = await expenseApi.updateExpense(expenseId, expenseData);
      if (response.success && response.data) {
        toastService.success('Expense updated successfully');
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to update expense');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to update expense'));
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expense/deleteExpense',
  async (expenseId: number, { rejectWithValue }) => {
    try {
      const response = await expenseApi.deleteExpense(expenseId);
      if (response.success) {
        toastService.success('Expense deleted successfully');
        return expenseId;
      } else {
        return rejectWithValue(response.message || 'Failed to delete expense');
      }
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to delete expense'));
    }
  }
);

const initialState: ExpenseState = {
  expenses: [],
  isLoading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearExpenses: (state) => {
      state.expenses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Expense
      .addCase(createExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.isLoading = false;
        state.expenses.unshift(action.payload); // Add to beginning of array
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Fetch Expenses by Group
      .addCase(fetchExpensesByGroup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpensesByGroup.fulfilled, (state, action: PayloadAction<Expense[]>) => {
        state.isLoading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpensesByGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Fetch Expense by ID
      .addCase(fetchExpenseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenseById.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.isLoading = false;
        const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        } else {
          state.expenses.push(action.payload);
        }
      })
      .addCase(fetchExpenseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Update Expense
      .addCase(updateExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.isLoading = false;
        const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      })
      // Delete Expense
      .addCase(deleteExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toastService.error(action.payload as string);
      });
  },
});

export const { clearError, clearExpenses } = expenseSlice.actions;

// Selectors
export const selectExpenseState = (state: RootState) => state.expense;
export const selectExpenses = (state: RootState) => state.expense.expenses;
export const selectExpenseIsLoading = (state: RootState) => state.expense.isLoading;
export const selectExpenseError = (state: RootState) => state.expense.error;

export default expenseSlice.reducer;
