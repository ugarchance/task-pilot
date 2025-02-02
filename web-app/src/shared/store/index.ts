import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '@/features/tasks/store/taskSlice';
import authReducer from '@/features/auth/store/authSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;