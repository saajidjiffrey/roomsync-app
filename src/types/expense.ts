export interface Expense {
  id: number;
  title: string;
  description?: string;
  receipt_total: number;
  category: ExpenseCategory;
  created_by: number;
  group_id: number;
  created_at: string;
  updated_at: string;
  // Additional fields that might be populated by API
  creator?: {
    id: number;
    user_id: number;
    User?: {
      id: number;
      full_name: string;
      email: string;
    };
  };
  group?: {
    id: number;
    name: string;
    description?: string;
  };
  splits?: Split[];
}

export type ExpenseCategory = 'groceries' | 'dinner' | 'breakfast' | 'lunch' | 'other';

export interface CreateExpenseRequest {
  title: string;
  description?: string;
  receipt_total: number;
  category: ExpenseCategory;
  group_id: number;
  selected_roommates: number[]; // Array of tenant IDs
}

export interface ExpenseApiResponse {
  success: boolean;
  message: string;
  data?: Expense | Expense[];
}

export interface ExpenseState {
  expenses: Expense[];
  currentExpense: Expense | null;
  isLoading: boolean;
  error: string | null;
}

// Import Split type
import { Split } from './split';
