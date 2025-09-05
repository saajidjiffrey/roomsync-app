export interface Split {
  id: number;
  status: 'unpaid' | 'pending' | 'paid';
  split_amount: number;
  assigned_to: number;
  assigned_by?: number | null;
  paid_date?: string | null;
  expense_id: number;
  created_at: string;
  updated_at: string;
  // Additional fields that might be populated by API
  assignedTenant?: {
    id: number;
    user_id: number;
    tenantUser?: {
      id: number;
      full_name: string;
      email: string;
    };
  };
  assignedByTenant?: {
    id: number;
    user_id: number;
    tenantUser?: {
      id: number;
      full_name: string;
      email: string;
    };
  };
  expense?: {
    id: number;
    title: string;
    description?: string;
    receipt_total: number;
    category: string;
    created_by: number;
    group_id: number;
  };
}

export interface SplitSummary {
  toPay: {
    total: number;
    count: number;
  };
  toReceive: {
    total: number;
    count: number;
  };
  history: {
    paid: number;
    received: number;
    count: number;
  };
}

export interface SplitState {
  toPaySplits: Split[];
  toReceiveSplits: Split[];
  historySplits: Split[];
  summary: SplitSummary | null;
  isLoading: boolean;
  error: string | null;
}

export interface SplitApiResponse {
  success: boolean;
  message: string;
  data?: Split | Split[] | SplitSummary;
}
