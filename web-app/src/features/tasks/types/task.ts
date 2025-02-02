import { TASK_STATUSES } from './constants';

export type TaskStatus = typeof TASK_STATUSES[number];

export type TaskStatusFilter = TaskStatus | 'ALL';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
} 