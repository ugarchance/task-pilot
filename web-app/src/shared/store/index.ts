import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '@/features/tasks/store/taskSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      tasks: taskReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch']; 