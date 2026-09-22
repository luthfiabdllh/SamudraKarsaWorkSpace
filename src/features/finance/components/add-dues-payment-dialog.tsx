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
import { useAddDuesPayment } from '../api/use-finance';
import { getDictionary } from '@/lib/i18n';
import type { DuesItem } from '../types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddDuesPaymentDialogProps {
  item: DuesItem | null;
  onOpenChange: (open: boolean) => void;
}

export function AddDuesPaymentDialog({ item, onOpenChange }: AddDuesPaymentDialogProps) {
  const dict = getDictionary();
  const addPaymentMutation = useAddDuesPayment();

  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');
  const [proofUrl, setProofUrl] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError('Nominal setoran harus berupa angka positif.');
      return;
    }

    try {
      await addPaymentMutation.mutateAsync({
        duesId: item.id,
        data: {
          amount: amount.trim(),
          paymentDate,
          paymentMethod: paymentMethod.trim() || null,
          proofUrl: proofUrl.trim() || null,
          note: note.trim() || null,
        },
      });

      toast.success(dict.finance.addDuesPayment.success);
      setAmount('');
      setProofUrl('');
      setNote('');
      onOpenChange(false);
    } catch {
      toast.error('Gagal mencatat pembayaran iuran.');
    }
  };

  return (
    <Dialog open={Boolean(item)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {dict.finance.addDuesPayment.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Tagihan untuk anggota:{' '}
              <span className="font-semibold text-foreground">
                {item.memberName || item.memberEmail}
              </span>
            </DialogDescription>
          </DialogHeader>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dues-amount" className="text-xs">
                {dict.finance.addDuesPayment.amountLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dues-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25000"
                className="text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dues-date" className="text-xs">
                {dict.finance.addDuesPayment.dateLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dues-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="text-xs"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <Label htmlFor="dues-method" className="text-xs">
              {dict.finance.addDuesPayment.methodLabel}
            </Label>
            <Input
              id="dues-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="Transfer Bank / Tunai"
              className="text-xs"
            />
          </div>

          {/* Proof URL */}
          <div className="space-y-1.5">
            <Label htmlFor="dues-proof" className="text-xs">
              {dict.finance.addDuesPayment.proofLabel} (Opsional)
            </Label>
            <Input
              id="dues-proof"
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://..."
              className="text-xs"
            />
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label htmlFor="dues-note" className="text-xs">
              {dict.finance.addDuesPayment.noteLabel} (Opsional)
            </Label>
            <Textarea
              id="dues-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Keterangan tambahan setoran iuran..."
              rows={2}
              className="text-xs"
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
              disabled={addPaymentMutation.isPending}
            >
              {dict.common.cancel}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={addPaymentMutation.isPending}
              className="gap-1.5"
            >
              {addPaymentMutation.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              <span>
                {addPaymentMutation.isPending
                  ? dict.finance.addDuesPayment.submittingButton
                  : dict.finance.addDuesPayment.submitButton}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
