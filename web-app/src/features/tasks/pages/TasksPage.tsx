'use client';

import { useEffect, useState } from 'react';
import { TaskBoard } from '../components/board/TaskBoard';
import { useTasks } from '../hooks/useTasks';
import { TaskStatus } from '../types';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';
import { auth } from '@/core/firebase/config';

export default function TasksPage() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Kullanıcı oturum açmadığında doğrudan login sayfasına yönlendir
  useEffect(() => {
    if (!auth.currentUser) {
      router.push('/login');
    }
  }, [router]);
  
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
  } = useTasks();

  useEffect(() => {
    if (auth.currentUser) {
      fetchTasks();
    }
  }, [fetchTasks]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
        <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl text-center max-w-md w-full">
          <div className="text-red-500 text-xl font-semibold mb-4">{error}</div>
          <p className="text-gray-400 mb-6">
            Bu sayfayı görüntülemek için giriş yapmanız gerekmektedir.
          </p>
          <Button 
            onClick={() => router.push('/login')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Giriş Yap
          </Button>
        </div>
      </div>
    );
  }

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    await updateTaskStatus(taskId, newStatus);
  };

  const handleTaskUpdate = async (taskId: string, data: { title: string; description: string; prompt: string; status: TaskStatus }) => {
    await updateTask(taskId, data);
  };

  const handleTaskDelete = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleTaskCreate = async (data: { title: string; description: string; prompt: string }) => {
    await createTask(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <TaskBoard
          tasks={tasks}
          onTaskMove={handleTaskMove}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskCreate={handleTaskCreate}
          showAddForm={showAddForm}
          onShowAddFormChange={setShowAddForm}
          loading={loading}
        />
      </div>
    </div>
  );
} 