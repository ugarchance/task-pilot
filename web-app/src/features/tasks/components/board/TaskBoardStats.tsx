import { TaskBoardStatsProps, STATUS_COLORS } from '@/features/tasks/types';

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