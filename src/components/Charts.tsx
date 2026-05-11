import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Summary } from '@/api/trainingApi';

interface MonthlyChartProps {
  summary: Summary | null;
  loading: boolean;
}

const ALL_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function MonthlyChart({ summary, loading }: MonthlyChartProps) {
  // Fill all months, default 0
  const raw = summary?.monthly ?? [];
  const data = ALL_MONTHS.map(m => ({
    month: m,
    count: raw.find(r => r.month === m)?.count ?? 0,
  }));

  const currentMonth = new Date().toLocaleString('en', { month: 'short' });

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Monthly Training Overview</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Number of trainings per month — {new Date().getFullYear()}</p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 bg-muted text-muted-foreground rounded-full">
          {new Date().getFullYear()}
        </span>
      </div>

      <div className="px-4 py-5">
        {loading
          ? <div className="h-48 bg-muted animate-pulse rounded-lg" />
          : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data} barCategoryGap="35%" margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'oklch(0.50 0.02 240)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'oklch(0.50 0.02 240)', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'oklch(0.95 0.01 240)' }}
                  contentStyle={{ background: 'oklch(1 0 0)', border: '1px solid oklch(0.88 0.01 240)', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px oklch(0 0 0 / 0.08)' }}
                  formatter={(v: number) => [`${v} trainings`, 'Count']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.month === currentMonth ? 'oklch(0.35 0.12 240)' : 'oklch(0.50 0.18 240)'} fillOpacity={entry.month === currentMonth ? 1 : 0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )
        }
      </div>
    </div>
  );
}
