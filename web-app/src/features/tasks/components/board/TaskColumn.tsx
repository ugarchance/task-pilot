'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Card } from '@/shared/components/ui/card';
import { Task, TaskStatus } from '../../types';
import { cn } from '@/shared/utils/common';

interface TaskColumnProps {
  column: {
    id: TaskStatus;
    title: string;
    tasks: Task[];
  };
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => Promise<void>;
  singleColumnMode?: boolean;
}

export function TaskColumnComponent({ column, onEditTask, onDeleteTask, singleColumnMode = false }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case 'PENDING':
        return 'border-t-2 border-t-yellow-400 bg-yellow-50/20';
      case 'IN_PROGRESS':
        return singleColumnMode 
          ? 'border-t-2 border-t-[#004e89] bg-blue-50/20' 
          : 'border-t-2 border-t-blue-400 bg-blue-50/20';
      case 'COMPLETED':
        return 'border-t-2 border-t-green-400 bg-green-50/20';
      case 'CANCELLED':
        return 'border-t-2 border-t-red-400 bg-red-50/20';
      default:
        return '';
    }
  };

  const getColumnHeaderColor = (status: TaskStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50/50';
      case 'IN_PROGRESS':
        return singleColumnMode ? 'bg-[#004e89]/5' : 'bg-blue-50/50';
      case 'COMPLETED':
        return 'bg-green-50/50';
      case 'CANCELLED':
        return 'bg-red-50/50';
      default:
        return '';
    }
  };

  return (
    <Card className={cn(
      "flex flex-col shadow-sm",
      singleColumnMode ? "h-[calc(100vh-16rem)]" : "h-[calc(100vh-12rem)]",
      getColumnColor(column.id)
    )}>
      <div className={cn(
        "py-2 px-3 border-b",
        getColumnHeaderColor(column.id)
      )}>
        <div className="flex items-center justify-between">
          <h2 className={cn(
            "text-sm font-medium",
            singleColumnMode ? "text-[#004e89]" : "text-gray-700"
          )}>{column.title}</h2>
          <span className="text-xs font-medium text-gray-500 bg-white/50 px-2 py-0.5 rounded">
            {column.tasks.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-2 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300",
          singleColumnMode && "px-4"
        )}
      >
        <SortableContext
          items={column.tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              singleColumnMode={singleColumnMode}
            />
          ))}
        </SortableContext>

        {column.tasks.length === 0 && (
          <div className="h-24 flex items-center justify-center border border-dashed border-gray-200 rounded-lg bg-white/50">
            <p className="text-xs text-gray-400">Bu kolonda görev yok</p>
          </div>
        )}
      </div>
    </Card>
  );
} 