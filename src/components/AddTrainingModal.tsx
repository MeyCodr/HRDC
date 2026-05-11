import { useState, useEffect } from 'react';
import { X, CalendarDays, Info } from 'lucide-react';
import { api, type TrainingFormData } from '@/api/trainingApi';

interface AddTrainingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function calcDueDate(trainingDate: string): string {
  if (!trainingDate) return '';
  const d = new Date(trainingDate);
  d.setDate(d.getDate() - 14);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');
}

export function AddTrainingModal({ open, onClose, onSuccess }: AddTrainingModalProps) {
  const [form, setForm] = useState<TrainingFormData>({
    title: '',
    department: '',
    training_date: '',
    cost: 0,
    pic: 'Fikri',
    need_hrdc: 1,
    pax: 1,
    vendor: '',
    notes: '',
  });
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  // Reset form and load departments on open
  useEffect(() => {
    if (open) {
      setForm({ title: '', department: '', training_date: '', cost: 0, pic: 'Fikri', need_hrdc: 1, pax: 1, vendor: '', notes: '' });
      setError('');
      api.getDepartments().then(res => setDepartments(res.data)).catch(() => {});
    }
  }, [open]);

  const set = (field: keyof TrainingFormData, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim())       return setError('Training title is required.');
    if (!form.department)         return setError('Department is required.');
    if (!form.training_date)      return setError('Training date is required.');
    if (!form.cost || form.cost <= 0) return setError('Cost must be greater than 0.');

    setLoading(true);
    try {
      await api.createTraining(form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const previewDue = calcDueDate(form.training_date);

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-primary">
          <div>
            <h2 className="text-base font-semibold text-primary-foreground">Add New Training</h2>
            <p className="text-xs text-primary-foreground/70 mt-0.5">HRDC due date auto-calculated (14 days before)</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-primary-foreground/10 text-primary-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Training Title */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Training Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. AI Workshop"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Department <span className="text-destructive">*</span>
            </label>
            <select
              value={form.department}
              onChange={e => set('department', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            >
              <option value="">— Select Department —</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Training Date + Auto Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Date of Training <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={form.training_date}
                onChange={e => set('training_date', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Auto HRDC Due Date */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
                <CalendarDays className="w-3 h-3 text-primary" />
                HRDC Due Date
                <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-bold">AUTO</span>
              </label>
              <div className={`w-full px-3 py-2.5 text-sm border rounded-lg font-mono flex items-center gap-2 ${
                previewDue
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : 'border-dashed border-muted-foreground/30 bg-muted text-muted-foreground'
              }`}>
                {previewDue || '— pick training date'}
              </div>
              {previewDue && (
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" /> 14 days before training
                </p>
              )}
            </div>
          </div>

          {/* Cost + PIC */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Cost (RM) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.cost || ''}
                onChange={e => set('cost', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 text-sm border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">PIC</label>
              <input
                type="text"
                placeholder="Fikri"
                value={form.pic}
                onChange={e => set('pic', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* HRDC Toggle */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">Require HRDC Grant?</p>
              <p className="text-xs text-muted-foreground">Toggle if this training needs HRDC funding</p>
            </div>
            <button
              type="button"
              onClick={() => set('need_hrdc', form.need_hrdc ? 0 : 1)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.need_hrdc ? 'bg-primary' : 'bg-muted-foreground/30'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.need_hrdc ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : '+ Add Training'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
