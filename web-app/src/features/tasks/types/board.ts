import { Task, TaskStatus, TaskStatusFilter } from './task';

export interface TaskColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface DragEndResult {
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  };
}

export interface TaskBoardStatsProps {
  tasks: Task[];
  columns: { id: TaskStatus; title: string }[];
}

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
  singleColumnMode?: boolean;
}

export interface TaskColumnProps {
  column: TaskColumn;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => Promise<void>;
  singleColumnMode?: boolean;
}

export interface TaskBoardHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: TaskStatusFilter;
  onStatusFilterChange: (value: TaskStatusFilter) => void;
  selectedTag: string | null;
  onSelectedTagChange: (value: string | null) => void;
  columns: { id: TaskStatus; title: string }[];
  hideFilters?: boolean;
  tasks: Task[];
}

export interface TaskModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    title: string; 
    description: string; 
    prompt: string; 
    status: TaskStatus;
    tags: string[];
    subTasks: { id: string; title: string; completed: boolean }[];
    progress: { done: string[]; todo: string[] };
  }) => Promise<void>;
} 