'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Card } from '@/shared/components/ui/card';
import { TaskColumnProps, getColumnColor, getColumnHeaderColor } from '@/features/tasks/types';
import { cn } from '@/shared/utils/common';

export function TaskColumnComponent({ column, onEditTask, onDeleteTask, singleColumnMode = false }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <Card className={cn(
      "flex flex-col shadow-sm h-[calc(95vh-9rem)]",
      getColumnColor(column.id, singleColumnMode)
    )}>
      <div className={cn(
        "py-1.5 px-2 border-b shrink-0",
        getColumnHeaderColor(column.id, singleColumnMode)
      )}>
        <div className="flex items-center justify-between">
          <h2 className={cn(
            "text-xs font-medium",
            singleColumnMode ? "text-[#004e89]" : "text-gray-700"
          )}>{column.title}</h2>
          <span className="text-[10px] font-medium text-gray-500 bg-white/50 px-1.5 py-0.5 rounded">
            {column.tasks.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-1.5 space-y-1.5 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300",
          singleColumnMode && "px-3"
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
          <div className="h-20 flex items-center justify-center border border-dashed border-gray-200 rounded-lg bg-white/50">
            <p className="text-[10px] text-gray-400">Bu kolonda görev yok</p>
          </div>
        )}
      </div>
    </Card>
  );
} 