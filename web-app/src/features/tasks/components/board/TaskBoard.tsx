'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Task, TaskStatus, DEFAULT_COLUMNS } from '@/features/tasks/types';
import { TaskColumnComponent } from './TaskColumn';
import { Card } from '@/shared/components/ui/card';
import { TaskModal } from '../modals/TaskModal';
import { TaskBoardHeader } from './TaskBoardHeader';
import { TaskBoardStats } from './TaskBoardStats';
import { useTaskFilters } from '@/features/tasks/hooks/useTaskFilters';
import { useDragAndDrop } from '@/features/tasks/hooks/useDragAndDrop';
import { cn } from '@/shared/utils/common';
import { Button } from '@/shared/components/ui/button';

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
        <div className="container mx-auto py-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <TaskBoardHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                columns={columns}
                hideFilters={singleColumnMode}
                tasks={tasks}
              />
            </div>
            <Button
              onClick={() => onShowAddFormChange(true)}
              className="h-6 px-2 bg-[#004e89]/90 hover:bg-[#004e89] text-white text-xs font-medium rounded-md transition-all duration-200 hover:shadow-sm flex items-center gap-1 shrink-0"
              size="sm"
            >
              <span className="material-icons text-[12px]">add</span>
              Yeni Görev
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-3 bg-gray-50/50 relative min-h-0">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg shadow-lg">
              <div className="w-4 h-4 border-2 border-[#004e89] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-gray-600">Yükleniyor...</span>
            </div>
          </div>
        )}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className={cn(
            "grid gap-3 h-full min-h-0",
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
              <Card className="p-2 w-[220px] bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100">
                <h3 className="font-medium text-[#004e89] text-xs">{activeTask.title}</h3>
                <p className="text-xs text-gray-600 truncate mt-0.5">{activeTask.description}</p>
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