'use client';

import React from 'react';
import {
  Package,
  MapPin,
  User,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { id as dictionary } from '@/lib/dictionaries/id';
import { useInventoryDetail } from '../api/use-inventory';
import type { InventoryItem, InventoryMovementType } from '../types';

interface InventoryDrawerProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAddMovement: (item: InventoryItem) => void;
}

export function InventoryDrawer({
  item,
  isOpen,
  onClose,
  onOpenAddMovement,
}: InventoryDrawerProps) {
  const dict = dictionary.inventory.drawer;
  const movementLabels = dictionary.statuses.movements;

  const { data: detail, isLoading } = useInventoryDetail(item?.id ?? null);

  const formatMovementIcon = (type: InventoryMovementType) => {
    switch (type) {
      case 'inbound':
      case 'returned':
        return <ArrowDownLeft size={14} className="text-emerald-500" />;
      case 'outbound':
      case 'used':
      case 'borrowed':
        return <ArrowUpRight size={14} className="text-blue-500" />;
      case 'damaged_or_lost':
        return <AlertTriangle size={14} className="text-destructive" />;
      default:
        return <RefreshCw size={14} className="text-amber-500" />;
    }
  };

  if (!item) return null;

  const displayData = detail || item;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        id="inventory-detail-drawer"
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full bg-card"
      >
        <SheetHeader className="p-5 border-b border-border/70 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-semibold text-primary">
              {displayData.itemCode || 'INV-POSKO'}
            </span>
            {displayData.category && (
              <Badge variant="outline" className="text-xs font-normal">
                {displayData.category}
              </Badge>
            )}
          </div>
          <SheetTitle className="text-lg font-bold text-foreground">
            {displayData.name}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {dict.description}
          </SheetDescription>
        </SheetHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-border/70 bg-muted/20">
              <span className="text-[11px] text-muted-foreground font-medium">Stok Saat Ini</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-bold text-foreground">
                  {displayData.currentStock}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {displayData.unit || 'unit'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border/70 bg-muted/20">
              <span className="text-[11px] text-muted-foreground font-medium">Stok Awal</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-bold text-muted-foreground">
                  {displayData.initialStock}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {displayData.unit || 'unit'}
                </span>
              </div>
            </div>
          </div>

          {/* Location & PIC */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              {dict.specifications}
            </h4>

            <div className="flex items-center gap-2.5 text-foreground">
              <MapPin size={15} className="text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Lokasi:</span>
              <span className="font-medium">{displayData.storageLocation || 'Posko Utama'}</span>
            </div>

            <div className="flex items-center gap-2.5 text-foreground">
              <User size={15} className="text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">PIC:</span>
              <span className="font-medium">
                {displayData.pic?.fullName || displayData.pic?.email || 'Belum Ditentukan'}
              </span>
            </div>

            {displayData.note && (
              <div className="p-3 rounded-md bg-muted/30 border border-border/50 text-muted-foreground text-xs leading-relaxed">
                {displayData.note}
              </div>
            )}
          </div>

          <Separator className="bg-border/60" />

          {/* Movements Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                {dict.movementsHistory}
              </h4>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => onOpenAddMovement(item)}
              >
                <Plus size={13} />
                <span>{dict.quickMovement}</span>
              </Button>
            </div>

            {isLoading ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                Memuat riwayat mutasi...
              </div>
            ) : !detail?.movements || detail.movements.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/70 p-4">
                <Package className="h-6 w-6 text-muted-foreground/50 mx-auto mb-1.5" />
                <p>{dict.noMovements}</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {detail.movements.map((mov) => (
                  <div
                    key={mov.id}
                    className="p-3 rounded-lg border border-border/60 bg-card/60 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {formatMovementIcon(mov.movementType)}
                        <span className="font-medium text-foreground">
                          {movementLabels[mov.movementType] || mov.movementType}
                        </span>
                      </div>
                      {mov.note && (
                        <p className="text-muted-foreground text-[11px] leading-snug">
                          {mov.note}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground/70">
                        {new Date(mov.movementDate || mov.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <span
                      className={`font-semibold shrink-0 ${
                        mov.quantity > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-destructive'
                      }`}
                    >
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}{' '}
                      {displayData.unit || 'unit'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
