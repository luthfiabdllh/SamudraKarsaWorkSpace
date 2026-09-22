'use client';

import React, { useState } from 'react';
import { AlertTriangle, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { id as dictionary } from '@/lib/dictionaries/id';
import { useHardDeleteRecycleBinItem } from '../api/use-admin';
import type { RecycleBinItem, RecycleBinTable } from '../types';

interface HardDeleteDialogProps {
  item: RecycleBinItem | null;
  table: RecycleBinTable;
  isOpen: boolean;
  onClose: () => void;
}

export function HardDeleteDialog({
  item,
  table,
  isOpen,
  onClose,
}: HardDeleteDialogProps) {
  const dict = dictionary.admin.recycleBin.hardDeleteDialog;
  const hardDeleteMutation = useHardDeleteRecycleBinItem(table);

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!item) return;
    if (!password) {
      setError('Kata sandi admin wajib diisi untuk verifikasi keamanan');
      return;
    }

    try {
      await hardDeleteMutation.mutateAsync({
        id: item.id,
        password,
      });
      setPassword('');
      onClose();
    } catch {
      // Handled in mutation onError
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(null);
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent id="hard-delete-modal" className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <div className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <DialogTitle className="text-destructive">
              {dict.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            {item.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Warning banner */}
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 space-y-1">
            <p className="text-xs font-semibold text-destructive">
              {dict.warningTitle}
            </p>
            <p className="text-[11px] text-destructive/90 leading-relaxed">
              {dict.warningDesc}
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-2 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          {/* Password re-authentication input */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-pass" className="text-xs font-semibold flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{dict.passwordLabel}</span>
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="admin-pass"
              type="password"
              placeholder={dict.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9 text-sm"
              autoFocus
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={hardDeleteMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={hardDeleteMutation.isPending}
            >
              {hardDeleteMutation.isPending ? dict.submittingButton : dict.confirmButton}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
