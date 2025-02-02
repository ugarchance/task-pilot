import { TaskStatus } from './task';

export const TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

export const DEFAULT_COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'PENDING', title: 'Beklemede' },
  { id: 'IN_PROGRESS', title: 'Devam Ediyor' },
  { id: 'COMPLETED', title: 'Tamamlandı' },
  { id: 'CANCELLED', title: 'İptal Edildi' },
];

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'PENDING', label: 'Beklemede' },
  { value: 'IN_PROGRESS', label: 'Devam Ediyor' },
  { value: 'COMPLETED', label: 'Tamamlandı' },
  { value: 'CANCELLED', label: 'İptal Edildi' },
];

export const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string; dot: string }> = {
  PENDING: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    dot: 'bg-yellow-400',
  },
  IN_PROGRESS: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-400',
  },
  COMPLETED: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-400',
  },
  CANCELLED: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-400',
  },
};

export const TASK_CARD_STATUS_COLORS: Record<TaskStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: 'Beklemede',
  IN_PROGRESS: 'Devam Ediyor',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
};

export const getColumnColor = (status: TaskStatus, singleColumnMode = false): string => {
  switch (status) {
    case 'PENDING':
      return 'border-t-2 border-t-yellow-400 bg-yellow-50/20';
    case 'IN_PROGRESS':
      return singleColumnMode 
        ? 'border-t-2 border-t-[#004e89] bg-blue-50/20' 
        : 'border-t-2 border-t-blue-400 bg-blue-50/20';
    case 'COMPLETED':
      return 'border-t-2 border-t-green-400 bg-green-50/20';
    case 'CANCELLED':
      return 'border-t-2 border-t-red-400 bg-red-50/20';
    default:
      return '';
  }
};

export const getColumnHeaderColor = (status: TaskStatus, singleColumnMode = false): string => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-50/50';
    case 'IN_PROGRESS':
      return singleColumnMode ? 'bg-[#004e89]/5' : 'bg-blue-50/50';
    case 'COMPLETED':
      return 'bg-green-50/50';
    case 'CANCELLED':
      return 'bg-red-50/50';
    default:
      return '';
  }
}; 