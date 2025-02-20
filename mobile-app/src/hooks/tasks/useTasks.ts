import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Task, TaskStatus } from '@/types';

export const useTasks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const functions = getFunctions();

  const createTask = async (
    title: string,
    description: string,
    status: TaskStatus,
    dueDate: Date
  ) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Creating task with:', { title, description, status, dueDate });
      const createTaskFn = httpsCallable(functions, 'createTask');
      const result = await createTaskFn({ title, description, status, dueDate });
      console.log('Task created successfully:', result.data);
      return result.data as Task;
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'Görev oluşturulurken bir hata oluştu');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    setLoading(true);
    setError(null);
    try {
      const updateTaskFn = httpsCallable(functions, 'updateTask');
      const result = await updateTaskFn({ id: taskId, status });
      return result.data as { id: string; status: TaskStatus };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görev güncellenirken bir hata oluştu');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      const deleteTaskFn = httpsCallable(functions, 'deleteTask');
      await deleteTaskFn({ id: taskId });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görev silinirken bir hata oluştu');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const listTasks = async (status?: TaskStatus) => {
    setLoading(true);
    setError(null);
    try {
      const listTasksFn = httpsCallable(functions, 'listTasks');
      const result = await listTasksFn({ status });
      return result.data as Task[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görevler listelenirken bir hata oluştu');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTask,
    updateTaskStatus,
    deleteTask,
    listTasks,
  };
}; 