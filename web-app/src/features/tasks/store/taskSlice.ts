import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus } from '../types';
import { taskService } from '../services/taskService';

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
  optimisticUpdates: Record<string, {
    id: string;
    title: string;
    description: string;
    prompt: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
    userId: string;
  }>;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  optimisticUpdates: {},
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
  async (data: { title: string; description: string; prompt?: string }) => {
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
      title: string; 
      description: string; 
      prompt?: string; 
      status: TaskStatus 
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
    // Optimistik görev ekleme
    startOptimisticCreate: (state, action: PayloadAction<Task>) => {
      state.items.unshift(action.payload);
    },
    revertOptimisticCreate: (state, action: PayloadAction<string>) => {
      const tempId = action.payload;
      state.items = state.items.filter(task => task.id !== tempId);
    },
    // Optimistik görev silme
    startOptimisticDelete: (state, action: PayloadAction<{ taskId: string }>) => {
      const { taskId } = action.payload;
      // Görevi sakla ve listeden kaldır
      const taskToDelete = state.items.find(task => task.id === taskId);
      if (taskToDelete) {
        state.optimisticUpdates[taskId] = {
          id: taskToDelete.id,
          title: taskToDelete.title,
          description: taskToDelete.description,
          prompt: taskToDelete.prompt,
          status: taskToDelete.status,
          createdAt: taskToDelete.createdAt,
          updatedAt: taskToDelete.updatedAt,
          userId: taskToDelete.userId,
        };
        state.items = state.items.filter(task => task.id !== taskId);
      }
    },
    revertOptimisticDelete: (state, action: PayloadAction<{ taskId: string }>) => {
      const { taskId } = action.payload;
      // Saklanan görevi geri yükle
      const taskToRestore = state.optimisticUpdates[taskId];
      if (taskToRestore) {
        state.items.push({
          id: taskToRestore.id,
          title: taskToRestore.title,
          description: taskToRestore.description,
          prompt: taskToRestore.prompt,
          status: taskToRestore.status,
          createdAt: taskToRestore.createdAt,
          updatedAt: taskToRestore.updatedAt,
          userId: taskToRestore.userId,
        });
        delete state.optimisticUpdates[taskId];
      }
    },
    // Optimistik güncelleme için yeni reducer'lar
    startOptimisticUpdate: (state, action: PayloadAction<{ taskId: string; status: TaskStatus }>) => {
      const { taskId, status } = action.payload;
      const taskIndex = state.items.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
        // Orijinal task'ı sakla
        state.optimisticUpdates[taskId] = {
          id: state.items[taskIndex].id,
          title: state.items[taskIndex].title,
          description: state.items[taskIndex].description,
          prompt: state.items[taskIndex].prompt,
          status: state.items[taskIndex].status,
          createdAt: state.items[taskIndex].createdAt,
          updatedAt: state.items[taskIndex].updatedAt,
          userId: state.items[taskIndex].userId,
        };
        // Task'ı optimistik olarak güncelle
        state.items[taskIndex] = {
          ...state.items[taskIndex],
          status,
        };
      }
    },
    revertOptimisticUpdate: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      const originalTask = state.optimisticUpdates[taskId];
      
      if (originalTask) {
        const taskIndex = state.items.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          // Task'ı orijinal haline geri döndür
          state.items[taskIndex] = {
            id: originalTask.id,
            title: originalTask.title,
            description: originalTask.description,
            prompt: originalTask.prompt,
            status: originalTask.status,
            createdAt: originalTask.createdAt,
            updatedAt: originalTask.updatedAt,
            userId: originalTask.userId,
          };
        }
        // Optimistik güncelleme kaydını temizle
        delete state.optimisticUpdates[taskId];
      }
    },
    clearOptimisticUpdate: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      delete state.optimisticUpdates[taskId];
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
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        // Geçici görevi kaldır ve gerçek görevi ekle
        const tempTask = state.items.find(task => task.id === 'temp');
        if (tempTask) {
          state.items = state.items.filter(task => task.id !== 'temp');
        }
        state.items.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        // Geçici görevi kaldır
        state.items = state.items.filter(task => task.id !== 'temp');
        state.error = action.error.message || 'Görev oluşturulurken bir hata oluştu';
      })

      // Update Task Status
      .addCase(updateTaskStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Başarılı güncelleme sonrası optimistik güncelleme kaydını temizle
        delete state.optimisticUpdates[action.payload.id];
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.error.message || 'Görev durumu güncellenirken bir hata oluştu';
        // Hata durumunda optimistik güncellemeyi geri al
        if (action.meta.arg.taskId && state.optimisticUpdates[action.meta.arg.taskId]) {
          const taskId = action.meta.arg.taskId;
          const originalTask = state.optimisticUpdates[taskId];
          const taskIndex = state.items.findIndex(task => task.id === taskId);
          
          if (taskIndex !== -1) {
            state.items[taskIndex] = originalTask;
          }
          delete state.optimisticUpdates[taskId];
        }
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
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        // Optimistik silme başarılı olduğunda saklanan görevi temizle
        delete state.optimisticUpdates[action.payload];
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message || 'Görev silinirken bir hata oluştu';
        // Hata durumunda görevi geri yükle
        if (action.meta.arg && state.optimisticUpdates[action.meta.arg]) {
          const taskToRestore = state.optimisticUpdates[action.meta.arg];
          state.items.push({
            id: taskToRestore.id,
            title: taskToRestore.title,
            description: taskToRestore.description,
            prompt: taskToRestore.prompt,
            status: taskToRestore.status,
            createdAt: taskToRestore.createdAt,
            updatedAt: taskToRestore.updatedAt,
            userId: taskToRestore.userId,
          });
          delete state.optimisticUpdates[action.meta.arg];
        }
      });
  },
});

export const { 
  clearError, 
  startOptimisticCreate,
  revertOptimisticCreate,
  startOptimisticUpdate, 
  revertOptimisticUpdate,
  clearOptimisticUpdate,
  startOptimisticDelete,
  revertOptimisticDelete
} = taskSlice.actions;
export default taskSlice.reducer;