'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { id as dictionary } from '@/lib/dictionaries/id';
import type { InventoryMovement, InventoryMovementType } from '../types';

interface MovementTableProps {
  movements: (InventoryMovement & { itemName?: string })[];
  isLoading: boolean;
}

export function MovementTable({ movements, isLoading }: MovementTableProps) {
  const labels = dictionary.statuses.movements;

  const formatBadgeVariant = (type: InventoryMovementType) => {
    switch (type) {
      case 'inbound':
      case 'returned':
        return 'default';
      case 'borrowed':
      case 'outbound':
      case 'used':
        return 'secondary';
      case 'damaged_or_lost':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="border border-border/70 rounded-xl overflow-hidden bg-card/60 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-muted-foreground text-xs font-semibold border-b border-border/70">
            <tr>
              <th className="py-3 px-4">Waktu Mutasi</th>
              <th className="py-3 px-4">Nama Barang</th>
              <th className="py-3 px-4">Jenis Mutasi</th>
              <th className="py-3 px-4">Jumlah</th>
              <th className="py-3 px-4">Keterangan</th>
              <th className="py-3 px-4">Petugas / Peminjam</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs">Memuat riwayat mutasi barang...</p>
                  </div>
                </td>
              </tr>
            ) : movements.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="h-9 w-9 text-muted-foreground/40" />
                    <p className="font-medium text-foreground">Belum Ada Riwayat Mutasi</p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Pencatatan barang masuk, keluar, atau dipinjam akan tampil di sini.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              movements.map((mov) => {
                return (
                  <tr key={mov.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3 px-4 text-xs text-muted-foreground font-mono">
                      {new Date(mov.movementDate || mov.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {mov.itemName || 'Barang Posko'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={formatBadgeVariant(mov.movementType)} className="text-xs font-normal">
                        {labels[mov.movementType] || mov.movementType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold text-xs ${
                          mov.quantity > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-destructive'
                        }`}
                      >
                        {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs truncate">
                      {mov.note || '-'}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {mov.mover?.fullName || mov.mover?.email || '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
