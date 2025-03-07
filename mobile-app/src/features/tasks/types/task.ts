export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type TaskStatusFilter = TaskStatus | 'ALL';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  prompt: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  subTasks: Task[];
  progress: {
    done: string[];
    todo: string[];
  };
  parentTaskId?: string;
  isSubTask?: boolean;
}