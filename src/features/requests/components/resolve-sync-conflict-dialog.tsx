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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getDictionary } from '@/lib/i18n';
import type { RequestStatus } from '../types';
import type { ResolveSyncConflictValues } from '../schemas/request';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ResolveSyncConflictDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestNumber: string;
  currentStatus: RequestStatus;
  isLoading: boolean;
  onConfirm: (data: ResolveSyncConflictValues) => Promise<void>;
}

export function ResolveSyncConflictDialog({
  open,
  onOpenChange,
  requestNumber,
  currentStatus,
  isLoading,
  onConfirm,
}: ResolveSyncConflictDialogProps) {
  const dict = getDictionary();

  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>(currentStatus);
  const [note, setNote] = useState('');
  const [holdReason, setHoldReason] = useState('');
  const [resultSummary, setResultSummary] = useState('');
  const [clarificationNote, setClarificationNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Status-status yang umum dipilih untuk resolusi
  const resolvableStatuses: RequestStatus[] = [
    'accepted',
    'in_progress',
    'need_review',
    'need_clarification',
    'on_hold',
    'done',
    'rejected',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (note.trim().length < 3) {
      setError('Alasan dan catatan resolusi wajib diisi minimal 3 karakter.');
      return;
    }

    if (selectedStatus === 'on_hold' && !holdReason.trim()) {
      setError('Status tertahan (on_hold) mewajibkan alasan penahanan.');
      return;
    }

    if (selectedStatus === 'done' && !resultSummary.trim()) {
      setError('Status selesai (done) mewajibkan ringkasan luaran/hasil.');
      return;
    }

    if (selectedStatus === 'need_clarification' && !clarificationNote.trim()) {
      setError('Status perlu klarifikasi mewajibkan catatan klarifikasi.');
      return;
    }

    try {
      await onConfirm({
        status: selectedStatus,
        note: note.trim(),
        holdReason: selectedStatus === 'on_hold' ? holdReason.trim() : undefined,
        resultSummary: selectedStatus === 'done' ? resultSummary.trim() : undefined,
        clarificationNote: selectedStatus === 'need_clarification' ? clarificationNote.trim() : undefined,
      });

      // Reset
      setNote('');
      setHoldReason('');
      setResultSummary('');
      setClarificationNote('');
      onOpenChange(false);
    } catch (err: unknown) {
      const maybeAxios = err as { response?: { data?: { message?: string; title?: string; detail?: string } } };
      const serverMsg =
        maybeAxios.response?.data?.detail ||
        maybeAxios.response?.data?.message ||
        maybeAxios.response?.data?.title;
      setError(serverMsg || 'Gagal menyelesaikan konflik sinkronisasi. Silakan coba lagi.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-lg font-bold">
                {dict.requests.conflictDialog.title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Pengajuan <span className="font-semibold text-foreground">{requestNumber}</span>{' '}
              {dict.requests.conflictDialog.description}
            </DialogDescription>
          </DialogHeader>

          {/* Status Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="resolve-status">
              {dict.requests.conflictDialog.statusLabel}{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedStatus}
              onValueChange={(val) => setSelectedStatus(val as RequestStatus)}
            >
              <SelectTrigger id="resolve-status" className="h-9 text-xs">
                <SelectValue placeholder="Pilih status kesepakatan" />
              </SelectTrigger>
              <SelectContent>
                {resolvableStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {dict.statuses.requests[s] ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conditional field for on_hold */}
          {selectedStatus === 'on_hold' && (
            <div className="space-y-1.5">
              <Label htmlFor="resolve-hold-reason">
                {dict.requests.transitionDialog.holdLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="resolve-hold-reason"
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                placeholder={dict.requests.transitionDialog.holdPlaceholder}
                rows={2}
                className="text-xs"
                required
              />
            </div>
          )}

          {/* Conditional field for done */}
          {selectedStatus === 'done' && (
            <div className="space-y-1.5">
              <Label htmlFor="resolve-result-summary">
                {dict.requests.transitionDialog.resultLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="resolve-result-summary"
                value={resultSummary}
                onChange={(e) => setResultSummary(e.target.value)}
                placeholder={dict.requests.transitionDialog.resultPlaceholder}
                rows={2}
                className="text-xs"
                required
              />
            </div>
          )}

          {/* Conditional field for need_clarification */}
          {selectedStatus === 'need_clarification' && (
            <div className="space-y-1.5">
              <Label htmlFor="resolve-clarification-note">
                {dict.requests.transitionDialog.clarificationLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="resolve-clarification-note"
                value={clarificationNote}
                onChange={(e) => setClarificationNote(e.target.value)}
                placeholder={dict.requests.transitionDialog.clarificationPlaceholder}
                rows={2}
                className="text-xs"
                required
              />
            </div>
          )}

          {/* Resolution Note */}
          <div className="space-y-1.5">
            <Label htmlFor="resolve-note">
              {dict.requests.conflictDialog.noteLabel}{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="resolve-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={dict.requests.conflictDialog.notePlaceholder}
              rows={3}
              className="text-xs"
              required
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
              {error}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {dict.common.cancel}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !note.trim()}
              className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>
                {isLoading
                  ? dict.requests.conflictDialog.submittingButton
                  : dict.requests.conflictDialog.submitButton}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
