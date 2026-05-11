import type { TrainingRecord } from '@/api/trainingApi';
import { STATUS_CONFIG, type StatusType } from '@/lib/index';

interface UpcomingTrainingTableProps {
  trainings: TrainingRecord[];
  loading: boolean;
}

// Upcoming = next 30 days from today
function isUpcoming(dateStr: string) {
  if (!dateStr) return false;
  const [d, m, y] = dateStr.split('/');
  const date  = new Date(`${y}-${m}-${d}`);
  const today = new Date();
  const plus30 = new Date(); plus30.setDate(today.getDate() + 30);
  return date >= today && date <= plus30;
}

export function UpcomingTrainingTable({ trainings, loading }: UpcomingTrainingTableProps) {
  const upcoming = trainings.filter(t => isUpcoming(t.training_date));

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Upcoming Training</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Next 30 days</p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 bg-primary/10 text-primary rounded-full">
          {loading ? '...' : `${upcoming.length} trainings`}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Training Title</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Due Grant</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">PIC</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5"><div className="h-4 bg-muted animate-pulse rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              : upcoming.length === 0
                ? <tr><td colSpan={5} className="text-center py-10 text-sm text-muted-foreground">No upcoming trainings in the next 30 days.</td></tr>
                : upcoming.map((item, idx) => {
                    const cfg = STATUS_CONFIG[item.status as StatusType];
                    return (
                      <tr key={item.id} className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors ${idx % 2 === 0 ? 'bg-card' : 'bg-background'}`}>
                        <td className="px-5 py-3.5 font-medium text-foreground">{item.title}</td>
                        <td className="px-4 py-3.5 text-muted-foreground font-mono text-xs">{item.training_date}</td>
                        <td className={`px-4 py-3.5 font-mono text-xs font-medium ${item.status === 'overdue' ? 'text-red-600' : 'text-muted-foreground'}`}>{item.due_grant_date}</td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">{item.pic}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bgClass} ${cfg.textClass}`}>
                            {cfg.emoji} {cfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
