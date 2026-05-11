// Route Paths
export const ROUTE_PATHS = {
  HOME: '/',
};

// Types
export interface TrainingItem {
  id: number;
  title: string;
  date: string;
  dueGrant: string;
  pic: string;
  status: 'overdue' | 'pending' | 'done';
  needHrdc: boolean;
  department: string;
  vendor: string;
  pax: number;
  cost: number;
}

export interface HrdcStatus {
  approved: number;
  pending: number;
  rejected: number;
}

export interface MonthlyData {
  month: string;
  count: number;
}

export type StatusType = 'overdue' | 'pending' | 'done';

export const STATUS_CONFIG: Record<StatusType, { label: string; emoji: string; bgClass: string; textClass: string }> = {
  overdue: {
    label: 'OVERDUE',
    emoji: '🔴',
    bgClass: 'bg-red-100',
    textClass: 'text-red-700',
  },
  pending: {
    label: 'PENDING',
    emoji: '🟡',
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-700',
  },
  done: {
    label: 'DONE',
    emoji: '🟢',
    bgClass: 'bg-green-100',
    textClass: 'text-green-700',
  },
};
