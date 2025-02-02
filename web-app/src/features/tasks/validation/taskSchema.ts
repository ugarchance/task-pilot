import { z } from 'zod';
import { TaskStatus } from '../types';

export const taskSchema = z.object({
  title: z.string()
    .min(1, 'Başlık boş olamaz')
    .max(100, 'Başlık 100 karakterden uzun olamaz'),
  description: z.string()
    .max(500, 'Açıklama 500 karakterden uzun olamaz')
    .optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const),
});

export type TaskFormData = z.infer<typeof taskSchema>; 