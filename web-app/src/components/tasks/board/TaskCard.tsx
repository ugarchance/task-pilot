'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { forwardRef } from 'react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
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

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(task.id);
    } catch (error) {
      console.error('Görev silinirken hata oluştu:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
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
          className="p-4 transition-all duration-200 hover:shadow-lg hover:border-[#004e89] group"
          onClick={() => onEdit(task)}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center justify-between flex-1 pr-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
              >
                <h3 className="font-semibold text-[#004e89]">{task.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[task.status]}`}>
                  {STATUS_LABELS[task.status]}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                <span className="material-icons text-red-500/70 hover:text-red-600 text-[16px]">delete_outline</span>
              </Button>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Görevi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{task.title}&quot; görevini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? 'Siliniyor...' : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 