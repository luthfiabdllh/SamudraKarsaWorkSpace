'use client';

import React from 'react';
import type { Budget, BudgetStatus } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Inbox } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface BudgetTableProps {
  items: Budget[];
  onSelectBudget: (budget: Budget) => void;
}

function getBudgetStatusBadgeClass(status: BudgetStatus): string {
  switch (status) {
    case 'draft':
      return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20';
    case 'submitted':
      return 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30';
    case 'review':
      return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
    case 'needs_revision':
      return 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30';
    case 'approved':
      return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
    case 'in_progress':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
    case 'done':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function BudgetTable({ items, onSelectBudget }: BudgetTableProps) {
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
          {dict.finance.budgets.emptyTitle}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {dict.finance.budgets.emptyDescription}
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
                {dict.finance.budgets.budgetNumber}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.budgets.title}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.budgets.division}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.budgets.planned}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.budgets.realized}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.finance.budgets.status}
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                {dict.finance.budgets.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelectBudget(item)}
                className="group hover:bg-muted/40 cursor-pointer transition-colors"
              >
                {/* Budget Number */}
                <td className="px-4 py-3.5 font-mono text-xs font-semibold text-primary whitespace-nowrap">
                  {item.budgetNumber}
                </td>

                {/* Title */}
                <td className="px-4 py-3.5 max-w-xs">
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {item.title}
                  </div>
                  {item.programName && (
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Program: {item.programName}
                    </div>
                  )}
                </td>

                {/* Division */}
                <td className="px-4 py-3.5 text-xs text-foreground/90 whitespace-nowrap">
                  {item.divisionName || '-'}
                </td>

                {/* Planned Total */}
                <td className="px-4 py-3.5 font-medium text-xs text-foreground whitespace-nowrap">
                  {formatCurrency(item.totalPlanned)}
                </td>

                {/* Realized Total */}
                <td className="px-4 py-3.5 font-medium text-xs text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  {formatCurrency(item.totalRealized)}
                </td>

                {/* Status */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs font-medium border px-2 py-0.5',
                      getBudgetStatusBadgeClass(item.status)
                    )}
                  >
                    {dict.statuses.finance[item.status] ?? item.status}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBudget(item);
                    }}
                    className="h-8 px-2 text-xs text-muted-foreground group-hover:text-primary"
                  >
                    <span>{dict.common.viewDetails}</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
