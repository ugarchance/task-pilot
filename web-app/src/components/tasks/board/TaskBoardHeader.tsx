import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TaskStatus } from '@/types/task';

interface TaskBoardHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: TaskStatus | 'ALL';
  onStatusFilterChange: (value: TaskStatus | 'ALL') => void;
  columns: { id: TaskStatus; title: string }[];
  onAddTask: () => void;
}

export function TaskBoardHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  columns,
  onAddTask
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
      </div>

      <Button
        onClick={onAddTask}
        className="h-7 px-2.5 bg-[#004e89]/90 hover:bg-[#004e89] text-white text-xs font-medium rounded-md transition-all duration-200 hover:shadow-sm flex items-center gap-1.5"
        size="sm"
      >
        <span className="material-icons text-[14px]">add</span>
        Yeni Görev
      </Button>
    </div>
  );
} 