import { useCallback } from 'react';
import { Task, TaskStatus } from '../types';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import {
  fetchTasks,
  fetchActiveTasks,
  fetchCompletedTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
  clearError,
  startOptimisticUpdate,
  startOptimisticCreate,
  revertOptimisticCreate,
  startOptimisticDelete,
  revertOptimisticDelete,
} from '../store/taskSlice';
import { toast } from 'sonner';

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
  const dispatch = useAppDispatch();
  const { items: tasks, loading, error } = useAppSelector((state) => state.tasks);

  // Tüm görevleri getir
  const handleFetchTasks = useCallback(async () => {
    await dispatch(fetchTasks());
  }, [dispatch]);

  // Aktif görevleri getir
  const handleFetchActiveTasks = useCallback(async () => {
    await dispatch(fetchActiveTasks());
  }, [dispatch]);

  // Tamamlanmış görevleri getir
  const handleFetchCompletedTasks = useCallback(async () => {
    await dispatch(fetchCompletedTasks());
  }, [dispatch]);

  // Yeni görev oluştur (optimistik)
  const handleCreateTask = useCallback(async (data: { title: string; description: string }) => {
    // Yükleme toast'ını göster
    const toastId = toast.loading('Görev oluşturuluyor...', {
      duration: Infinity, // Sonsuz süre
    });

    try {
      // Geçici görev oluştur
      const tempTask: Task = {
        id: 'temp',
        title: data.title,
        description: data.description,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Optimistik güncelleme yap
      dispatch(startOptimisticCreate(tempTask));
      
      // API çağrısını yap
      await dispatch(createTask(data));

      // Başarılı durumunda yükleme toast'ını güncelle
      toast.success('Görev başarıyla oluşturuldu!', {
        id: toastId,
        duration: 2000,
        icon: '✅',
        description: `"${data.title}" görevi eklendi.`
      });
    } catch (error) {
      console.error('Görev oluşturulurken hata:', error);
      
      // Hata durumunda yükleme toast'ını güncelle
      toast.error('Görev oluşturulamadı!', {
        id: toastId,
        duration: 3000,
        icon: '❌',
        description: 'Bir hata oluştu, lütfen tekrar deneyin.'
      });
      
      // Hata durumunda optimistik güncellemeyi geri al
      dispatch(revertOptimisticCreate('temp'));
    }
  }, [dispatch]);

  // Görev durumunu güncelle (optimistik)
  const handleUpdateTaskStatus = useCallback(async (taskId: string, status: TaskStatus) => {
    try {
      // Önce optimistik güncelleme yap
      dispatch(startOptimisticUpdate({ taskId, status }));
      
      // Sonra API çağrısını yap
      await dispatch(updateTaskStatus({ taskId, status }));
    } catch (error) {
      // Hata durumunda slice içindeki rejected case otomatik olarak
      // optimistik güncellemeyi geri alacak
      console.error('Görev durumu güncellenirken hata:', error);
    }
  }, [dispatch]);

  // Görevi güncelle
  const handleUpdateTask = useCallback(async (
    taskId: string,
    data: { title: string; description: string; status: TaskStatus }
  ) => {
    await dispatch(updateTask({ taskId, data }));
  }, [dispatch]);

  // Görevi sil (optimistik)
  const handleDeleteTask = useCallback(async (taskId: string) => {
    // Yükleme toast'ını göster
    const toastId = toast.loading('Görev siliniyor...', {
      duration: Infinity,
    });

    try {
      // Önce optimistik silme yap
      dispatch(startOptimisticDelete({ taskId }));
      
      // Sonra API çağrısını yap
      await dispatch(deleteTask(taskId));

      // Başarılı durumunda toast'ı güncelle
      toast.success('Görev başarıyla silindi!', {
        id: toastId,
        duration: 2000,
        icon: '✅'
      });
    } catch (error) {
      console.error('Görev silinirken hata:', error);
      
      // Hata durumunda toast'ı güncelle
      toast.error('Görev silinemedi!', {
        id: toastId,
        duration: 3000,
        icon: '❌',
        description: 'Bir hata oluştu, lütfen tekrar deneyin.'
      });

      // Hata durumunda optimistik silmeyi geri al
      dispatch(revertOptimisticDelete({ taskId }));
    }
  }, [dispatch]);

  // Hata temizleme
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    tasks,
    loading,
    error,

    // Metodlar
    fetchTasks: handleFetchTasks,
    fetchActiveTasks: handleFetchActiveTasks,
    fetchCompletedTasks: handleFetchCompletedTasks,
    createTask: handleCreateTask,
    updateTaskStatus: handleUpdateTaskStatus,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,

    // Yardımcı metodlar
    clearError: handleClearError,
  };
} 