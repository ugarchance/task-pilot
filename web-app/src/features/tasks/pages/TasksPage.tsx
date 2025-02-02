'use client';

import { useEffect, useState } from 'react';
import { TaskBoard } from '../components/board/TaskBoard';
import { useTasks } from '../hooks/useTasks';
import { TaskStatus } from '../types';

export default function TasksPage() {
  const [showAddForm, setShowAddForm] = useState(false);
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
    fetchTasks();
  }, [fetchTasks]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
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

  const handleTaskUpdate = async (taskId: string, data: { title: string; description: string; status: TaskStatus }) => {
    await updateTask(taskId, data);
  };

  const handleTaskDelete = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleTaskCreate = async (data: { title: string; description: string }) => {
    await createTask(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tüm Görevler</h1>
        <p className="text-gray-600">Görevlerinizi yönetin ve organize edin</p>
      </div>

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
  );
} 