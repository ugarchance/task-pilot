'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Card } from '@/components/ui/card';
import { Task, TaskColumn } from '@/types/task';

interface TaskColumnProps {
  column: TaskColumn;
  onEditTask: (task: Task) => void;
}

export function TaskColumnComponent({ column, onEditTask }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <Card className="p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#004e89]">{column.title}</h2>
        <span className="text-sm text-gray-500">{column.tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className="space-y-3 min-h-[200px]"
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
            />
          ))}
        </SortableContext>

        {column.tasks.length === 0 && (
          <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-sm text-gray-400">Bu durumda görev bulunmuyor</p>
          </div>
        )}
      </div>
    </Card>
  );
} 