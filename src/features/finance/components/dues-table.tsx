'use client';

import React from 'react';
import type { DuesItem, DuesStatus } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Inbox, CreditCard } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface DuesTableProps {
  items: DuesItem[];
  onRecordPayment: (item: DuesItem) => void;
}

function getDuesStatusBadgeClass(status: DuesStatus): string {
  switch (status) {
    case 'paid':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
    case 'installment':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
    case 'unpaid':
      return 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function DuesTable({ items, onRecordPayment }: DuesTableProps) {
  const dict = getDictionary();

  const formatCurrency = (val?: string | number | null) => {
    if (!val) return 'Rp 0';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card">
        <div className="p-3 rounded-full bg-muted/60 text-muted-foreground mb-3">
          <Inbox className="h-8 w-8" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          {dict.finance.dues.emptyTitle}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {dict.finance.dues.emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/80 bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.dues.memberName}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.dues.period}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.dues.targetAmount}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.dues.paidAmount}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.dues.status}
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                {dict.finance.dues.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                {/* Member Name */}
                <td className="px-4 py-3.5">
                  <div className="font-semibold text-xs text-foreground">
                    {item.memberName || 'Anggota Organisasi'}
                  </div>
                  {item.memberEmail && (
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {item.memberEmail}
                    </div>
                  )}
                </td>

                {/* Period */}
                <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                  {item.periodName || '-'}
                </td>

                {/* Target Amount */}
                <td className="px-4 py-3.5 font-medium text-xs text-foreground whitespace-nowrap">
                  {formatCurrency(item.targetAmount)}
                </td>

                {/* Paid Amount */}
                <td className="px-4 py-3.5 font-bold text-xs text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  {formatCurrency(item.paidAmount)}
                </td>

                {/* Status */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs font-medium border px-2 py-0.5',
                      getDuesStatusBadgeClass(item.status)
                    )}
                  >
                    {dict.statuses.dues[item.status] ?? item.status}
                  </Badge>
                </td>

                {/* Action */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  {item.status !== 'paid' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRecordPayment(item)}
                      className="h-7 text-xs gap-1.5"
                    >
                      <CreditCard className="h-3 w-3" />
                      <span>{dict.finance.dues.recordPayment}</span>
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
