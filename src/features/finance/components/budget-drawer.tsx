'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useBudgetDetail,
  useAddBudgetItem,
  useTransitionBudget,
} from '../api/use-finance';
import { getDictionary } from '@/lib/i18n';
import type { Budget, BudgetStatus } from '../types';
import {
  Plus,
  Loader2,
  Building2,
  Clock,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';

interface BudgetDrawerProps {
  selectedBudget: Budget | null;
  onClose: () => void;
}

export function BudgetDrawer({ selectedBudget, onClose }: BudgetDrawerProps) {
  const dict = getDictionary();

  const { data: detail, isLoading } = useBudgetDetail(selectedBudget?.id ?? null);
  const addBudgetItemMutation = useAddBudgetItem();
  const transitionMutation = useTransitionBudget();

  // Add Item state
  const [showAddItem, setShowAddItem] = useState(false);
  const [itemLabel, setItemLabel] = useState('');
  const [itemQty, setItemQty] = useState('1');
  const [itemUnit, setItemUnit] = useState('');
  const [itemUnitPrice, setItemUnitPrice] = useState('0');
  const [itemPlanned, setItemPlanned] = useState('0');

  // Transition state
  const [reviewNote, setReviewNote] = useState('');

  if (!selectedBudget) return null;

  const currentStatus = detail?.status ?? selectedBudget.status;
  const items = detail?.items ?? [];

  const formatCurrency = (val?: string | number | null) => {
    if (!val) return 'Rp 0';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handlePriceOrQtyChange = (newQty: string, newPrice: string) => {
    setItemQty(newQty);
    setItemUnitPrice(newPrice);
    const q = parseFloat(newQty) || 0;
    const p = parseFloat(newPrice) || 0;
    setItemPlanned(String(Math.round(q * p)));
  };

  const handleAddItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemLabel.trim()) return;

    try {
      await addBudgetItemMutation.mutateAsync({
        budgetId: selectedBudget.id,
        data: {
          label: itemLabel.trim(),
          quantity: itemQty || '1',
          unit: itemUnit.trim() || null,
          unitPrice: itemUnitPrice || '0',
          plannedTotal: itemPlanned || '0',
          sortOrder: items.length,
        },
      });

      toast.success(dict.finance.createBudgetItem.success);
      setItemLabel('');
      setItemQty('1');
      setItemUnit('');
      setItemUnitPrice('0');
      setItemPlanned('0');
      setShowAddItem(false);
    } catch {
      toast.error('Gagal menambahkan item anggaran.');
    }
  };

  const handleTransition = async (target: BudgetStatus) => {
    try {
      await transitionMutation.mutateAsync({
        id: selectedBudget.id,
        data: {
          to: target,
          reviewNote: reviewNote.trim() || null,
        },
      });
      toast.success(`Status anggaran diperbarui menjadi ${dict.statuses.finance[target] ?? target}`);
      setReviewNote('');
    } catch {
      toast.error('Gagal memperbarui status alur anggaran.');
    }
  };

  // Determine allowed transitions based on standard budget FSM
  const getAvailableTransitions = (status: BudgetStatus): BudgetStatus[] => {
    switch (status) {
      case 'draft':
        return ['submitted'];
      case 'submitted':
        return ['review'];
      case 'review':
        return ['approved', 'needs_revision'];
      case 'needs_revision':
        return ['submitted'];
      case 'approved':
        return ['in_progress'];
      case 'in_progress':
        return ['done'];
      default:
        return [];
    }
  };

  const availableTransitions = getAvailableTransitions(currentStatus);

  return (
    <Sheet open={Boolean(selectedBudget)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="space-y-3 pb-2 text-left">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
              {selectedBudget.budgetNumber}
            </span>
            <Badge variant="outline" className="text-xs font-semibold">
              {dict.statuses.finance[currentStatus] ?? currentStatus}
            </Badge>
          </div>

          <SheetTitle className="text-xl font-bold leading-tight">
            {selectedBudget.title}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {dict.finance.budgetDrawer.title}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-3" />

        {/* Summary Details */}
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-card border border-border/60">
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                {dict.finance.budgets.division}
              </span>
              <p className="font-medium text-foreground">
                {detail?.divisionName || selectedBudget.divisionName || '-'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {dict.common.date}
              </span>
              <p className="font-medium text-foreground">
                {new Intl.DateTimeFormat('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(selectedBudget.createdAt))}
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-border/40">
              <span className="text-muted-foreground">
                {dict.finance.budgets.planned}
              </span>
              <p className="text-sm font-bold text-foreground">
                {formatCurrency(detail?.totalPlanned ?? selectedBudget.totalPlanned)}
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-border/40">
              <span className="text-muted-foreground">
                {dict.finance.budgets.realized}
              </span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(detail?.totalRealized ?? selectedBudget.totalRealized)}
              </p>
            </div>
          </div>

          {/* Review Note Callout if exists */}
          {detail?.reviewNote && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 text-xs space-y-1">
              <div className="font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{dict.finance.budgetDrawer.reviewNote}:</span>
              </div>
              <p className="text-foreground/90 pl-5 leading-relaxed whitespace-pre-wrap">
                {detail.reviewNote}
              </p>
            </div>
          )}

          {/* Budget Items Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                {dict.finance.budgetDrawer.itemsTitle}
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddItem(!showAddItem)}
                className="h-7 text-[11px] gap-1 px-2"
              >
                <Plus className="h-3 w-3" />
                <span>{dict.finance.budgetDrawer.addItemButton}</span>
              </Button>
            </div>

            {/* Inline Add Item Form */}
            {showAddItem && (
              <form
                onSubmit={handleAddItemSubmit}
                className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 space-y-3"
              >
                <div className="space-y-1">
                  <Label htmlFor="item-label" className="text-xs">
                    {dict.finance.createBudgetItem.labelTitle}
                  </Label>
                  <Input
                    id="item-label"
                    value={itemLabel}
                    onChange={(e) => setItemLabel(e.target.value)}
                    placeholder={dict.finance.createBudgetItem.labelPlaceholder}
                    className="h-8 text-xs bg-background"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="item-qty" className="text-[11px]">
                      {dict.finance.createBudgetItem.qtyLabel}
                    </Label>
                    <Input
                      id="item-qty"
                      type="number"
                      step="any"
                      value={itemQty}
                      onChange={(e) => handlePriceOrQtyChange(e.target.value, itemUnitPrice)}
                      className="h-8 text-xs bg-background"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="item-unit" className="text-[11px]">
                      {dict.finance.createBudgetItem.unitLabel}
                    </Label>
                    <Input
                      id="item-unit"
                      value={itemUnit}
                      onChange={(e) => setItemUnit(e.target.value)}
                      placeholder="Hari / Pcs"
                      className="h-8 text-xs bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="item-price" className="text-[11px]">
                      {dict.finance.createBudgetItem.unitPriceLabel}
                    </Label>
                    <Input
                      id="item-price"
                      type="number"
                      value={itemUnitPrice}
                      onChange={(e) => handlePriceOrQtyChange(itemQty, e.target.value)}
                      className="h-8 text-xs bg-background"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    Total: {formatCurrency(itemPlanned)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddItem(false)}
                      className="h-7 text-xs"
                    >
                      {dict.common.cancel}
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={addBudgetItemMutation.isPending}
                      className="h-7 text-xs"
                    >
                      {addBudgetItemMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        dict.finance.createBudgetItem.submitButton
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* List of Items */}
            {isLoading ? (
              <div className="p-6 text-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                <span>{dict.common.loading}</span>
              </div>
            ) : items.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-border/80 text-center text-muted-foreground text-xs">
                {dict.finance.budgetDrawer.noItems}
              </div>
            ) : (
              <div className="divide-y divide-border/60 rounded-xl border border-border/70 overflow-hidden bg-card">
                {items.map((it) => (
                  <div key={it.id} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground">{it.label}</span>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {it.quantity} {it.unit || ''} × {formatCurrency(it.unitPrice)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-foreground">
                        {formatCurrency(it.plannedTotal)}
                      </span>
                      {it.realizedTotal && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                          Realisasi: {formatCurrency(it.realizedTotal)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="my-3" />

          {/* FSM Transitions */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
              {dict.finance.budgetDrawer.transitionsTitle}
            </h4>

            {availableTransitions.length === 0 ? (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground text-center">
                Proposal anggaran ini telah berada pada tahap akhir alur pengerjaan.
              </div>
            ) : (
              <div className="space-y-2">
                {(currentStatus === 'review' || currentStatus === 'submitted') && (
                  <div className="space-y-1">
                    <Label htmlFor="review-note" className="text-[11px]">
                      {dict.finance.budgetDrawer.reviewNote} (Opsional)
                    </Label>
                    <Textarea
                      id="review-note"
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Tambahkan catatan telaah anggaran jika diperlukan..."
                      rows={2}
                      className="text-xs"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableTransitions.map((target) => (
                    <Button
                      key={target}
                      variant={target === 'needs_revision' ? 'outline' : 'secondary'}
                      size="sm"
                      disabled={transitionMutation.isPending}
                      onClick={() => handleTransition(target)}
                      className="justify-between text-xs h-9 font-medium"
                    >
                      <span>Lanjutkan ke {dict.statuses.finance[target] ?? target}</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1 opacity-70" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
