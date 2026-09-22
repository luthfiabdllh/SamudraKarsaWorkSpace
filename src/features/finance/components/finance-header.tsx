'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  Plus,
  ArrowUpDown,
  CreditCard,
} from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface FinanceHeaderProps {
  activeTab: 'budgets' | 'transactions' | 'dues';
  onTabChange: (tab: 'budgets' | 'transactions' | 'dues') => void;
  onOpenCreateBudget: () => void;
  onOpenCreateTransaction: () => void;
  metrics: {
    balance: number;
    totalIncome: number;
    totalExpense: number;
    totalPlannedBudget: number;
  };
}

export function FinanceHeader({
  activeTab,
  onTabChange,
  onOpenCreateBudget,
  onOpenCreateTransaction,
  metrics,
}: FinanceHeaderProps) {
  const dict = getDictionary();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner Row: Title + Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {dict.finance.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {dict.finance.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === 'budgets' ? (
            <Button onClick={onOpenCreateBudget} className="gap-2 shadow-xs">
              <Plus className="h-4 w-4" />
              <span>{dict.finance.actions.createBudget}</span>
            </Button>
          ) : activeTab === 'transactions' ? (
            <Button onClick={onOpenCreateTransaction} className="gap-2 shadow-xs">
              <Plus className="h-4 w-4" />
              <span>{dict.finance.actions.createTransaction}</span>
            </Button>
          ) : null}
        </div>
      </div>

      {/* Financial Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Saldo Kas */}
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {dict.finance.metrics.balance}
            </span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-foreground mt-2">
            {formatCurrency(metrics.balance)}
          </div>
        </div>

        {/* Metric 2: Total Pemasukan */}
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {dict.finance.metrics.totalIncome}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {formatCurrency(metrics.totalIncome)}
          </div>
        </div>

        {/* Metric 3: Total Pengeluaran */}
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {dict.finance.metrics.totalExpense}
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-2">
            {formatCurrency(metrics.totalExpense)}
          </div>
        </div>

        {/* Metric 4: Pagu Rencana Anggaran */}
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {dict.finance.metrics.totalPlannedBudget}
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-foreground mt-2">
            {formatCurrency(metrics.totalPlannedBudget)}
          </div>
        </div>
      </div>

      {/* Tabs Selector Bar */}
      <div className="inline-flex rounded-xl border border-border p-1 bg-muted/40">
        <Button
          type="button"
          variant={activeTab === 'budgets' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('budgets')}
          className={cn(
            'h-8 px-3.5 gap-2 text-xs font-medium',
            activeTab === 'budgets' && 'shadow-xs bg-background text-foreground'
          )}
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          <span>{dict.finance.tabs.budgets}</span>
        </Button>

        <Button
          type="button"
          variant={activeTab === 'transactions' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('transactions')}
          className={cn(
            'h-8 px-3.5 gap-2 text-xs font-medium',
            activeTab === 'transactions' && 'shadow-xs bg-background text-foreground'
          )}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          <span>{dict.finance.tabs.transactions}</span>
        </Button>

        <Button
          type="button"
          variant={activeTab === 'dues' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('dues')}
          className={cn(
            'h-8 px-3.5 gap-2 text-xs font-medium',
            activeTab === 'dues' && 'shadow-xs bg-background text-foreground'
          )}
        >
          <CreditCard className="h-3.5 w-3.5" />
          <span>{dict.finance.tabs.dues}</span>
        </Button>
      </div>
    </div>
  );
}
