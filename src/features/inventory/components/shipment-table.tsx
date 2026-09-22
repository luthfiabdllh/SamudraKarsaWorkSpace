'use client';

import React from 'react';
import { Truck, CheckCircle2, ArrowRight, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { id as dictionary } from '@/lib/dictionaries/id';
import type { ShipmentItem, ShipmentStatus } from '../types';

interface ShipmentTableProps {
  shipments: ShipmentItem[];
  isLoading: boolean;
  onTransition: (id: string, to: ShipmentStatus) => void;
  isTransitioning?: boolean;
}

export function ShipmentTable({
  shipments,
  isLoading,
  onTransition,
  isTransitioning,
}: ShipmentTableProps) {
  const dict = dictionary.logistics;
  const statusLabels = dictionary.statuses.shipments;

  const formatStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'processing':
        return <Badge variant="secondary" className="text-xs font-normal">{statusLabels.processing}</Badge>;
      case 'shipped':
        return <Badge variant="default" className="text-xs font-normal bg-blue-600 hover:bg-blue-600">{statusLabels.shipped}</Badge>;
      case 'delivered':
        return <Badge variant="default" className="text-xs font-normal bg-emerald-600 hover:bg-emerald-600">{statusLabels.delivered}</Badge>;
      case 'returned':
        return <Badge variant="outline" className="text-xs font-normal text-amber-600 border-amber-600">{statusLabels.returned}</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="text-xs font-normal">{statusLabels.cancelled}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs font-normal">{status}</Badge>;
    }
  };

  return (
    <div className="border border-border/70 rounded-xl overflow-hidden bg-card/60 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-muted-foreground text-xs font-semibold border-b border-border/70">
            <tr>
              <th className="py-3 px-4">{dict.shipmentsTable.packageName}</th>
              <th className="py-3 px-4">{dict.shipmentsTable.expedition}</th>
              <th className="py-3 px-4">{dict.shipmentsTable.trackingNumber}</th>
              <th className="py-3 px-4">{dict.shipmentsTable.weight}</th>
              <th className="py-3 px-4">{dict.shipmentsTable.cost}</th>
              <th className="py-3 px-4">{dict.shipmentsTable.status}</th>
              <th className="py-3 px-4 text-right">{dict.shipmentsTable.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs">Memuat manifes pengiriman logistik...</p>
                  </div>
                </td>
              </tr>
            ) : shipments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Truck className="h-9 w-9 text-muted-foreground/40" />
                    <p className="font-medium text-foreground">{dict.emptyShipments}</p>
                  </div>
                </td>
              </tr>
            ) : (
              shipments.map((s) => {
                return (
                  <tr key={s.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-foreground">{s.packageName}</div>
                      {s.contentNote && (
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs mt-0.5">
                          {s.contentNote}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-foreground">
                      {s.expedition || '-'}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                      {s.trackingNumber || '-'}
                    </td>
                    <td className="py-3 px-4 text-xs text-foreground">
                      {s.weightKg ? `${s.weightKg} kg` : '-'}
                    </td>
                    <td className="py-3 px-4 text-xs text-foreground font-mono">
                      {s.cost
                        ? new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 0,
                          }).format(Number(s.cost))
                        : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {formatStatusBadge(s.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {s.status === 'processing' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            disabled={isTransitioning}
                            onClick={() => onTransition(s.id, 'shipped')}
                          >
                            <span>Kirim</span>
                            <ArrowRight size={13} />
                          </Button>
                        )}
                        {s.status === 'shipped' && (
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
                            disabled={isTransitioning}
                            onClick={() => onTransition(s.id, 'delivered')}
                          >
                            <CheckCircle2 size={13} />
                            <span>Tiba</span>
                          </Button>
                        )}
                        {(s.status === 'processing' || s.status === 'shipped') && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-destructive hover:bg-destructive/10"
                            disabled={isTransitioning}
                            onClick={() => onTransition(s.id, 'cancelled')}
                          >
                            <XCircle size={13} />
                          </Button>
                        )}
                      </div>
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
