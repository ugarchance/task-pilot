import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { TaskBoardHeaderProps } from '@/features/tasks/types';
import { TaskBoardStats } from './TaskBoardStats';
import { Badge } from '@/shared/components/ui/badge';
import { useEffect, useState } from 'react';
import { taskService } from '@/features/tasks/services/taskService';

export function TaskBoardHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  columns,
  hideFilters = false,
  tasks
}: TaskBoardHeaderProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      const tags = await taskService.getAllTags();
      setAvailableTags(tags);
    };
    loadTags();
  }, [tasks]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Input
          placeholder="Görevlerde ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full md:w-[240px] h-7 text-sm"
        />
        {!hideFilters && (
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[130px] h-7 text-sm">
              <SelectValue placeholder="Filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tümü</SelectItem>
              {columns.map(col => (
                <SelectItem key={col.id} value={col.id}>{col.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <TaskBoardStats tasks={tasks} columns={columns} />
    </div>
  );
} 