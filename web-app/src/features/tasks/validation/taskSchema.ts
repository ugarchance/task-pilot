import { z } from 'zod';
import { TASK_STATUSES } from '@/features/tasks/types';

export const taskStatusEnum = z.enum(TASK_STATUSES);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur'),
  description: z.string(),
  status: taskStatusEnum.optional().default('PENDING'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur').optional(),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
});

export const updateTaskStatusSchema = z.object({
  status: taskStatusEnum,
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusFormData = z.infer<typeof updateTaskStatusSchema>; 