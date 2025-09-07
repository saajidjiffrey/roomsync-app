import api from './api';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters, TaskStatistics } from '../types/task';

export const taskApi = {
  // Create a new task
  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    const response = await api.post('/task', taskData);
    return response.data.data;
  },

  // Get a specific task by ID
  getTaskById: async (taskId: number): Promise<Task> => {
    const response = await api.get(`/task/${taskId}`);
    return response.data.data;
  },

  // Update a task
  updateTask: async (taskId: number, updateData: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put(`/task/${taskId}`, updateData);
    return response.data.data;
  },

  // Delete a task
  deleteTask: async (taskId: number): Promise<void> => {
    await api.delete(`/task/${taskId}`);
  },

  // Update task completion status
  updateTaskStatus: async (taskId: number, isCompleted: boolean): Promise<Task> => {
    const response = await api.patch(`/task/${taskId}/status`, { is_completed: isCompleted });
    return response.data.data;
  },

  // Get all tasks for a group
  getTasksByGroup: async (groupId: number, filters?: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get(`/task/group/${groupId}?${params.toString()}`);
    return response.data.data;
  },

  // Get task statistics for a group
  getTaskStatistics: async (groupId: number): Promise<TaskStatistics> => {
    const response = await api.get(`/task/group/${groupId}/statistics`);
    return response.data.data;
  },

  // Get overdue tasks for a group
  getOverdueTasks: async (groupId: number): Promise<Task[]> => {
    const response = await api.get(`/task/group/${groupId}/overdue`);
    return response.data.data;
  },

  // Get tasks due today for a group
  getTasksDueToday: async (groupId: number): Promise<Task[]> => {
    const response = await api.get(`/task/group/${groupId}/due-today`);
    return response.data.data;
  },

  // Get tasks assigned to the current user
  getMyTasks: async (filters?: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get(`/task/my/assigned?${params.toString()}`);
    return response.data.data;
  },

  // Get tasks created by the current user
  getTasksICreated: async (filters?: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get(`/task/my/created?${params.toString()}`);
    return response.data.data;
  },
};
