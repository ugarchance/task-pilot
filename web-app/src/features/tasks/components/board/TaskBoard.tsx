'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Task, TaskStatus } from '@/features/tasks/types';
import { TaskColumnComponent } from './TaskColumn';
import { Card } from '@/shared/components/ui/card';
import { TaskModal } from '../modals/TaskModal';
import { TaskBoardHeader } from './TaskBoardHeader';
import { TaskBoardStats } from './TaskBoardStats';
import { useTaskFilters } from '@/features/tasks/hooks/useTaskFilters';
import { useDragAndDrop } from '@/features/tasks/hooks/useDragAndDrop';
import { cn } from '@/shared/utils/common';

interface TaskBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onTaskUpdate: (taskId: string, data: { title: string; description: string; status: TaskStatus }) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
  onTaskCreate: (data: { title: string; description: string }) => Promise<void>;
  showAddForm: boolean;
  onShowAddFormChange: (show: boolean) => void;
  loading?: boolean;
  columns?: { id: TaskStatus; title: string }[];
  singleColumnMode?: boolean;
}

const DEFAULT_COLUMNS: { id: TaskStatus; title: string }[] = [
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
  onTaskCreate,
  showAddForm, 
  onShowAddFormChange,
  loading = false,
  columns = DEFAULT_COLUMNS,
  singleColumnMode = false
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

  const columnsWithTasks = columns.map((col) => ({
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
    } else {
      await onTaskCreate({ title: data.title, description: data.description });
      onShowAddFormChange(false);
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
            columns={columns}
            onAddTask={() => onShowAddFormChange(true)}
            hideFilters={singleColumnMode}
          />
          <TaskBoardStats tasks={tasks} columns={columns} />
        </div>
      </div>

      <div className="flex-1 p-4 bg-gray-50/50 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-lg">
              <div className="w-5 h-5 border-2 border-[#004e89] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">Yükleniyor...</span>
            </div>
          </div>
        )}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className={cn(
            "grid gap-4 h-full",
            singleColumnMode ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          )}>
            {columnsWithTasks.map((column) => (
              <TaskColumnComponent
                key={column.id}
                column={column}
                onEditTask={handleEditTask}
                onDeleteTask={onTaskDelete}
                singleColumnMode={singleColumnMode}
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