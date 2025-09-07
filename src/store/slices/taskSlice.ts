import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskApi } from '../../api/taskApi';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters, TaskStatistics } from '../../types/task';

interface TaskState {
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

const initialState: TaskState = {
  tasks: [],
  completedTasks: [],
  incompleteTasks: [],
  myTasks: [],
  tasksICreated: [],
  overdueTasks: [],
  tasksDueToday: [],
  statistics: null,
  isLoading: false,
  error: null,
  filters: {},
};

// Async thunks
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: CreateTaskRequest, { rejectWithValue }) => {
    try {
      const task = await taskApi.createTask(taskData);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const fetchTasksByGroup = createAsyncThunk(
  'tasks/fetchTasksByGroup',
  async ({ groupId, filters = {} }: { groupId: number; filters?: TaskFilters }, { rejectWithValue }) => {
    try {
      const tasks = await taskApi.getTasksByGroup(groupId, filters);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchMyTasks = createAsyncThunk(
  'tasks/fetchMyTasks',
  async (filters: TaskFilters = {}, { rejectWithValue }) => {
    try {
      const tasks = await taskApi.getMyTasks(filters);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my tasks');
    }
  }
);

export const fetchTasksICreated = createAsyncThunk(
  'tasks/fetchTasksICreated',
  async (filters: TaskFilters = {}, { rejectWithValue }) => {
    try {
      const tasks = await taskApi.getTasksICreated(filters);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch created tasks');
    }
  }
);

export const fetchTaskStatistics = createAsyncThunk(
  'tasks/fetchTaskStatistics',
  async (groupId: number, { rejectWithValue }) => {
    try {
      const statistics = await taskApi.getTaskStatistics(groupId);
      return statistics;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task statistics');
    }
  }
);

export const fetchOverdueTasks = createAsyncThunk(
  'tasks/fetchOverdueTasks',
  async (groupId: number, { rejectWithValue }) => {
    try {
      const tasks = await taskApi.getOverdueTasks(groupId);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch overdue tasks');
    }
  }
);

export const fetchTasksDueToday = createAsyncThunk(
  'tasks/fetchTasksDueToday',
  async (groupId: number, { rejectWithValue }) => {
    try {
      const tasks = await taskApi.getTasksDueToday(groupId);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks due today');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updateData }: { taskId: number; updateData: UpdateTaskRequest }, { rejectWithValue }) => {
    try {
      const task = await taskApi.updateTask(taskId, updateData);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, isCompleted }: { taskId: number; isCompleted: boolean }, { rejectWithValue }) => {
    try {
      const task = await taskApi.updateTaskStatus(taskId, isCompleted);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task status');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: number, { rejectWithValue }) => {
    try {
      await taskApi.deleteTask(taskId);
      return taskId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TaskFilters>) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.completedTasks = [];
      state.incompleteTasks = [];
      state.myTasks = [];
      state.tasksICreated = [];
      state.overdueTasks = [];
      state.tasksDueToday = [];
      state.statistics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.push(action.payload);
        // Update completed/incomplete lists
        if (action.payload.is_completed) {
          state.completedTasks.push(action.payload);
        } else {
          state.incompleteTasks.push(action.payload);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch tasks by group
      .addCase(fetchTasksByGroup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasksByGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
        state.completedTasks = action.payload.filter(task => task.is_completed);
        state.incompleteTasks = action.payload.filter(task => !task.is_completed);
      })
      .addCase(fetchTasksByGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch my tasks
      .addCase(fetchMyTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myTasks = action.payload;
      })
      .addCase(fetchMyTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch tasks I created
      .addCase(fetchTasksICreated.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasksICreated.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasksICreated = action.payload;
      })
      .addCase(fetchTasksICreated.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch task statistics
      .addCase(fetchTaskStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaskStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchTaskStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch overdue tasks
      .addCase(fetchOverdueTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOverdueTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.overdueTasks = action.payload;
      })
      .addCase(fetchOverdueTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch tasks due today
      .addCase(fetchTasksDueToday.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasksDueToday.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasksDueToday = action.payload;
      })
      .addCase(fetchTasksDueToday.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        // Update completed/incomplete lists
        state.completedTasks = state.tasks.filter(task => task.is_completed);
        state.incompleteTasks = state.tasks.filter(task => !task.is_completed);
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update task status
      .addCase(updateTaskStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        // Update completed/incomplete lists
        state.completedTasks = state.tasks.filter(task => task.is_completed);
        state.incompleteTasks = state.tasks.filter(task => !task.is_completed);
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.completedTasks = state.completedTasks.filter(task => task.id !== action.payload);
        state.incompleteTasks = state.incompleteTasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearError, clearTasks } = taskSlice.actions;

// Selectors
export const selectTasks = (state: { tasks: TaskState }) => state.tasks.tasks;
export const selectCompletedTasks = (state: { tasks: TaskState }) => state.tasks.completedTasks;
export const selectIncompleteTasks = (state: { tasks: TaskState }) => state.tasks.incompleteTasks;
export const selectMyTasks = (state: { tasks: TaskState }) => state.tasks.myTasks;
export const selectTasksICreated = (state: { tasks: TaskState }) => state.tasks.tasksICreated;
export const selectOverdueTasks = (state: { tasks: TaskState }) => state.tasks.overdueTasks;
export const selectTasksDueToday = (state: { tasks: TaskState }) => state.tasks.tasksDueToday;
export const selectTaskStatistics = (state: { tasks: TaskState }) => state.tasks.statistics;
export const selectTaskIsLoading = (state: { tasks: TaskState }) => state.tasks.isLoading;
export const selectTaskError = (state: { tasks: TaskState }) => state.tasks.error;
export const selectTaskFilters = (state: { tasks: TaskState }) => state.tasks.filters;

export default taskSlice.reducer;
