import { BookOpen, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import type { Summary } from '@/api/trainingApi';

interface StatsRowProps {
  summary: Summary | null;
  loading: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  accent: string;
  loading: boolean;
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor, accent, loading }: StatCardProps) {
  return (
    <div className={`bg-card border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow border-l-4 ${accent}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        {loading
          ? <div className="h-8 w-12 bg-muted animate-pulse rounded mb-1" />
          : <p className="text-3xl font-bold text-foreground font-mono leading-none">{value}</p>
        }
        <p className="text-xs text-muted-foreground mt-1 font-medium">{label}</p>
      </div>
    </div>
  );
}

export function StatsRow({ summary, loading }: StatsRowProps) {
  const s = summary?.stats;
  const stats: Omit<StatCardProps, 'loading'>[] = [
    { label: 'Total Training',  value: s?.total     ?? 0, icon: BookOpen,     iconBg: 'bg-primary/10', iconColor: 'text-primary',         accent: 'border-l-primary'     },
    { label: 'Need HRDC Grant', value: s?.need_hrdc ?? 0, icon: TrendingUp,   iconBg: 'bg-accent',     iconColor: 'text-accent-foreground', accent: 'border-l-accent-foreground' },
    { label: 'Pending',         value: s?.pending   ?? 0, icon: Clock,        iconBg: 'bg-amber-50',   iconColor: 'text-amber-600',       accent: 'border-l-amber-400'   },
    { label: 'Overdue',         value: s?.overdue   ?? 0, icon: AlertCircle,  iconBg: 'bg-red-50',     iconColor: 'text-red-600',         accent: 'border-l-red-400'     },
    { label: 'Completed',       value: s?.done      ?? 0, icon: CheckCircle2, iconBg: 'bg-green-50',   iconColor: 'text-green-600',       accent: 'border-l-green-400'   },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {stats.map(stat => <StatCard key={stat.label} {...stat} loading={loading} />)}
    </div>
  );
}
