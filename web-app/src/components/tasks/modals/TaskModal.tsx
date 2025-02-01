'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Task, TaskStatus } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; status: TaskStatus }) => Promise<void>;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'PENDING', label: 'Beklemede' },
  { value: 'IN_PROGRESS', label: 'Devam Ediyor' },
  { value: 'COMPLETED', label: 'Tamamlandı' },
  { value: 'CANCELLED', label: 'İptal Edildi' },
];

export function TaskModal({ task, isOpen, onClose, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'PENDING');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus('PENDING');
    }
  }, [task]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, description, status });
      onClose();
    } catch (error) {
      console.error('Görev güncellenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#004e89]">
            {task ? 'Görevi Düzenle' : 'Yeni Görev'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Görev Başlığı
            </label>
            <Input
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durum
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className={cn(
                "w-full px-4 py-2 border border-gray-300 rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-[#004e89]",
                "transition-colors"
              )}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#004e89] hover:bg-[#1a659e] text-white"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 