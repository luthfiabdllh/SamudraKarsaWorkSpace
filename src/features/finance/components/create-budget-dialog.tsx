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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateBudget } from '../api/use-finance';
import { useDivisions } from '@/features/requests';
import { getDictionary } from '@/lib/i18n';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBudgetDialog({ open, onOpenChange }: CreateBudgetDialogProps) {
  const dict = getDictionary();
  const createMutation = useCreateBudget();
  const { data: divisions = [] } = useDivisions();

  const [title, setTitle] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError('Judul proposal anggaran minimal 3 karakter.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        divisionId: divisionId || null,
      });

      toast.success(dict.finance.createBudget.success);
      setTitle('');
      setDivisionId('');
      onOpenChange(false);
    } catch {
      toast.error('Gagal membuat proposal anggaran. Silakan coba lagi.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {dict.finance.createBudget.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {dict.finance.createBudget.subtitle}
            </DialogDescription>
          </DialogHeader>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="budget-title" className="text-xs">
              {dict.finance.createBudget.titleLabel}{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="budget-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={dict.finance.createBudget.titlePlaceholder}
              className="text-xs"
              required
            />
          </div>

          {/* Division (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="budget-division" className="text-xs">
              {dict.finance.createBudget.divisionLabel} (Opsional)
            </Label>
            <Select value={divisionId} onValueChange={setDivisionId}>
              <SelectTrigger id="budget-division" className="h-9 text-xs">
                <SelectValue placeholder="Pilih divisi pelaksana..." />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              disabled={createMutation.isPending}
            >
              {dict.common.cancel}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
              className="gap-1.5"
            >
              {createMutation.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              <span>
                {createMutation.isPending
                  ? dict.finance.createBudget.submittingButton
                  : dict.finance.createBudget.submitButton}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
