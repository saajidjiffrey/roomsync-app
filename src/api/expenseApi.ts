import api from './api';
import { CreateExpenseRequest, ExpenseApiResponse } from '../types/expense';

export const expenseApi = {
  // Create a new expense with automatic split creation
  createExpense: async (expenseData: CreateExpenseRequest): Promise<ExpenseApiResponse> => {
    const response = await api.post('/expense', expenseData);
    return response.data;
  },

  // Get all expenses for a group
  getExpensesByGroup: async (groupId: number): Promise<ExpenseApiResponse> => {
    const response = await api.get(`/expense/group/${groupId}`);
    return response.data;
  },

  // Get a specific expense by ID
  getExpenseById: async (expenseId: number): Promise<ExpenseApiResponse> => {
    const response = await api.get(`/expense/${expenseId}`);
    return response.data;
  },

  // Update an expense
  updateExpense: async (expenseId: number, expenseData: Partial<CreateExpenseRequest>): Promise<ExpenseApiResponse> => {
    const response = await api.put(`/expense/${expenseId}`, expenseData);
    return response.data;
  },

  // Delete an expense
  deleteExpense: async (expenseId: number): Promise<ExpenseApiResponse> => {
    const response = await api.delete(`/expense/${expenseId}`);
    return response.data;
  }
};
