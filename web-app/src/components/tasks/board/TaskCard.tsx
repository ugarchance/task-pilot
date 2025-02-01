'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { forwardRef } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS = {
  PENDING: 'Beklemede',
  IN_PROGRESS: 'Devam Ediyor',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <Card 
        className="p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-[#004e89]"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(task);
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#004e89]">{task.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[task.status]}`}>
              {STATUS_LABELS[task.status]}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="material-icons text-sm">calendar_today</span>
              <span>{formatDate(task.createdAt)}</span>
            </div>
            {task.updatedAt && (
              <div className="flex items-center space-x-2">
                <span className="material-icons text-sm">update</span>
                <span>Güncellendi: {formatDate(task.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
} 