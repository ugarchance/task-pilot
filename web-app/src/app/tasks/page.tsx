'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TaskBoard } from '@/components/tasks/board/TaskBoard';
import { Task, TaskStatus } from '@/types/task';

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
      
      // Firestore timestamp'ini Date'e çevirip, varsayılan status ekleyelim
      const formattedTasks = data.map((task: any) => ({
        ...task,
        status: task.status || 'PENDING',
        createdAt: task.createdAt ? new Date(task.createdAt.seconds * 1000) : new Date(),
        updatedAt: task.updatedAt ? new Date(task.updatedAt.seconds * 1000) : undefined
      }));
      
      setTasks(formattedTasks);
    } catch (err) {
      setError('Görevler yüklenirken bir hata oluştu');
      console.error('Görevler yüklenirken hata:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/addTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          description,
          status: 'PENDING' as TaskStatus 
        }),
      });

      if (!response.ok) {
        throw new Error('Görev eklenemedi');
      }

      await fetchTasks();
      setTitle('');
      setDescription('');
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
      const response = await fetch('/api/updateTaskStatus', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Görev durumu güncellenemedi');
      }

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
    <div className="space-y-6">
      {/* Üst Başlık ve Butonlar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#004e89]">Görevler</h2>
          <p className="text-gray-600">Toplam {tasks.length} görev</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#ff6b35] hover:bg-[#f7c59f] text-white"
        >
          {showAddForm ? 'İptal' : 'Yeni Görev'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Görev Ekleme Formu */}
      {showAddForm && (
        <Card className="p-6 bg-white shadow-lg">
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Görev Başlığı
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Görev Açıklaması
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={cn(
                  "w-full px-4 py-2 border border-gray-300 rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-[#004e89]",
                  "transition-colors h-32"
                )}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                İptal
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-[#004e89] hover:bg-[#1a659e] text-white"
              >
                {loading ? 'Ekleniyor...' : 'Kaydet'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Görev Tahtası */}
      <TaskBoard 
        tasks={tasks} 
        onTaskMove={handleTaskMove} 
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
} 