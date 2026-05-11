import type { Summary } from '@/api/trainingApi';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface HrdcStatusPanelProps {
  summary: Summary | null;
  loading: boolean;
}

export function HrdcStatusPanel({ summary, loading }: HrdcStatusPanelProps) {
  const hrdc     = summary?.hrdc;
  const approved = hrdc?.approved ?? 0;
  const pending  = hrdc?.pending  ?? 0;
  const rejected = hrdc?.rejected ?? 0;
  const total    = approved + pending + rejected || 1;

  const approvedPct = Math.round((approved / total) * 100);
  const pendingPct  = Math.round((pending  / total) * 100);
  const rejectedPct = Math.round((rejected / total) * 100);

  const items = [
    { label: 'Approved', value: approved, pct: approvedPct, icon: CheckCircle2, barColor: 'bg-green-500', textColor: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Pending',  value: pending,  pct: pendingPct,  icon: Clock,        barColor: 'bg-amber-400', textColor: 'text-amber-600', bgColor: 'bg-amber-50' },
    { label: 'Rejected', value: rejected, pct: rejectedPct, icon: XCircle,      barColor: 'bg-red-500',   textColor: 'text-red-600',   bgColor: 'bg-red-50'   },
  ];

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">HRDC Application Status</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{loading ? '...' : `${approved + pending + rejected} total applications`}</p>
      </div>

      <div className="px-5 py-5 space-y-5">
        {items.map(({ label, value, pct, icon: Icon, barColor, textColor, bgColor }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg ${bgColor} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${textColor}`} />
                </div>
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                {loading
                  ? <div className="h-7 w-8 bg-muted animate-pulse rounded" />
                  : <span className={`text-2xl font-bold font-mono ${textColor}`}>{value}</span>
                }
                <span className="text-xs text-muted-foreground">({pct}%)</span>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex-1 h-3 rounded-full overflow-hidden flex">
            <div className="bg-green-500 h-full" style={{ width: `${approvedPct}%` }} />
            <div className="bg-amber-400 h-full" style={{ width: `${pendingPct}%`  }} />
            <div className="bg-red-500  h-full" style={{ width: `${rejectedPct}%` }} />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Approved</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Pending</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500  inline-block" />Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
