import api from './api';
import { SplitApiResponse } from '../types/split';

export const splitApi = {
  // Get splits that the current user needs to pay
  getToPaySplits: async (): Promise<SplitApiResponse> => {
    const response = await api.get('/split/tenant/to-pay');
    return response.data;
  },

  // Get splits that the current user should receive
  getToReceiveSplits: async (): Promise<SplitApiResponse> => {
    const response = await api.get('/split/tenant/to-receive');
    return response.data;
  },

  // Get split history for the current user
  getSplitHistory: async (): Promise<SplitApiResponse> => {
    const response = await api.get('/split/tenant/history');
    return response.data;
  },

  // Get split summary (totals for to pay, to receive, history)
  getSplitSummary: async (): Promise<SplitApiResponse> => {
    const response = await api.get('/split/tenant/summary');
    return response.data;
  },

  // Update split status (mark as paid)
  updateSplitStatus: async (splitId: number, status: 'unpaid' | 'pending' | 'paid'): Promise<SplitApiResponse> => {
    const response = await api.patch(`/split/${splitId}/status`, { status });
    return response.data;
  },

  // Get splits by expense
  getSplitsByExpense: async (expenseId: number): Promise<SplitApiResponse> => {
    const response = await api.get(`/split/expense/${expenseId}`);
    return response.data;
  },

  // Get split by ID
  getSplitById: async (splitId: number): Promise<SplitApiResponse> => {
    const response = await api.get(`/split/${splitId}`);
    return response.data;
  }
};
