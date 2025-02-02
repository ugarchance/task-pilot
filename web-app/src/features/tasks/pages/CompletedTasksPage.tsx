'use client';

import { useState, useEffect } from 'react';
import { TaskBoard } from '@/features/tasks/components/board/TaskBoard';
import { Task, TaskStatus } from '@/features/tasks/types';
import { useTasks } from '@/features/tasks/hooks/useTasks';

const COMPLETED_COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'COMPLETED', title: 'Tamamlanan Görevler' },
];

export default function CompletedTasksPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const {
    tasks,
    loading,
    error,
    fetchCompletedTasks,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
  } = useTasks();

  // Sayfa yüklendiğinde tamamlanan görevleri getir
  useEffect(() => {
    fetchCompletedTasks();
  }, [fetchCompletedTasks]);

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
    await fetchCompletedTasks(); // Yeni görev oluşturulduktan sonra listeyi güncelle
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6 px-4">
        <h1 className="text-2xl font-semibold text-gray-900">Tamamlanan Görevler</h1>
        <p className="text-gray-600">Başarıyla tamamlanmış görevlerin listesi</p>
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
        columns={COMPLETED_COLUMNS}
        singleColumnMode
      />
    </div>
  );
} 