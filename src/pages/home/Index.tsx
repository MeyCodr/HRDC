import { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { StatsRow } from '@/components/Stats';
import { UpcomingTrainingTable } from '@/components/UpcomingTable';
import { HrdcStatusPanel } from '@/components/HrdcStatus';
import { MonthlyChart } from '@/components/Charts';
import { FullTrainingList } from '@/components/DataTable';
import { AddTrainingModal } from '@/components/AddTrainingModal';
import { api, type TrainingRecord, type Summary } from '@/api/trainingApi';
import { Plus, RefreshCw, WifiOff } from 'lucide-react';

export default function Index() {
  const [trainings, setTrainings]   = useState<TrainingRecord[]>([]);
  const [summary,   setSummary]     = useState<Summary | null>(null);
  const [loading,   setLoading]     = useState(true);
  const [apiError,  setApiError]    = useState(false);
  const [showModal, setShowModal]   = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setApiError(false);
    try {
      const [tRes, sRes] = await Promise.all([
        api.getTrainings(),
        api.getSummary(),
      ]);
      setTrainings(tRes.data);
      setSummary(sRes);
    } catch {
      setApiError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <Layout>
      <div className="p-6 space-y-6">

        {/* ── API offline banner ── */}
        {apiError && (
          <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <WifiOff className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">
              <strong>API server not reachable.</strong> Make sure the Node.js server is running at{' '}
              <code className="font-mono text-xs bg-amber-100 px-1 rounded">http://localhost:3001</code>
            </span>
            <button onClick={fetchAll} className="flex items-center gap-1 text-xs font-semibold underline underline-offset-2 hover:text-amber-900">
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* ── Header row with Add button ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Dashboard Overview</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {loading ? 'Loading...' : `${trainings.length} training records`}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Training
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <StatsRow summary={summary} loading={loading} />

        {/* ── Upcoming + HRDC Status ── */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <UpcomingTrainingTable trainings={trainings} loading={loading} />
          </div>
          <div className="col-span-1">
            <HrdcStatusPanel summary={summary} loading={loading} />
          </div>
        </div>

        {/* ── Monthly Chart ── */}
        <MonthlyChart summary={summary} loading={loading} />

        {/* ── Full Training List ── */}
        <FullTrainingList trainings={trainings} loading={loading} onRefresh={fetchAll} />

      </div>

      {/* ── Add Training Modal ── */}
      <AddTrainingModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchAll}
      />
    </Layout>
  );
}
