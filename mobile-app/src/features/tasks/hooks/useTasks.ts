import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { AppDispatch } from '../../../store';
import { Task, TaskStatus } from '../types/task';
import {
  fetchTasks,
  fetchActiveTasks,
  fetchCompletedTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
  clearError,
} from '../store/taskSlice';
import { Alert } from 'react-native';

export const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: tasks, loading, error } = useSelector((state: RootState) => state.tasks);

  const handleFetchTasks = useCallback(async () => {
    try {
      await dispatch(fetchTasks()).unwrap();
    } catch (error) {
      Alert.alert('Hata', 'Görevler yüklenirken bir hata oluştu.');
    }
  }, [dispatch]);
  
  const handleFetchActiveTasks = useCallback(async () => {
    try {
      await dispatch(fetchActiveTasks()).unwrap();
    } catch (error) {
      Alert.alert('Hata', 'Aktif görevler yüklenirken bir hata oluştu.');
    }
  }, [dispatch]);
  
  const handleFetchCompletedTasks = useCallback(async () => {
    try {
      await dispatch(fetchCompletedTasks()).unwrap();
    } catch (error) {
      Alert.alert('Hata', 'Tamamlanan görevler yüklenirken bir hata oluştu.');
    }
  }, [dispatch]);
  
  const handleCreateTask = useCallback(async (data: { 
    title: string; 
    description: string; 
    prompt?: string;
    status?: TaskStatus;
    tags?: string[];
    subTasks?: Task[];
    progress?: { done: string[]; todo: string[] };
  }) => {
    try {
      const result = await dispatch(createTask(data)).unwrap();
      return result;
    } catch (error) {
      Alert.alert('Hata', 'Görev oluşturulurken bir hata oluştu.');
      throw error;
    }
  }, [dispatch]);
  
  const handleUpdateTaskStatus = useCallback(async (taskId: string, status: TaskStatus) => {
    try {
      await dispatch(updateTaskStatus({ taskId, status })).unwrap();
    } catch (error) {
      Alert.alert('Hata', 'Görev durumu güncellenirken bir hata oluştu.');
      throw error;
    }
  }, [dispatch]);
  
  const handleUpdateTask = useCallback(async (taskId: string, data: { 
    title?: string; 
    description?: string; 
    prompt?: string; 
    status?: TaskStatus;
    tags?: string[];
    subTasks?: Task[];
    progress?: { done: string[]; todo: string[] };
  }) => {
    try {
      await dispatch(updateTask({ taskId, data })).unwrap();
    } catch (error) {
      Alert.alert('Hata', 'Görev güncellenirken bir hata oluştu.');
      throw error;
    }
  }, [dispatch]);
  
  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
    } catch (error) {
      Alert.alert('Hata', 'Görev silinirken bir hata oluştu.');
      throw error;
    }
  }, [dispatch]);
  
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    tasks,
    loading,
    error,
    fetchTasks: handleFetchTasks,
    fetchActiveTasks: handleFetchActiveTasks,
    fetchCompletedTasks: handleFetchCompletedTasks,
    createTask: handleCreateTask,
    updateTaskStatus: handleUpdateTaskStatus,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    clearError: handleClearError,
  };
};