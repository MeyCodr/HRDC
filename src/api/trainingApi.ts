// Dev: VITE_API_URL=http://localhost:3002 (cross-origin, Vite on 8080 / API on 3002)
// Prod: VITE_API_URL=''  (same-origin, Express serves both on port 3002)
const BASE = import.meta.env.VITE_API_URL ?? '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'API error');
  }
  return json as T;
}

// ── Types ─────────────────────────────────────────────────────
export interface TrainingRecord {
  id: number;
  title: string;
  department: string;
  training_date: string;   // dd/mm/yyyy
  due_grant_date: string;  // dd/mm/yyyy  ← auto from DB
  cost: number;
  pic: string;
  need_hrdc: number;
  status: 'pending' | 'overdue' | 'done';
  vendor: string | null;
  pax: number;
  notes: string | null;
}

export interface TrainingFormData {
  title: string;
  department: string;
  training_date: string;   // YYYY-MM-DD for input[type=date]
  cost: number;
  pic: string;
  need_hrdc: number;
  status?: 'pending' | 'overdue' | 'done';
  vendor?: string;
  pax?: number;
  notes?: string;
}

export interface Summary {
  stats: { total: number; need_hrdc: number; pending: number; overdue: number; done: number };
  monthly: { month: string; month_num: number; count: number }[];
  hrdc: { approved: number; pending: number; rejected: number };
}

// ── API calls ─────────────────────────────────────────────────
export const api = {
  getTrainings:  ()                          => request<{ success: boolean; data: TrainingRecord[] }>('/api/trainings'),
  getSummary:    ()                          => request<Summary & { success: boolean }>('/api/trainings/summary'),
  getDepartments: ()                         => request<{ success: boolean; data: string[] }>('/api/departments'),
  createTraining: (body: TrainingFormData)   => request<{ success: boolean; data: TrainingRecord }>('/api/trainings', { method: 'POST',   body: JSON.stringify(body) }),
  updateTraining: (id: number, body: Partial<TrainingFormData>) =>
                                               request<{ success: boolean; data: TrainingRecord }>(`/api/trainings/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteTraining: (id: number)               => request<{ success: boolean }>(`/api/trainings/${id}`, { method: 'DELETE' }),
};
