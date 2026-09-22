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
import { getDictionary } from '@/lib/i18n';
import type { WorkItemStatus } from '../types';
import type { TransitionWorkItemValues } from '../schemas/work-item';
import { Loader2 } from 'lucide-react';

interface FsmTransitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetStatus: WorkItemStatus | null;
  isLoading: boolean;
  onConfirm: (data: TransitionWorkItemValues) => Promise<void>;
}

export function FsmTransitionDialog({
  open,
  onOpenChange,
  targetStatus,
  isLoading,
  onConfirm,
}: FsmTransitionDialogProps) {
  const dict = getDictionary();
  const [note, setNote] = useState('');
  const [holdReason, setHoldReason] = useState('');
  const [completionSummary, setCompletionSummary] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!targetStatus) return null;

  const isHold = targetStatus === 'on_hold';
  const isDone = targetStatus === 'done';

  const dialogTitle = isHold
    ? dict.fsm.holdDialog.title
    : isDone
    ? dict.fsm.completeDialog.title
    : `${dict.fsm.nextAction}: ${dict.statuses.workItems[targetStatus] ?? targetStatus}`;

  const dialogDescription = isHold
    ? dict.fsm.holdDialog.description
    : isDone
    ? dict.fsm.completeDialog.description
    : `Konfirmasi perpindahan status pekerjaan ke ${dict.statuses.workItems[targetStatus] ?? targetStatus}.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isHold && !holdReason.trim()) {
      setError('Alasan penahanan wajib diisi.');
      return;
    }

    if (isDone && !completionSummary.trim()) {
      setError('Rangkuman hasil pengerjaan wajib diisi.');
      return;
    }

    await onConfirm({
      to: targetStatus,
      note: note.trim() || null,
      holdReason: isHold ? holdReason.trim() : null,
      completionSummary: isDone ? completionSummary.trim() : null,
    });

    // Reset fields on success
    setNote('');
    setHoldReason('');
    setCompletionSummary('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{dialogTitle}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground pt-1">
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>

          {isHold && (
            <div className="space-y-1.5">
              <Label htmlFor="holdReason">
                {dict.fsm.holdDialog.reasonLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="holdReason"
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                placeholder={dict.fsm.holdDialog.reasonPlaceholder}
                rows={3}
                required
              />
            </div>
          )}

          {isDone && (
            <div className="space-y-1.5">
              <Label htmlFor="completionSummary">
                {dict.fsm.completeDialog.summaryLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="completionSummary"
                value={completionSummary}
                onChange={(e) => setCompletionSummary(e.target.value)}
                placeholder={dict.fsm.completeDialog.summaryPlaceholder}
                rows={4}
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="transitionNote">Catatan Tambahan (Opsional)</Label>
            <Textarea
              id="transitionNote"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tambahkan catatan proses bila diperlukan..."
              rows={2}
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-destructive">{error}</p>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {dict.common.cancel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isHold
                ? dict.fsm.holdDialog.confirmButton
                : isDone
                ? dict.fsm.completeDialog.confirmButton
                : dict.common.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
