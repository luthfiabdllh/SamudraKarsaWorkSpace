'use client';

import React, { useState } from 'react';
import { Copy, Check, KeyRound } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { id as dictionary } from '@/lib/dictionaries/id';
import { useResetMemberPassword } from '../api/use-admin';
import type { AdminMemberItem } from '../types';

interface ResetPasswordDialogProps {
  member: AdminMemberItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResetPasswordDialog({
  member,
  isOpen,
  onClose,
}: ResetPasswordDialogProps) {
  const dict = dictionary.admin.members.resetPasswordDialog;
  const resetMutation = useResetMemberPassword();

  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleReset = async () => {
    if (!member) return;

    try {
      const result = await resetMutation.mutateAsync(member.id);
      setTemporaryPassword(result.temporaryPassword);
    } catch {
      // Handled in mutation onError
    }
  };

  const handleCopy = async () => {
    if (!temporaryPassword) return;
    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleClose = () => {
    setTemporaryPassword(null);
    setCopied(false);
    onClose();
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent id="reset-password-modal" className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <KeyRound className="h-4 w-4" />
            </div>
            <DialogTitle>{dict.title}</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            {member.fullName} ({member.email})
          </DialogDescription>
        </DialogHeader>

        {!temporaryPassword ? (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {dict.confirmMessage}
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/70">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                disabled={resetMutation.isPending}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleReset}
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending ? dict.submittingButton : dict.confirmButton}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {dict.resultTitle}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                {dict.resultDescription}
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/60 p-3">
              <span className="font-mono text-base font-bold tracking-wider select-all text-foreground">
                {temporaryPassword}
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 text-xs"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{dict.copiedButton}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{dict.copyButton}</span>
                  </>
                )}
              </Button>
            </div>

            <div className="flex justify-end pt-2 border-t border-border/70">
              <Button type="button" size="sm" onClick={handleClose}>
                {dict.closeButton}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
