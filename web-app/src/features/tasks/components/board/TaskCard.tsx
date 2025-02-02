'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Task } from '../../types';
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
} from "@/shared/components/ui/alert-dialog";
import { cn } from '@/shared/utils/common';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
  singleColumnMode?: boolean;
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

export function TaskCard({ task, onEdit, onDelete, singleColumnMode = false }: TaskCardProps) {
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
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (dateStr: string | Date) => {
    const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
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
        className={cn(
          "touch-manipulation",
          singleColumnMode ? "px-0 py-2" : "p-4",
          isDragging ? "opacity-50" : ""
        )}
        {...attributes}
        {...listeners}
      >
        <Card className={cn(
          "relative bg-white hover:shadow-md transition-shadow",
          singleColumnMode ? "p-4" : "p-3",
          isDragging ? "shadow-lg ring-2 ring-primary ring-offset-2" : ""
        )}>
          <div className="flex flex-col space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-medium flex-1",
                singleColumnMode ? "text-lg" : "text-sm"
              )}>{task.title}</h3>
              
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  STATUS_COLORS[task.status]
                )}>
                  {STATUS_LABELS[task.status]}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-gray-700"
                  onClick={() => onEdit(task)}
                >
                  <span className="material-icons text-base">edit</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-600"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <span className="material-icons text-base">delete</span>
                </Button>
              </div>
            </div>

            <p className={cn(
              "text-gray-600 line-clamp-2",
              singleColumnMode ? "text-base" : "text-sm"
            )}>{task.description}</p>
            
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