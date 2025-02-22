'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Task, TaskStatus, STATUS_OPTIONS } from '@/features/tasks/types';
import { cn } from '@/shared/utils/common';
import { Badge } from '@/shared/components/ui/badge';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { nanoid } from 'nanoid';
import { SubTaskSidebar } from '@/features/tasks/components/subtasks/SubTaskSidebar';

type TaskStatusType = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface TaskModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    title: string; 
    description: string; 
    prompt: string; 
    status: TaskStatus;
    tags: string[];
    subTasks: Task[];
    progress: { done: string[]; todo: string[] };
  }) => Promise<void>;
  modalTitle?: string;
  parentTask?: Task;
}

export function TaskModal({ 
  task, 
  isOpen, 
  onClose, 
  onSubmit,
  modalTitle,
  parentTask 
}: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [prompt, setPrompt] = useState(task?.prompt || '');
  const [status, setStatus] = useState<TaskStatusType>(task?.status || 'PENDING');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [subTasks, setSubTasks] = useState<Task[]>(task?.subTasks || []);
  const [showAddSubTaskModal, setShowAddSubTaskModal] = useState(false);
  const [editingSubTask, setEditingSubTask] = useState<Task | undefined>(undefined);
  const [progress, setProgress] = useState<{ done: string[]; todo: string[] }>(task?.progress || { done: [], todo: [] });
  const [newProgressItem, setNewProgressItem] = useState({ type: 'todo' as 'done' | 'todo', text: '' });
  const [isSubTaskSidebarOpen, setIsSubTaskSidebarOpen] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPrompt(task.prompt);
      setStatus(task.status);
      setTags(task.tags || []);
      setSubTasks(task.subTasks || []);
      setProgress(task.progress || { done: [], todo: [] });
    } else {
      setTitle('');
      setDescription('');
      setPrompt('');
      setStatus('PENDING');
      setTags([]);
      setSubTasks([]);
      setProgress({ done: [], todo: [] });
    }
  }, [task]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ 
        title, 
        description, 
        prompt, 
        status,
        tags,
        subTasks,
        progress
      });
      onClose();
    } catch (error) {
      console.error('Görev güncellenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
      userId: task?.userId || '',
      title: data.title,
      description: data.description,
      prompt: data.prompt,
      status: data.status,
      createdAt: now,
      updatedAt: now,
      tags: data.tags,
      subTasks: data.subTasks,
      progress: data.progress,
      parentTaskId: task?.id,
      isSubTask: true
    };

    setSubTasks([...subTasks, newTask]);
    setShowAddSubTaskModal(false);
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

    const updatedSubTasks = subTasks.map(st =>
      st.id === editingSubTask.id ? {
        ...editingSubTask,
        ...data,
        updatedAt: new Date().toISOString()
      } : st
    );

    setSubTasks(updatedSubTasks);
    setShowAddSubTaskModal(false);
    setEditingSubTask(undefined);
  };

  const handleToggleSubTask = (id: string) => {
    setSubTasks(subTasks.map(st => 
      st.id === id ? { ...st, status: st.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' } : st
    ));
  };

  const handleRemoveSubTask = (id: string) => {
    setSubTasks(subTasks.filter(st => st.id !== id));
  };

  const handleAddProgressItem = () => {
    if (newProgressItem.text.trim()) {
      setProgress(prev => ({
        ...prev,
        [newProgressItem.type]: [...prev[newProgressItem.type], newProgressItem.text.trim()]
      }));
      setNewProgressItem({ ...newProgressItem, text: '' });
    }
  };

  const handleRemoveProgressItem = (type: 'done' | 'todo', text: string) => {
    setProgress(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== text)
    }));
  };

  const handleSubTasksUpdate = async (updatedSubTasks: Task[]) => {
    setSubTasks(updatedSubTasks);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#004e89]">
            {modalTitle || (task ? 'Görevi Düzenle' : 'Yeni Görev')}
            {parentTask && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({parentTask.title})
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsSubTaskSidebarOpen(true)}
            >
              <span className="material-icons text-gray-500">checklist</span>
            </Button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
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
              Etiketler
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge 
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500"
                  >
                    <span className="material-icons text-[14px]">close</span>
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Yeni etiket..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                size="sm"
              >
                Ekle
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt Görevler
            </label>
            <div className="space-y-2 mb-2">
              {subTasks.map(subTask => (
                <div key={subTask.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md group">
                  <Checkbox
                    checked={subTask.status === 'COMPLETED'}
                    onCheckedChange={() => handleToggleSubTask(subTask.id)}
                  />
                  <div className="flex-1">
                    <span className={cn(
                      "text-sm",
                      subTask.status === 'COMPLETED' && "line-through text-gray-500"
                    )}>
                      {subTask.title}
                    </span>
                    {subTask.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{subTask.description}</p>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                    <Button
                      type="button"
                      onClick={() => handleEditSubTask(subTask)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                    >
                      <span className="material-icons text-[14px] text-blue-500">edit</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleRemoveSubTask(subTask.id)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                    >
                      <span className="material-icons text-[14px] text-red-500">delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              onClick={() => {
                setEditingSubTask(undefined);
                setShowAddSubTaskModal(true);
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <span className="material-icons text-[14px] mr-1">add</span>
              Alt Görev Ekle
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İlerleme Durumu
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium text-green-700 mb-2">Yapılanlar</h4>
                <div className="space-y-2 mb-2">
                  {progress.done.map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-sm flex-1">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProgressItem('done', item)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <span className="material-icons text-[14px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-medium text-blue-700 mb-2">Yapılacaklar</h4>
                <div className="space-y-2 mb-2">
                  {progress.todo.map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-sm flex-1">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProgressItem('todo', item)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <span className="material-icons text-[14px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <select
                value={newProgressItem.type}
                onChange={(e) => setNewProgressItem({ ...newProgressItem, type: e.target.value as 'done' | 'todo' })}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="done">Yapılanlar</option>
                <option value="todo">Yapılacaklar</option>
              </select>
              <Input
                value={newProgressItem.text}
                onChange={(e) => setNewProgressItem({ ...newProgressItem, text: e.target.value })}
                placeholder="Yeni madde..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProgressItem())}
              />
              <Button
                type="button"
                onClick={handleAddProgressItem}
                variant="outline"
                size="sm"
              >
                Ekle
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Görev Promptu
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={cn(
                "w-full px-4 py-2 border border-gray-300 rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-[#004e89]",
                "transition-colors h-48"
              )}
              placeholder="Görev ile ilgili detaylı prompt bilgisini buraya girebilirsiniz..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durum
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatusType)}
              className={cn(
                "w-full px-4 py-2 border border-gray-300 rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-[#004e89]",
                "transition-colors"
              )}
            >
              {STATUS_OPTIONS.map((option: { value: TaskStatus; label: string }) => (
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

      <SubTaskSidebar
        task={{
          id: task?.id || '',
          userId: task?.userId || '',
          title: task?.title || '',
          description: task?.description || '',
          prompt: task?.prompt || '',
          status: task?.status || 'PENDING',
          subTasks: subTasks,
          tags: task?.tags || [],
          progress: task?.progress || { done: [], todo: [] },
          createdAt: task?.createdAt?.toString() || new Date().toString(),
          updatedAt: task?.updatedAt?.toString() || new Date().toString()
        }}
        isOpen={isSubTaskSidebarOpen}
        onClose={() => setIsSubTaskSidebarOpen(false)}
        onUpdate={handleSubTasksUpdate}
      />
    </div>
  );
} 