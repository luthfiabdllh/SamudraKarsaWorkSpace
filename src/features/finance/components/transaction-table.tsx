'use client';

import React from 'react';
import type { Transaction } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Clock,
  Inbox,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
} from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface TransactionTableProps {
  items: Transaction[];
  onVerify: (id: string) => Promise<void>;
  isVerifying: boolean;
}

export function TransactionTable({
  items,
  onVerify,
  isVerifying,
}: TransactionTableProps) {
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
          {dict.finance.transactions.emptyTitle}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {dict.finance.transactions.emptyDescription}
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
                {dict.finance.transactions.txNumber}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.transactions.date}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.transactions.type}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.transactions.category}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.transactions.amount}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.transactions.counterparty}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.transactions.status}
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                {dict.common.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((item) => {
              const isIncome = item.transactionType === 'income';
              const isVerified = Boolean(item.verifiedBy || item.verifiedAt);

              const formattedDate = item.transactionDate
                ? new Intl.DateTimeFormat('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(item.transactionDate))
                : '-';

              return (
                <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                  {/* Transaction Number */}
                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-primary whitespace-nowrap">
                    {item.transactionNumber}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                    {formattedDate}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs font-medium border gap-1 px-2 py-0.5',
                        isIncome
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                      )}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="h-3 w-3" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3" />
                      )}
                      <span>{dict.types.transactions[item.transactionType] ?? item.transactionType}</span>
                    </Badge>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5 text-xs font-medium text-foreground whitespace-nowrap">
                    {item.category}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3.5 font-bold text-xs whitespace-nowrap">
                    <span
                      className={cn(
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      )}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
                    </span>
                  </td>

                  {/* Counterparty */}
                  <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                    {item.counterparty || '-'}
                  </td>

                  {/* Verification Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {isVerified ? (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25 text-[11px] gap-1 font-normal py-0.5"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{dict.finance.transactions.verified}</span>
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25 text-[11px] gap-1 font-normal py-0.5"
                      >
                        <Clock className="h-3 w-3" />
                        <span>{dict.finance.transactions.unverified}</span>
                      </Badge>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    {!isVerified && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isVerifying}
                        onClick={() => void onVerify(item.id)}
                        className="h-7 text-xs border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        {isVerifying ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          dict.finance.transactions.verifyAction
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
