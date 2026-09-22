'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { FinanceHeader } from './finance-header';
import { BudgetTable } from './budget-table';
import { BudgetDrawer } from './budget-drawer';
import { TransactionTable } from './transaction-table';
import { DuesTable } from './dues-table';
import { CreateBudgetDialog } from './create-budget-dialog';
import { CreateTransactionDialog } from './create-transaction-dialog';
import { AddDuesPaymentDialog } from './add-dues-payment-dialog';
import {
  useBudgets,
  useTransactions,
  useDues,
  useVerifyTransaction,
} from '../api/use-finance';
import type { Budget, DuesItem } from '../types';
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/i18n';
import { toast } from 'sonner';

interface FinanceViewProps {
  userRoles?: readonly string[];
}

export function FinanceView({ userRoles = [] }: FinanceViewProps) {
  const dict = getDictionary();

  // Check role authorization (owner, co_owner, or division_head)
  const isAuthorized = useMemo(() => {
    return userRoles.some((r) =>
      ['owner', 'co_owner', 'division_head'].includes(r)
    );
  }, [userRoles]);

  const [activeTab, setActiveTab] = useState<'budgets' | 'transactions' | 'dues'>('budgets');
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [createBudgetOpen, setCreateBudgetOpen] = useState(false);
  const [createTxOpen, setCreateTxOpen] = useState(false);
  const [duesItemToPay, setDuesItemToPay] = useState<DuesItem | null>(null);

  // Queries (only run if authorized)
  const { data: rawBudgets = [], isLoading: isBudgetsLoading } = useBudgets();
  const { data: rawTransactions = [], isLoading: isTxLoading } = useTransactions();
  const { data: rawDues = [], isLoading: isDuesLoading } = useDues();

  const verifyTxMutation = useVerifyTransaction();

  // Calculate Metrics
  const metrics = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of rawTransactions) {
      const amt = parseFloat(t.amount) || 0;
      if (t.transactionType === 'income') {
        income += amt;
      } else {
        expense += amt;
      }
    }

    let planned = 0;
    for (const b of rawBudgets) {
      const amt = typeof b.totalPlanned === 'string'
        ? parseFloat(b.totalPlanned) || 0
        : (b.totalPlanned ?? 0);
      planned += amt;
    }

    return {
      balance: income - expense,
      totalIncome: income,
      totalExpense: expense,
      totalPlannedBudget: planned,
    };
  }, [rawTransactions, rawBudgets]);

  const handleVerifyTransaction = async (id: string) => {
    try {
      await verifyTxMutation.mutateAsync(id);
      toast.success(dict.finance.transactions.verifySuccess);
    } catch {
      toast.error('Gagal memverifikasi transaksi kas.');
    }
  };

  // If unauthorized, show restricted access banner
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-border/80 bg-card shadow-xs max-w-lg mx-auto my-12 space-y-4">
        <div className="p-3 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground">
          {dict.finance.restricted.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {dict.finance.restricted.subtitle}
        </p>
        <Button asChild variant="outline" size="sm" className="gap-2 text-xs mt-2">
          <Link href="/dashboard">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{dict.finance.restricted.backHome}</span>
          </Link>
        </Button>
      </div>
    );
  }

  const isLoading = isBudgetsLoading || isTxLoading || isDuesLoading;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Metrics */}
      <FinanceHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCreateBudget={() => setCreateBudgetOpen(true)}
        onOpenCreateTransaction={() => setCreateTxOpen(true)}
        metrics={metrics}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3 rounded-2xl border border-border/60 bg-muted/20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground font-medium">
            {dict.common.loading}
          </span>
        </div>
      ) : activeTab === 'budgets' ? (
        <BudgetTable
          items={rawBudgets}
          onSelectBudget={(b) => setSelectedBudget(b)}
        />
      ) : activeTab === 'transactions' ? (
        <TransactionTable
          items={rawTransactions}
          onVerify={handleVerifyTransaction}
          isVerifying={verifyTxMutation.isPending}
        />
      ) : (
        <DuesTable
          items={rawDues}
          onRecordPayment={(item) => setDuesItemToPay(item)}
        />
      )}

      {/* Budget Drawer */}
      <BudgetDrawer
        selectedBudget={selectedBudget}
        onClose={() => setSelectedBudget(null)}
      />

      {/* Create Budget Modal */}
      <CreateBudgetDialog
        open={createBudgetOpen}
        onOpenChange={setCreateBudgetOpen}
      />

      {/* Create Transaction Modal */}
      <CreateTransactionDialog
        open={createTxOpen}
        onOpenChange={setCreateTxOpen}
      />

      {/* Add Dues Payment Modal */}
      <AddDuesPaymentDialog
        item={duesItemToPay}
        onOpenChange={(open) => !open && setDuesItemToPay(null)}
      />
    </div>
  );
}
