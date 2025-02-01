'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Task, TaskStatus } from '@/types/task';
import { TaskColumnComponent } from './TaskColumn';
import { Card } from '@/components/ui/card';
import { TaskModal } from '../modals/TaskModal';
import { TaskBoardHeader } from './TaskBoardHeader';
import { TaskBoardStats } from './TaskBoardStats';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

interface TaskBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onTaskUpdate: (taskId: string, data: { title: string; description: string; status: TaskStatus }) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
  showAddForm: boolean;
  onShowAddFormChange: (show: boolean) => void;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'PENDING', title: 'Beklemede' },
  { id: 'IN_PROGRESS', title: 'Devam Ediyor' },
  { id: 'COMPLETED', title: 'Tamamlandı' },
  { id: 'CANCELLED', title: 'İptal Edildi' },
];

export function TaskBoard({ 
  tasks, 
  onTaskMove, 
  onTaskUpdate, 
  onTaskDelete,
  showAddForm, 
  onShowAddFormChange 
}: TaskBoardProps) {
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const { 
    searchQuery, 
    setSearchQuery, 
    statusFilter, 
    setStatusFilter,
    filteredTasks 
  } = useTaskFilters(tasks);

  const {
    sensors,
    activeId,
    activeTask,
    handleDragStart,
    handleDragEnd
  } = useDragAndDrop(tasks, onTaskMove);

  const columns = COLUMNS.map((col) => ({
    ...col,
    tasks: filteredTasks.filter((task) => task.status === col.id),
  }));

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (data: { title: string; description: string; status: TaskStatus }) => {
    if (editingTask) {
      await onTaskUpdate(editingTask.id, data);
      setEditingTask(undefined);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="container mx-auto py-3">
          <TaskBoardHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            columns={COLUMNS}
            onAddTask={() => onShowAddFormChange(true)}
          />
          <TaskBoardStats tasks={tasks} columns={COLUMNS} />
        </div>
      </div>

      <div className="flex-1 p-4 bg-gray-50/50">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            {columns.map((column) => (
              <TaskColumnComponent
                key={column.id}
                column={column}
                onEditTask={handleEditTask}
                onDeleteTask={onTaskDelete}
              />
            ))}
          </div>

          <DragOverlay>
            {activeId && activeTask ? (
              <Card className="p-2.5 w-[260px] bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100">
                <h3 className="font-medium text-[#004e89] text-sm">{activeTask.title}</h3>
                <p className="text-xs text-gray-600 truncate mt-1">{activeTask.description}</p>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskModal
        isOpen={!!editingTask || showAddForm}
        onClose={() => {
          setEditingTask(undefined);
          onShowAddFormChange(false);
        }}
        task={editingTask}
        onSubmit={handleUpdateTask}
      />
    </div>
  );
} 