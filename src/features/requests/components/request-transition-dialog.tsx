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
import type { RequestStatus } from '../types';
import type { TransitionRequestValues } from '../schemas/request';
import { Loader2 } from 'lucide-react';

interface RequestTransitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetStatus: RequestStatus | null;
  requiredFields?: string[];
  isLoading: boolean;
  onConfirm: (data: TransitionRequestValues) => Promise<void>;
}

export function RequestTransitionDialog({
  open,
  onOpenChange,
  targetStatus,
  requiredFields = [],
  isLoading,
  onConfirm,
}: RequestTransitionDialogProps) {
  const dict = getDictionary();

  const [note, setNote] = useState('');
  const [clarificationNote, setClarificationNote] = useState('');
  const [resultSummary, setResultSummary] = useState('');
  const [holdReason, setHoldReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!targetStatus) return null;

  const requiresClarification =
    targetStatus === 'need_clarification' ||
    requiredFields.includes('clarificationNote') ||
    requiredFields.includes('clarification_note');

  const requiresResult =
    targetStatus === 'done' ||
    requiredFields.includes('resultSummary') ||
    requiredFields.includes('result_summary');

  const requiresHold =
    targetStatus === 'on_hold' ||
    requiredFields.includes('holdReason') ||
    requiredFields.includes('hold_reason');

  const isReject = targetStatus === 'rejected';

  const statusName = dict.statuses.requests[targetStatus] ?? targetStatus;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (requiresClarification && !clarificationNote.trim()) {
      setError('Catatan klarifikasi wajib diisi.');
      return;
    }

    if (requiresResult && !resultSummary.trim()) {
      setError('Ringkasan luaran atau hasil akhir wajib diisi.');
      return;
    }

    if (requiresHold && !holdReason.trim()) {
      setError('Alasan penahanan wajib diisi.');
      return;
    }

    if (isReject && !note.trim()) {
      setError('Alasan penolakan pengajuan wajib diisi pada catatan alur.');
      return;
    }

    try {
      await onConfirm({
        to: targetStatus,
        note: note.trim() || null,
        clarificationNote: requiresClarification ? clarificationNote.trim() : null,
        resultSummary: requiresResult ? resultSummary.trim() : null,
        holdReason: requiresHold ? holdReason.trim() : null,
      });

      // Reset fields
      setNote('');
      setClarificationNote('');
      setResultSummary('');
      setHoldReason('');
      onOpenChange(false);
    } catch (err: unknown) {
      const maybeAxios = err as { response?: { data?: { message?: string; title?: string; detail?: string } } };
      const serverMsg =
        maybeAxios.response?.data?.detail ||
        maybeAxios.response?.data?.message ||
        maybeAxios.response?.data?.title;
      setError(serverMsg || 'Gagal mengubah status pengajuan. Silakan coba lagi.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {dict.requests.transitionDialog.title}: {statusName}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {dict.requests.transitionDialog.description}
            </DialogDescription>
          </DialogHeader>

          {/* Clarification Note Field */}
          {requiresClarification && (
            <div className="space-y-1.5">
              <Label htmlFor="clarification-note">
                {dict.requests.transitionDialog.clarificationLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="clarification-note"
                value={clarificationNote}
                onChange={(e) => setClarificationNote(e.target.value)}
                placeholder={dict.requests.transitionDialog.clarificationPlaceholder}
                rows={3}
                className="text-xs"
                required
              />
            </div>
          )}

          {/* Result Summary Field */}
          {requiresResult && (
            <div className="space-y-1.5">
              <Label htmlFor="result-summary">
                {dict.requests.transitionDialog.resultLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="result-summary"
                value={resultSummary}
                onChange={(e) => setResultSummary(e.target.value)}
                placeholder={dict.requests.transitionDialog.resultPlaceholder}
                rows={3}
                className="text-xs"
                required
              />
            </div>
          )}

          {/* Hold Reason Field */}
          {requiresHold && (
            <div className="space-y-1.5">
              <Label htmlFor="hold-reason">
                {dict.requests.transitionDialog.holdLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="hold-reason"
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                placeholder={dict.requests.transitionDialog.holdPlaceholder}
                rows={3}
                className="text-xs"
                required
              />
            </div>
          )}

          {/* Audit Note Field */}
          <div className="space-y-1.5">
            <Label htmlFor="transition-note">
              {isReject ? 'Alasan Penolakan' : dict.requests.transitionDialog.noteLabel}{' '}
              {isReject && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="transition-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={dict.requests.transitionDialog.notePlaceholder}
              rows={2}
              className="text-xs"
              required={isReject}
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
            <Button type="submit" size="sm" disabled={isLoading} className="gap-1.5">
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>
                {isLoading
                  ? dict.requests.transitionDialog.submittingButton
                  : dict.requests.transitionDialog.submitButton}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
