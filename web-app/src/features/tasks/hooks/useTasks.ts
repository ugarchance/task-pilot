import { useState, useCallback } from 'react';
import { Task, TaskStatus } from '../types';
import { taskService } from '../services/taskService';

interface UseTasksReturn {
  // State
  tasks: Task[];
  loading: boolean;
  error: string | null;

  // Görev Yönetimi Metodları
  fetchTasks: () => Promise<void>;
  fetchActiveTasks: () => Promise<void>;
  fetchCompletedTasks: () => Promise<void>;
  createTask: (data: { title: string; description: string }) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  updateTask: (taskId: string, data: { title: string; description: string; status: TaskStatus }) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  
  // State Yönetimi
  clearError: () => void;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hata yönetimi için yardımcı fonksiyon
  const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
    setError(errorMessage);
    setLoading(false);
  };

  // Tüm görevleri getir
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskService.getAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Aktif görevleri getir
  const fetchActiveTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const activeTasks = await taskService.getActiveTasks();
      setTasks(activeTasks);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tamamlanmış görevleri getir
  const fetchCompletedTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const completedTasks = await taskService.getCompletedTasks();
      setTasks(completedTasks);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Yeni görev oluştur
  const createTask = useCallback(async (data: { title: string; description: string }) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await taskService.createTask(data);
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Görev durumunu güncelle
  const updateTaskStatus = useCallback(async (taskId: string, status: TaskStatus) => {
    try {
      setError(null);
      
      // Optimistik güncelleme
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === taskId ? { ...task, status } : task))
      );

      // API çağrısı
      const updatedTask = await taskService.updateTaskStatus(taskId, status);
      
      // API'den gelen güncel veriyle state'i güncelle
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      // Hata durumunda eski state'e geri dön
      const originalTask = tasks.find(task => task.id === taskId);
      if (originalTask) {
        setTasks(prevTasks =>
          prevTasks.map(task => (task.id === taskId ? originalTask : task))
        );
      }
      handleError(error);
    }
  }, [tasks]);

  // Görevi güncelle
  const updateTask = useCallback(async (
    taskId: string,
    data: { title: string; description: string; status: TaskStatus }
  ) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await taskService.updateTask(taskId, data);
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Görevi sil
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Hata temizleme
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    tasks,
    loading,
    error,

    // Metodlar
    fetchTasks,
    fetchActiveTasks,
    fetchCompletedTasks,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,

    // Yardımcı metodlar
    clearError,
  };
} 