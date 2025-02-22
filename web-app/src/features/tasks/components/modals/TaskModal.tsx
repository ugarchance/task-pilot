'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { TaskModalProps, STATUS_OPTIONS } from '@/features/tasks/types';
import { cn } from '@/shared/utils/common';
import { Badge } from '@/shared/components/ui/badge';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { nanoid } from 'nanoid';

type TaskStatusType = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export function TaskModal({ task, isOpen, onClose, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [prompt, setPrompt] = useState(task?.prompt || '');
  const [status, setStatus] = useState<TaskStatusType>(task?.status || 'PENDING');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [subTasks, setSubTasks] = useState<{ id: string; title: string; completed: boolean }[]>(task?.subTasks || []);
  const [newSubTask, setNewSubTask] = useState('');
  const [progress, setProgress] = useState<{ done: string[]; todo: string[] }>(task?.progress || { done: [], todo: [] });
  const [newProgressItem, setNewProgressItem] = useState({ type: 'todo' as 'done' | 'todo', text: '' });

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

  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks([...subTasks, { id: nanoid(), title: newSubTask.trim(), completed: false }]);
      setNewSubTask('');
    }
  };

  const handleToggleSubTask = (id: string) => {
    setSubTasks(subTasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleRemoveSubTask = (id: string) => {
    setSubTasks(subTasks.filter(task => task.id !== id));
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                <div key={subTask.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={subTask.completed}
                    onCheckedChange={() => handleToggleSubTask(subTask.id)}
                  />
                  <span className={cn(
                    "text-sm flex-1",
                    subTask.completed && "line-through text-gray-500"
                  )}>
                    {subTask.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubTask(subTask.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <span className="material-icons text-[14px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                placeholder="Yeni alt görev..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubTask())}
              />
              <Button
                type="button"
                onClick={handleAddSubTask}
                variant="outline"
                size="sm"
              >
                Ekle
              </Button>
            </div>
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