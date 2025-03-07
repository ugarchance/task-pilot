import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus } from '../types/task';
import { taskService } from '../services/taskService';

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async () => {
    return await taskService.getAllTasks();
  }
);

export const fetchActiveTasks = createAsyncThunk(
  'tasks/fetchActive',
  async () => {
    return await taskService.getActiveTasks();
  }
);

export const fetchCompletedTasks = createAsyncThunk(
  'tasks/fetchCompleted',
  async () => {
    return await taskService.getCompletedTasks();
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (data: { 
    title: string; 
    description: string; 
    prompt?: string;
    status?: TaskStatus;
    tags?: string[];
    subTasks?: Task[];
    progress?: { done: string[]; todo: string[] };
  }) => {
    return await taskService.createTask(data);
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
    return await taskService.updateTaskStatus(taskId, status);
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ taskId, data }: { 
    taskId: string; 
    data: { 
      title?: string; 
      description?: string; 
      prompt?: string; 
      status?: TaskStatus;
      tags?: string[];
      subTasks?: Task[];
      progress?: { done: string[]; todo: string[] };
    } 
  }) => {
    return await taskService.updateTask(taskId, data);
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (taskId: string) => {
    await taskService.deleteTask(taskId);
    return taskId;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Görevler yüklenirken bir hata oluştu';
      })

      // Fetch Active Tasks
      .addCase(fetchActiveTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchActiveTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Aktif görevler yüklenirken bir hata oluştu';
      })

      // Fetch Completed Tasks
      .addCase(fetchCompletedTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCompletedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Tamamlanan görevler yüklenirken bir hata oluştu';
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Görev oluşturulurken bir hata oluştu';
      })

      // Update Task Status
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Görev durumu güncellenirken bir hata oluştu';
      })

      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Görev güncellenirken bir hata oluştu';
      })

      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Görev silinirken bir hata oluştu';
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;