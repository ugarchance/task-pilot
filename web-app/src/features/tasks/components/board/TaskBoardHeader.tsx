import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { TaskStatus } from '../../types';
import { Task } from '../../types';
import { TaskBoardStats } from './TaskBoardStats';

interface TaskBoardHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: TaskStatus | 'ALL';
  onStatusFilterChange: (value: TaskStatus | 'ALL') => void;
  columns: { id: TaskStatus; title: string }[];
  hideFilters?: boolean;
  tasks: Task[];
}

export function TaskBoardHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  columns,
  hideFilters = false,
  tasks
}: TaskBoardHeaderProps) {
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
          <TaskBoardStats tasks={tasks} columns={columns} />
      </div>
   
    </div>
  );
} 