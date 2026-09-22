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
import { useCreateTransaction } from '../api/use-finance';
import { getDictionary } from '@/lib/i18n';
import type { TransactionType } from '../types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTransactionDialog({
  open,
  onOpenChange,
}: CreateTransactionDialogProps) {
  const dict = getDictionary();
  const createMutation = useCreateTransaction();

  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [counterparty, setCounterparty] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Nominal transaksi harus berupa angka positif.');
      return;
    }

    if (!category.trim()) {
      setError('Kategori mutasi kas wajib diisi.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        transactionType: type,
        category: category.trim(),
        amount: amount.trim(),
        transactionDate: transactionDate || undefined,
        counterparty: counterparty.trim() || null,
        paymentMethod: paymentMethod.trim() || null,
        proofUrl: proofUrl.trim() || null,
      });

      toast.success(dict.finance.createTransaction.success);
      setCategory('');
      setAmount('');
      setCounterparty('');
      setPaymentMethod('');
      setProofUrl('');
      onOpenChange(false);
    } catch {
      toast.error('Gagal mencatat transaksi kas. Silakan coba lagi.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {dict.finance.createTransaction.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {dict.finance.createTransaction.subtitle}
            </DialogDescription>
          </DialogHeader>

          {/* Type Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-type" className="text-xs">
              {dict.finance.createTransaction.typeLabel}
            </Label>
            <Select value={type} onValueChange={(val) => setType(val as TransactionType)}>
              <SelectTrigger id="tx-type" className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Pengeluaran Kas (Debit)</SelectItem>
                <SelectItem value="income">Pemasukan Kas (Kredit)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tx-amount" className="text-xs">
                {dict.finance.createTransaction.amountLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tx-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000"
                className="text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tx-date" className="text-xs">
                {dict.finance.createTransaction.dateLabel}
              </Label>
              <Input
                id="tx-date"
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-category" className="text-xs">
              {dict.finance.createTransaction.categoryLabel}{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tx-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={dict.finance.createTransaction.categoryPlaceholder}
              className="text-xs"
              required
            />
          </div>

          {/* Counterparty & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tx-counterparty" className="text-xs">
                {dict.finance.createTransaction.counterpartyLabel}
              </Label>
              <Input
                id="tx-counterparty"
                value={counterparty}
                onChange={(e) => setCounterparty(e.target.value)}
                placeholder="Toko / Rekanan"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tx-method" className="text-xs">
                {dict.finance.createTransaction.paymentMethodLabel}
              </Label>
              <Input
                id="tx-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="Transfer / Tunai"
                className="text-xs"
              />
            </div>
          </div>

          {/* Proof URL */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-proof" className="text-xs">
              {dict.finance.createTransaction.proofUrlLabel} (Opsional)
            </Label>
            <Input
              id="tx-proof"
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://..."
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
                  ? dict.finance.createTransaction.submittingButton
                  : dict.finance.createTransaction.submitButton}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
