import { useState } from 'react';
import { DragEndEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Task, TaskStatus } from '../types';

export function useDragAndDrop(
  tasks: Task[],
  onTaskMove: (taskId: string, newStatus: TaskStatus) => Promise<void>
) {
  const [activeId, setActiveId] = useState<string | null>(null);

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

  const activeTask = activeId ? tasks.find((task) => task.id === activeId) : null;

  return {
    sensors,
    activeId,
    activeTask,
    handleDragStart,
    handleDragEnd
  };
} 