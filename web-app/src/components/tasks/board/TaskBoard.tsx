'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { Task, TaskStatus, TaskColumn } from '@/types/task';
import { TaskColumnComponent } from './TaskColumn';
import { Card } from '@/components/ui/card';
import { TaskModal } from '../modals/TaskModal';

interface TaskBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onTaskUpdate: (taskId: string, data: { title: string; description: string; status: TaskStatus }) => Promise<void>;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'PENDING', title: 'Beklemede' },
  { id: 'IN_PROGRESS', title: 'Devam Ediyor' },
  { id: 'COMPLETED', title: 'Tamamlandı' },
  { id: 'CANCELLED', title: 'İptal Edildi' },
];

export function TaskBoard({ tasks, onTaskMove, onTaskUpdate }: TaskBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const columns = COLUMNS.map((col) => ({
    ...col,
    tasks: tasks.filter((task) => task.status === col.id),
  }));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    const overId = over.id as TaskStatus;

    if (activeTask && activeTask.status !== overId) {
      await onTaskMove(activeTask.id, overId);
    }

    setActiveId(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (data: { title: string; description: string; status: TaskStatus }) => {
    if (editingTask) {
      await onTaskUpdate(editingTask.id, data);
      setEditingTask(null);
    }
  };

  const activeTask = activeId ? tasks.find((task) => task.id === activeId) : null;

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <TaskColumnComponent
              key={column.id}
              column={column}
              onEditTask={handleEditTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId && activeTask ? (
            <Card className="p-4 w-[300px] bg-white shadow-lg">
              <h3 className="font-semibold">{activeTask.title}</h3>
              <p className="text-sm text-gray-600 truncate">{activeTask.description}</p>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        task={editingTask || undefined}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
      />
    </>
  );
} 