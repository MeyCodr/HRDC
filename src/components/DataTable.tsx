import { useState } from 'react';
import { Search, Filter, RefreshCw, Trash2, Pencil, X, Save } from 'lucide-react';
import { STATUS_CONFIG, type StatusType } from '@/lib/index';
import { api, type TrainingRecord, type TrainingFormData } from '@/api/trainingApi';

interface FullTrainingListProps {
  trainings: TrainingRecord[];
  loading: boolean;
  onRefresh: () => void;
}

// Convert dd/mm/yyyy → YYYY-MM-DD for <input type="date">
function toInputDate(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split('/');
  if (!d || !m || !y) return '';
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

export function FullTrainingList({ trainings, loading, onRefresh }: FullTrainingListProps) {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | StatusType>('all');
  const [deleting, setDeleting]       = useState<number | null>(null);
  const [editingRecord, setEditingRecord] = useState<TrainingRecord | null>(null);
  const [editForm, setEditForm]       = useState<Partial<TrainingFormData>>({});
  const [saving, setSaving]           = useState(false);

  const filtered = trainings.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.pic.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this training record?')) return;
    setDeleting(id);
    try {
      await api.deleteTraining(id);
      onRefresh();
    } catch {
      alert('Failed to delete. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const openEdit = (record: TrainingRecord) => {
    setEditingRecord(record);
    setEditForm({
      title:         record.title,
      department:    record.department,
      training_date: toInputDate(record.training_date),
      cost:          record.cost,
      pic:           record.pic,
      need_hrdc:     record.need_hrdc,
      status:        record.status,
      vendor:        record.vendor ?? '',
      pax:           record.pax,
      notes:         record.notes ?? '',
    });
  };

  const closeEdit = () => {
    setEditingRecord(null);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editingRecord) return;
    setSaving(true);
    try {
      await api.updateTraining(editingRecord.id, editForm);
      onRefresh();
      closeEdit();
    } catch {
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof TrainingFormData, value: string | number) =>
    setEditForm(prev => ({ ...prev, [field]: value }));

  return (
    <>
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Full Training List</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {loading ? 'Loading...' : `${filtered.length} of ${trainings.length} records`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onRefresh} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Refresh">
                <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Filter className="w-4 h-4 text-muted-foreground" />
              {(['all', 'overdue', 'pending', 'done'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {s === 'all' ? 'All' : STATUS_CONFIG[s as StatusType].label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search training, PIC, or department..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted border-b border-border">
                {['#','Training Title','Dept','Date','Due Grant','PIC','HRDC','Cost (RM)','Pax','Status',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      {Array.from({ length: 11 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td>
                      ))}
                    </tr>
                  ))
                : filtered.length === 0
                  ? <tr><td colSpan={11} className="text-center py-10 text-sm text-muted-foreground">No records found.</td></tr>
                  : filtered.map((item, idx) => {
                      const cfg = STATUS_CONFIG[item.status as StatusType];
                      return (
                        <tr key={item.id} className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors ${idx % 2 === 0 ? 'bg-card' : 'bg-background'}`}>
                          <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{item.id}</td>
                          <td className="px-4 py-3 font-medium text-foreground text-xs max-w-45">{item.title}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{item.department}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">{item.training_date}</td>
                          <td className={`px-4 py-3 text-xs font-mono font-medium whitespace-nowrap ${item.status === 'overdue' ? 'text-red-600' : 'text-muted-foreground'}`}>{item.due_grant_date}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">{item.pic}</span>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {item.need_hrdc ? <span className="font-semibold text-primary">✓ Yes</span> : <span className="text-muted-foreground">— No</span>}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">
                            {Number(item.cost).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{item.pax}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${cfg.bgClass} ${cfg.textClass}`}>
                              {cfg.emoji} {cfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEdit(item)}
                                className="p-1 rounded hover:bg-blue-50 text-muted-foreground hover:text-blue-500 transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                disabled={deleting === item.id}
                                className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Edit Training Record</h3>
                <p className="text-xs text-muted-foreground mt-0.5">ID #{editingRecord.id}</p>
              </div>
              <button onClick={closeEdit} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Training Title</label>
                <input
                  type="text"
                  value={editForm.title ?? ''}
                  onChange={e => set('title', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Department</label>
                  <input
                    type="text"
                    value={editForm.department ?? ''}
                    onChange={e => set('department', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">PIC</label>
                  <input
                    type="text"
                    value={editForm.pic ?? ''}
                    onChange={e => set('pic', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Training Date</label>
                  <input
                    type="date"
                    value={editForm.training_date ?? ''}
                    onChange={e => set('training_date', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Status</label>
                  <select
                    value={editForm.status ?? 'pending'}
                    onChange={e => set('status', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {(['pending', 'overdue', 'done'] as StatusType[]).map(s => (
                      <option key={s} value={s}>
                        {STATUS_CONFIG[s].emoji} {STATUS_CONFIG[s].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Cost (RM)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.cost ?? 0}
                    onChange={e => set('cost', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Pax</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.pax ?? 1}
                    onChange={e => set('pax', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Vendor</label>
                  <input
                    type="text"
                    value={editForm.vendor ?? ''}
                    onChange={e => set('vendor', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">HRDC Claimable</label>
                  <select
                    value={editForm.need_hrdc ?? 0}
                    onChange={e => set('need_hrdc', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value={1}>✓ Yes</option>
                    <option value={0}>— No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={editForm.notes ?? ''}
                  onChange={e => set('notes', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
              <button
                onClick={closeEdit}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-input bg-background hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
