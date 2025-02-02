import { useState, useMemo } from 'react';
import { Task, TaskStatus } from '../types';

export function useTaskFilters(tasks: Task[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const title = task.title || '';
      const description = task.description || '';

      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredTasks
  };
} 