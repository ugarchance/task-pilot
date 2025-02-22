'use client';

import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Tooltip,TooltipProvider,TooltipTrigger,TooltipContent } from '@/shared/components/ui/tooltip';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Input } from '@/shared/components/ui/input';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { nanoid } from 'nanoid';
import { TaskModal } from '../modals/TaskModal';

import { Task, TaskStatus, TaskCardProps, TASK_CARD_STATUS_COLORS, STATUS_LABELS } from '@/features/tasks/types';
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

export function TaskCard({ task, onEdit, onDelete, singleColumnMode = false }: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formattedCreatedAt, setFormattedCreatedAt] = useState<string>('');
  const [formattedUpdatedAt, setFormattedUpdatedAt] = useState<string>('');
  const [isSubTasksExpanded, setIsSubTasksExpanded] = useState(false);
  const [showAddSubTaskModal, setShowAddSubTaskModal] = useState(false);

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    // Client-side'da tarih formatlaması yap
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    setFormattedCreatedAt(formatDate(task.createdAt));
    if (task.updatedAt) {
      setFormattedUpdatedAt(formatDate(task.updatedAt));
    }
  }, [task.createdAt, task.updatedAt]);

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

  const handleAddSubTask = async (data: { 
    title: string; 
    description: string; 
    prompt: string; 
    status: TaskStatus;
    tags: string[];
    subTasks: Task[];
    progress: { done: string[]; todo: string[] };
  }) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: nanoid(),
      userId: task.userId,
      title: data.title,
      description: data.description,
      prompt: data.prompt,
      status: data.status,
      createdAt: now,
      updatedAt: now,
      tags: data.tags,
      subTasks: data.subTasks,
      progress: data.progress,
      parentTaskId: task.id,
      isSubTask: true
    };

    onEdit({
      ...task,
      subTasks: [...(task.subTasks || []), newTask]
    });

    setShowAddSubTaskModal(false);
  };

  const handleToggleSubTask = (subTaskId: string) => {
    const updatedSubTasks = task.subTasks?.map(st =>
      st.id === subTaskId ? { ...st, status: st.status === 'COMPLETED' ? ('PENDING' as TaskStatus) : ('COMPLETED' as TaskStatus) } : st
    ) || [];

    onEdit({
      ...task,
      subTasks: updatedSubTasks
    });
  };

  const handleEditSubTask = (subTaskId: string) => {
    const subTask = task.subTasks?.find(st => st.id === subTaskId);
    if (subTask) {
      setShowAddSubTaskModal(true);
    }
  };

  const handleDeleteSubTask = (subTaskId: string) => {
    const updatedSubTasks = task.subTasks?.filter(st => st.id !== subTaskId) || [];

    onEdit({
      ...task,
      subTasks: updatedSubTasks
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = task.subTasks?.findIndex((t) => t.id === active.id);
      const newIndex = task.subTasks?.findIndex((t) => t.id === over.id);

      if (oldIndex !== undefined && newIndex !== undefined && task.subTasks) {
        const newSubTasks = [...task.subTasks];
        const [movedItem] = newSubTasks.splice(oldIndex, 1);
        newSubTasks.splice(newIndex, 0, movedItem);

        onEdit({
          ...task,
          subTasks: newSubTasks
        });
      }
    }
  };

  const completedSubTasks = task.subTasks?.filter(st => st.status === 'COMPLETED').length || 0;
  const totalSubTasks = task.subTasks?.length || 0;
  const subTaskProgress = totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;

  const totalProgressItems = (task.progress?.done?.length || 0) + (task.progress?.todo?.length || 0);
  const completedProgressItems = task.progress?.done?.length || 0;
  const progressPercentage = totalProgressItems > 0 ? (completedProgressItems / totalProgressItems) * 100 : 0;

  const SubTaskItem = ({ subTask }: { subTask: Task }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: subTask.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const handleSubTaskEdit = (updatedSubTask: Task) => {
      const updatedSubTasks = task.subTasks?.map(st =>
        st.id === updatedSubTask.id ? updatedSubTask : st
      ) || [];

      onEdit({
        ...task,
        subTasks: updatedSubTasks
      });
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-2 group touch-manipulation"
      >
        <div {...attributes} {...listeners} className="cursor-move">
          <span className="material-icons text-[12px] text-gray-400">drag_indicator</span>
        </div>
        <Checkbox
          checked={subTask.status === 'COMPLETED'}
          onCheckedChange={() => handleToggleSubTask(subTask.id)}
          className="h-3 w-3"
        />
        <span className={cn(
          "text-[10px] flex-1",
          subTask.status === 'COMPLETED' && "line-through text-gray-500"
        )}>
          {subTask.title}
        </span>
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(subTask);
            }}
            size="sm"
            variant="ghost"
            className="h-5 w-5 p-0 hover:bg-gray-100"
          >
            <span className="material-icons text-[12px] text-blue-500">edit</span>
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSubTask(subTask.id);
            }}
            size="sm"
            variant="ghost"
            className="h-5 w-5 p-0 hover:bg-gray-100"
          >
            <span className="material-icons text-[12px] text-red-500">delete</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "touch-manipulation",
          singleColumnMode ? "px-0 py-1.5" : "p-3",
          isDragging ? "opacity-50" : ""
        )}
        {...attributes}
        {...listeners}
      >
        <Card className={cn(
          "relative bg-white hover:shadow-md transition-shadow",
          singleColumnMode ? "p-3" : "p-2",
          isDragging ? "shadow-lg ring-2 ring-primary ring-offset-2" : ""
        )}>
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-start justify-between gap-1.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className={cn(
                      "font-medium flex-1 break-words min-w-0 cursor-help",
                      singleColumnMode ? "text-base" : "text-xs"
                    )}>{task.title}</h3>
                  </TooltipTrigger>
                  {task.prompt && (
                    <TooltipContent side="bottom" align="start" className="max-w-[300px] whitespace-pre-wrap bg-gray-900 text-gray-50 px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-medium text-gray-200">Görev Promptu:</p>
                        <p className="text-xs">{task.prompt}</p>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              
              <div className="flex items-center gap-1 shrink-0">
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap",
                  TASK_CARD_STATUS_COLORS[task.status]
                )}>
                  {STATUS_LABELS[task.status]}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-500 hover:text-gray-700 shrink-0"
                  onClick={() => onEdit(task)}
                >
                  <span className="material-icons text-sm">edit</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-500 hover:text-red-600 shrink-0"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <span className="material-icons text-sm">delete</span>
                </Button>
              </div>
            </div>

            <p className={cn(
              "text-gray-600 line-clamp-2",
              singleColumnMode ? "text-sm" : "text-[10px]"
            )}>{task.description}</p>

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {task.tags.map(tag => (
                  <Badge 
                    key={tag}
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {task.subTasks && task.subTasks.length > 0 && (
              <div className="mt-2 space-y-2">
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors"
                  onClick={() => setIsSubTasksExpanded(!isSubTasksExpanded)}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-[14px] text-gray-500">
                      {isSubTasksExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                    <span className="text-[10px] text-gray-500">Alt Görevler</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{completedSubTasks}/{totalSubTasks}</span>
                </div>

                <Progress value={subTaskProgress} className="h-1" />

                {isSubTasksExpanded && (
                  <div className="space-y-1 pt-1">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={task.subTasks?.map(st => st.id) || []}
                        strategy={verticalListSortingStrategy}
                      >
                        {task.subTasks?.map((subTask) => (
                          <SubTaskItem key={subTask.id} subTask={subTask} />
                        ))}
                      </SortableContext>
                    </DndContext>
                    
                    <Button
                      onClick={() => setShowAddSubTaskModal(true)}
                      variant="ghost"
                      size="sm"
                      className="w-full h-6 text-[10px]"
                    >
                      <span className="material-icons text-[14px] mr-1">add</span>
                      Alt Görev Ekle
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!task.subTasks?.length && (
              <Button
                onClick={() => {
                  setIsSubTasksExpanded(true);
                  setShowAddSubTaskModal(true);
                }}
                variant="ghost"
                size="sm"
                className="w-full h-6 mt-2 text-[10px]"
              >
                <span className="material-icons text-[14px] mr-1">add</span>
                Alt Görev Ekle
              </Button>
            )}

            {totalProgressItems > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-500">İlerleme</span>
                  <span className="text-[10px] text-gray-500">{completedProgressItems}/{totalProgressItems}</span>
                </div>
                <Progress value={progressPercentage} className="h-1" />
              </div>
            )}
            
            <div className="flex items-center justify-between text-[10px] text-gray-500">
              <div className="flex items-center space-x-1">
                <span className="material-icons text-xs">calendar_today</span>
                <span>{formattedCreatedAt}</span>
              </div>
              {formattedUpdatedAt && (
                <div className="flex items-center space-x-1">
                  <span className="material-icons text-xs">update</span>
                  <span>Güncellendi: {formattedUpdatedAt}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <TaskModal
        isOpen={showAddSubTaskModal}
        onClose={() => setShowAddSubTaskModal(false)}
        onSubmit={handleAddSubTask}
        modalTitle="Yeni Alt Görev"
        parentTask={task}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[320px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">Görevi Sil</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              &quot;{task.title}&quot; görevini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="text-xs h-8">İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white text-xs h-8"
            >
              {isDeleting ? 'Siliniyor...' : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 