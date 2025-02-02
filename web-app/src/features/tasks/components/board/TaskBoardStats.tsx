import { Task, TaskStatus } from '../../types';

interface TaskBoardStatsProps {
  tasks: Task[];
  columns: { id: TaskStatus; title: string }[];
}

const STATUS_COLORS = {
  PENDING: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    dot: 'bg-yellow-400',
  },
  IN_PROGRESS: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-400',
  },
  COMPLETED: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-400',
  },
  CANCELLED: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-400',
  },
};

export function TaskBoardStats({ tasks, columns }: TaskBoardStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      {columns.map(column => {
        const count = tasks.filter(t => t.status === column.id).length;
        const colors = STATUS_COLORS[column.id];
        
        return (
          <div
            key={column.id}
            className={`inline-flex items-center h-7 px-2.5 rounded-md ${colors.bg} transition-all duration-200 hover:shadow-sm`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            <span className={`ml-1.5 text-xs font-medium ${colors.text}`}>
              {column.title}
            </span>
            <span className={`ml-1.5 text-xs font-semibold ${colors.text}`}>
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
} 