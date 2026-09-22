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
import type { LetterStatus } from '../types';
import { Loader2 } from 'lucide-react';

interface LetterTransitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetStatus: LetterStatus | null;
  isLoading: boolean;
  onConfirm: (note?: string | null) => Promise<void>;
}

export function LetterTransitionDialog({
  open,
  onOpenChange,
  targetStatus,
  isLoading,
  onConfirm,
}: LetterTransitionDialogProps) {
  const dict = getDictionary();
  const [note, setNote] = useState('');

  if (!targetStatus) return null;

  const statusName = dict.statuses.letters[targetStatus] ?? targetStatus;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(note.trim() || null);
    setNote('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {dict.letters.transitionDialog.title}: {statusName}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {dict.letters.transitionDialog.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor="letter-tx-note" className="text-xs">
              {dict.letters.transitionDialog.noteLabel}
            </Label>
            <Textarea
              id="letter-tx-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={dict.letters.transitionDialog.notePlaceholder}
              rows={3}
              className="text-xs"
            />
          </div>

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
                  ? dict.letters.transitionDialog.submittingButton
                  : dict.letters.transitionDialog.submitButton}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
