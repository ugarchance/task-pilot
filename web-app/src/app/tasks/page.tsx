'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TaskBoard } from '@/components/tasks/board/TaskBoard';
import { Task, TaskStatus } from '@/types/task';
import { TaskModal } from '@/components/tasks/modals/TaskModal';

export default function TasksPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/getTasks');
      if (!response.ok) {
        throw new Error('Görevler getirilemedi');
      }
      const data = await response.json();
      
      // Geçerli status değerleri
      const validStatuses: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
      
      // Firestore timestamp'ini Date'e çevirip, status değerlerini doğrulayalım
      const formattedTasks = data.map((task: any) => {
        // Status değerini kontrol et ve düzelt
        let status = task.status || 'PENDING';
        if (!validStatuses.includes(status)) {
          console.warn(`Geçersiz status değeri düzeltiliyor: ${status} -> PENDING`);
          status = 'PENDING';
        }

        return {
          ...task,
          status,
          createdAt: task.createdAt ? new Date(task.createdAt.seconds * 1000) : new Date(),
          updatedAt: task.updatedAt ? new Date(task.updatedAt.seconds * 1000) : undefined
        };
      });
      
      setTasks(formattedTasks);
    } catch (err) {
      setError('Görevler yüklenirken bir hata oluştu');
      console.error('Görevler yüklenirken hata:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (data: { title: string; description: string; status: TaskStatus }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/addTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Görev eklenemedi');
      }

      await fetchTasks();
      setShowAddForm(false);
    } catch (err) {
      setError('Görev eklenirken bir hata oluştu');
      console.error('Görev eklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    try {
      // Optimistik güncelleme
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;

      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);

      const response = await fetch('/api/updateTaskStatus', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, status: newStatus }),
      });

      if (!response.ok) {
        // Hata durumunda eski haline geri döndür
        setTasks(tasks);
        throw new Error('Görev durumu güncellenemedi');
      }

      // Başarılı durumda sunucudan güncel veriyi al
      await fetchTasks();
    } catch (err) {
      setError('Görev durumu güncellenirken bir hata oluştu');
      console.error('Görev durumu güncellenirken hata:', err);
    }
  };

  const handleTaskUpdate = async (taskId: string, data: { title: string; description: string; status: TaskStatus }) => {
    try {
      const response = await fetch('/api/updateTask', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, ...data }),
      });

      if (!response.ok) {
        throw new Error('Görev güncellenemedi');
      }

      await fetchTasks();
    } catch (err) {
      setError('Görev güncellenirken bir hata oluştu');
      console.error('Görev güncellenirken hata:', err);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Görev Tahtası */}
      <div className="flex-1">
        <TaskBoard 
          tasks={tasks} 
          onTaskMove={handleTaskMove} 
          onTaskUpdate={handleTaskUpdate}
          showAddForm={showAddForm}
          onShowAddFormChange={setShowAddForm}
        />
      </div>

      {/* Yeni Görev Ekleme Modalı */}
      <TaskModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTask}
      />
    </div>
  );
} 