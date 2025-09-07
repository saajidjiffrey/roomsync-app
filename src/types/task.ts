export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  is_completed: boolean;
  assigned_to: number;
  created_by: number;
  group_id: number;
  created_at: string;
  updated_at: string;
  assignedTenant?: {
    id: number;
    User: {
      id: number;
      full_name: string;
      email: string;
      profile_url: string;
    };
  };
  createdByTenant?: {
    id: number;
    User: {
      id: number;
      full_name: string;
      email: string;
      profile_url: string;
    };
  };
  group?: {
    id: number;
    name: string;
    description?: string;
  };
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to: number;
  group_id: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to?: number;
}

export interface TaskFilters {
  is_completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: number;
  created_by?: number;
  due_date_from?: string;
  due_date_to?: string;
}

export interface TaskStatistics {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completion_rate: string;
  priority_breakdown: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface TaskState {
  tasks: Task[];
  completedTasks: Task[];
  incompleteTasks: Task[];
  myTasks: Task[];
  tasksICreated: Task[];
  overdueTasks: Task[];
  tasksDueToday: Task[];
  statistics: TaskStatistics | null;
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
}
