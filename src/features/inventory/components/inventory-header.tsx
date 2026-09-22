'use client';

import React from 'react';
import { Package, AlertCircle, RefreshCw, Truck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { id as dictionary } from '@/lib/dictionaries/id';

export type InventoryTab = 'catalog' | 'movements' | 'logistics';

interface InventoryHeaderProps {
  activeTab: InventoryTab;
  onTabChange: (tab: InventoryTab) => void;
  totalItems: number;
  lowStockCount: number;
  borrowedCount: number;
  activeShipmentsCount: number;
  onOpenCreate: () => void;
}

export function InventoryHeader({
  activeTab,
  onTabChange,
  totalItems,
  lowStockCount,
  borrowedCount,
  activeShipmentsCount,
  onOpenCreate,
}: InventoryHeaderProps) {
  const dict = dictionary.inventory;

  const getActionLabel = () => {
    switch (activeTab) {
      case 'catalog':
        return 'Tambah Barang';
      case 'movements':
        return 'Catat Mutasi';
      case 'logistics':
        return 'Tambah Logistik';
    }
  };

  return (
    <div className="space-y-4">
      {/* Title & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Package className="h-7 w-7 text-primary shrink-0" aria-hidden="true" />
            {dict.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {dict.subtitle}
          </p>
        </div>

        <Button
          id="inventory-primary-action-btn"
          onClick={onOpenCreate}
          className="gap-2 shadow-sm shrink-0"
        >
          <Plus size={16} aria-hidden="true" />
          <span>{getActionLabel()}</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{dict.metrics.totalItems}</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{totalItems}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Package size={18} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{dict.metrics.lowStock}</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{lowStockCount}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertCircle size={18} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{dict.metrics.borrowed}</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{borrowedCount}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <RefreshCw size={18} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{dict.metrics.activeShipments}</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{activeShipmentsCount}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Truck size={18} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/80 gap-6">
        <button
          type="button"
          onClick={() => onTabChange('catalog')}
          className={`pb-2.5 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Package size={16} />
          {dict.tabs.catalog}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('movements')}
          className={`pb-2.5 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'movements'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <RefreshCw size={16} />
          {dict.tabs.movements}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('logistics')}
          className={`pb-2.5 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'logistics'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Truck size={16} />
          {dict.tabs.logistics}
        </button>
      </div>
    </div>
  );
}
