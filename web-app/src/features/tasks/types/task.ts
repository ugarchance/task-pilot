import { TASK_STATUSES } from './constants';

export type TaskStatus = typeof TASK_STATUSES[number];

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
  subTasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  progress: {
    done: string[];
    todo: string[];
  };
} 