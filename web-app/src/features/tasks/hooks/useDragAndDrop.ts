import { useState, useRef } from 'react';
import { DragEndEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Task, TaskStatus } from '../types';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { startOptimisticUpdate, revertOptimisticUpdate } from '../store/taskSlice';
import { toast } from 'sonner';

export function useDragAndDrop(
  tasks: Task[],
  onTaskMove: (taskId: string, newStatus: TaskStatus) => Promise<void>
) {
  const dispatch = useAppDispatch();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveTask(tasks.find((task) => task.id === active.id) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      const validStatuses: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

      // Önce optimistik güncelleme yap
      dispatch(startOptimisticUpdate({ taskId, status: newStatus }));

      // Geçersiz durum kontrolü
      if (!validStatuses.includes(newStatus)) {
        // Sessizce eski haline döndür
        dispatch(revertOptimisticUpdate(taskId));
        return;
      }

      // Arka planda API çağrısını yap
      onTaskMove(taskId, newStatus).catch((error) => {
        console.error('Görev durumu güncellenirken hata:', error);
        toast.error('Durum güncellenemedi!', {
          description: 'Bir hata oluştu, lütfen tekrar deneyin.'
        });
      });
    }

    setActiveId(null);
    setActiveTask(null);
  };

  return {
    sensors,
    activeId,
    activeTask,
    handleDragStart,
    handleDragEnd
  };
} 