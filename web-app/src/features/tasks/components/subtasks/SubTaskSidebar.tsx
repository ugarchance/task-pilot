'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Progress } from '@/shared/components/ui/progress';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils/common';
import { Task, TaskStatus } from '@/features/tasks/types';
import { nanoid } from 'nanoid';
import { Textarea } from '@/shared/components/ui/textarea';
import { TaskModal } from '../modals/TaskModal';

interface SubTaskSidebarProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (subTasks: Task[]) => Promise<void>;
}

export function SubTaskSidebar({ task, isOpen, onClose, onUpdate }: SubTaskSidebarProps) {
  const [loading, setLoading] = useState(false);
  const [showAddSubTaskModal, setShowAddSubTaskModal] = useState(false);
  const [editingSubTask, setEditingSubTask] = useState<Task | undefined>(undefined);

  const completedCount = task.subTasks?.filter(st => st.status === 'COMPLETED').length || 0;
  const totalCount = task.subTasks?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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

    try {
      setLoading(true);
      await onUpdate([...(task.subTasks || []), newTask]);
      setShowAddSubTaskModal(false);
    } catch (error) {
      console.error('Alt görev eklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubTask = (subTask: Task) => {
    setEditingSubTask(subTask);
    setShowAddSubTaskModal(true);
  };

  const handleUpdateSubTask = async (data: { 
    title: string; 
    description: string; 
    prompt: string; 
    status: TaskStatus;
    tags: string[];
    subTasks: Task[];
    progress: { done: string[]; todo: string[] };
  }) => {
    if (!editingSubTask) return;

    const updatedSubTasks = task.subTasks?.map(st =>
      st.id === editingSubTask.id ? {
        ...editingSubTask,
        ...data,
        updatedAt: new Date().toISOString()
      } : st
    ) || [];

    try {
      setLoading(true);
      await onUpdate(updatedSubTasks);
      setShowAddSubTaskModal(false);
      setEditingSubTask(undefined);
    } catch (error) {
      console.error('Alt görev güncellenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubTask = async (id: string) => {
    const updatedSubTasks = task.subTasks?.filter(st => st.id !== id) || [];

    try {
      setLoading(true);
      await onUpdate(updatedSubTasks);
    } catch (error) {
      console.error('Alt görev silinirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50",
      "border-l border-gray-200",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-[#004e89]">Alt Görevler</h3>
          <span className="text-xs text-gray-500">({completedCount}/{totalCount})</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <span className="material-icons text-gray-500">close</span>
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 h-[calc(100vh-3.5rem)] overflow-y-auto">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>İlerleme</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Add new subtask button */}
        <Button
          onClick={() => {
            setEditingSubTask(undefined);
            setShowAddSubTaskModal(true);
          }}
          className="w-full h-9 bg-[#004e89] text-white flex items-center gap-2"
        >
          <span className="material-icons text-sm">add</span>
          Yeni Alt Görev Ekle
        </Button>

        {/* Subtasks list */}
        <div className="space-y-2">
          {task.subTasks?.map((subTask) => (
            <div
              key={subTask.id}
              className={cn(
                "group border rounded-lg p-3 hover:border-[#004e89]",
                "transition-colors duration-200"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate">{subTask.title}</h4>
                  {subTask.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{subTask.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {subTask.status}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleEditSubTask(subTask)}
                    >
                      <span className="material-icons text-sm text-blue-500">edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleDeleteSubTask(subTask.id)}
                    >
                      <span className="material-icons text-sm text-red-500">delete</span>
                    </Button>
                  </div>
                </div>
              </div>
              {subTask.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {subTask.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                <span className="text-xs text-gray-500">
                  Alt Görevler: {subTask.subTasks?.length || 0}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {(!task.subTasks || task.subTasks.length === 0) && (
          <div className="text-center py-8">
            <span className="material-icons text-4xl text-gray-300">task</span>
            <p className="mt-2 text-sm text-gray-500">Henüz alt görev eklenmemiş</p>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#004e89] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <TaskModal
        isOpen={showAddSubTaskModal}
        onClose={() => {
          setShowAddSubTaskModal(false);
          setEditingSubTask(undefined);
        }}
        onSubmit={editingSubTask ? handleUpdateSubTask : handleAddSubTask}
        task={editingSubTask}
        modalTitle={editingSubTask ? "Alt Görevi Düzenle" : "Yeni Alt Görev"}
        parentTask={task}
      />
    </div>
  );
} 