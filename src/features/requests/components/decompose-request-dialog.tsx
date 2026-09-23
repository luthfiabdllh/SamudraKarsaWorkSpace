'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateStoryWithTasks } from '@/features/work-center';
import { getDictionary } from '@/lib/i18n';
import type { RequestItem } from '../types';
import { Plus, Trash2, Loader2, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DecomposeRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: RequestItem;
  description?: string | null;
  onSuccess?: () => void;
}

interface SubTaskDraft {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  storyPoints: number;
  dueDate: string;
}

const FIBONACCI_POINTS = [1, 2, 3, 5, 8, 13] as const;

export function DecomposeRequestDialog({
  open,
  onOpenChange,
  request,
  description,
  onSuccess,
}: DecomposeRequestDialogProps) {
  const dict = getDictionary();
  const createStoryMutation = useCreateStoryWithTasks();

  const [storyTitle, setStoryTitle] = useState(`Story: ${request.title}`);
  const [storyDescription, setStoryDescription] = useState(
    description ? `Diturunkan dari pengajuan ${request.requestNumber}:\n${description}` : ''
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueDate, setDueDate] = useState(request.dueDate ? request.dueDate.split('T')[0] : '');

  // Subtask list state
  const [tasks, setTasks] = useState<SubTaskDraft[]>([
    {
      id: crypto.randomUUID(),
      title: 'Pengerjaan awal',
      priority: 'medium',
      storyPoints: 3,
      dueDate: request.dueDate ? request.dueDate.split('T')[0] : '',
    },
  ]);

  const [error, setError] = useState<string | null>(null);

  const handleAddTask = () => {
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: '',
        priority: 'medium',
        storyPoints: 2,
        dueDate: dueDate || '',
      },
    ]);
  };

  const handleRemoveTask = (id: string) => {
    if (tasks.length <= 1) {
      toast.error('Minimal harus ada 1 task di dalam story.');
      return;
    }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTaskChange = (id: string, field: keyof SubTaskDraft, value: unknown) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const totalPoints = tasks.reduce((acc, t) => acc + (t.storyPoints || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (storyTitle.trim().length < 3) {
      setError('Judul Story minimal 3 karakter.');
      return;
    }

    const invalidTask = tasks.find((t) => t.title.trim().length < 3);
    if (invalidTask) {
      setError('Setiap Task harus memiliki judul minimal 3 karakter.');
      return;
    }

    try {
      await createStoryMutation.mutateAsync({
        title: storyTitle.trim(),
        description: storyDescription.trim() || null,
        divisionId: request.targetDivisionId,
        priority,
        dueDate: dueDate || null,
        sourceRequestId: request.id,
        tasks: tasks.map((t) => ({
          title: t.title.trim(),
          priority: t.priority,
          storyPoints: t.storyPoints,
          dueDate: t.dueDate || null,
        })),
      });

      toast.success(dict.workCenter.decomposeSuccess);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error('Gagal memecah pengajuan menjadi Story & Task.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Agile Decomposition (PM Software)</span>
            </div>
            <DialogTitle className="text-xl font-bold">
              {dict.workCenter.decomposeTitle}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {dict.workCenter.decomposeDesc}
            </DialogDescription>
          </DialogHeader>

          {/* Source Request Info Pill */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary shrink-0" />
              <div>
                <span className="font-semibold text-foreground">{request.title}</span>
                <span className="text-muted-foreground ml-2">({request.requestNumber})</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-muted-foreground block text-[11px]">Total Estimasi SP:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                ⚡ {totalPoints} SP
              </span>
            </div>
          </div>

          {/* Parent Story Fields */}
          <div className="space-y-3.5 p-4 rounded-xl border border-primary/20 bg-primary/5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span>📖 Story Induk (Level Feature / Deliverable)</span>
            </h4>

            <div className="space-y-1.5">
              <Label htmlFor="story-title" className="text-xs">
                Judul Story <span className="text-destructive">*</span>
              </Label>
              <Input
                id="story-title"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                placeholder="Contoh: Implementasi & Pemenuhan Kebutuhan Logistik Acara"
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="story-priority" className="text-xs">
                  Prioritas Story
                </Label>
                <Select
                  value={priority}
                  onValueChange={(val) => setPriority(val as 'low' | 'medium' | 'high' | 'urgent')}
                >
                  <SelectTrigger id="story-priority" className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                    <SelectItem value="urgent">Mendesak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="story-due-date" className="text-xs">
                  Tenggat Selesai Story
                </Label>
                <Input
                  id="story-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="story-desc" className="text-xs">
                Deskripsi Story & Sasaran
              </Label>
              <Textarea
                id="story-desc"
                value={storyDescription}
                onChange={(e) => setStoryDescription(e.target.value)}
                rows={2}
                placeholder="Rincian lingkup story..."
                className="text-xs"
              />
            </div>
          </div>

          {/* Child Tasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Daftar Task (Akan Muncul di Kanban Divisi)</span>
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Setiap task memegang Story Point sendiri dan akan muncul sebagai kartu terpisah di papan Kanban.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTask}
                className="gap-1.5 text-xs h-8"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Task</span>
              </Button>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl border border-border/80 bg-card space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-muted-foreground">
                      Task #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(task.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Hapus Task"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <Input
                      value={task.title}
                      onChange={(e) => handleTaskChange(task.id, 'title', e.target.value)}
                      placeholder={`Judul Task #${idx + 1}...`}
                      required
                      className="h-8 text-xs font-medium"
                    />
                  </div>

                  {/* Task SP Fibonacci Selector */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-border/40">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        Story Points:
                      </span>
                      <div className="flex items-center gap-1">
                        {FIBONACCI_POINTS.map((pts) => (
                          <button
                            key={pts}
                            type="button"
                            onClick={() => handleTaskChange(task.id, 'storyPoints', pts)}
                            className={cn(
                              'px-2 py-0.5 text-[11px] font-bold rounded-md border transition-all',
                              task.storyPoints === pts
                                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                                : 'bg-muted/40 hover:bg-muted text-foreground border-border/80'
                            )}
                          >
                            {pts}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={task.dueDate}
                        onChange={(e) => handleTaskChange(task.id, 'dueDate', e.target.value)}
                        className="h-7 text-[11px] w-36"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-xs font-semibold text-destructive">{error}</p>}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs h-9"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={createStoryMutation.isPending}
              className="gap-2 text-xs h-9 shadow-sm"
            >
              {createStoryMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>Simpan Story & {tasks.length} Task</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
