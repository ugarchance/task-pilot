import { useState, useEffect } from 'react';
import { Task, TaskStatusFilter } from '../types';

export function useTaskFilters(tasks: Task[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('ALL');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    let filtered = [...tasks];

    // Arama filtresi
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Durum filtresi
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Etiket filtresi
    if (selectedTag) {
      filtered = filtered.filter(task => task.tags?.includes(selectedTag));
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, statusFilter, selectedTag]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedTag,
    setSelectedTag,
    filteredTasks
  };
} 