'use client';

import React from 'react';
import { Car, CheckCircle2, Play, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { id as dictionary } from '@/lib/dictionaries/id';
import type { TripItem, TripStatus } from '../types';

interface TripTableProps {
  trips: TripItem[];
  isLoading: boolean;
  onTransition: (id: string, to: TripStatus) => void;
  isTransitioning?: boolean;
}

export function TripTable({
  trips,
  isLoading,
  onTransition,
  isTransitioning,
}: TripTableProps) {
  const dict = dictionary.logistics;
  const statusLabels = dictionary.statuses.trips;

  const formatStatusBadge = (status: TripStatus) => {
    switch (status) {
      case 'planned':
        return <Badge variant="secondary" className="text-xs font-normal">{statusLabels.planned}</Badge>;
      case 'ongoing':
        return <Badge variant="default" className="text-xs font-normal bg-blue-600 hover:bg-blue-600">{statusLabels.ongoing}</Badge>;
      case 'completed':
        return <Badge variant="default" className="text-xs font-normal bg-emerald-600 hover:bg-emerald-600">{statusLabels.completed}</Badge>;
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
              <th className="py-3 px-4">{dict.tripsTable.title}</th>
              <th className="py-3 px-4">{dict.tripsTable.tripKind}</th>
              <th className="py-3 px-4">{dict.tripsTable.scheduledAt}</th>
              <th className="py-3 px-4">{dict.tripsTable.vehicle}</th>
              <th className="py-3 px-4">{dict.tripsTable.passengerCount}</th>
              <th className="py-3 px-4">{dict.tripsTable.status}</th>
              <th className="py-3 px-4 text-right">{dict.tripsTable.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs">Memuat log perjalanan kendaraan...</p>
                  </div>
                </td>
              </tr>
            ) : trips.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Car className="h-9 w-9 text-muted-foreground/40" />
                    <p className="font-medium text-foreground">{dict.emptyTrips}</p>
                  </div>
                </td>
              </tr>
            ) : (
              trips.map((t) => {
                return (
                  <tr key={t.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-foreground">{t.title}</div>
                      {t.note && (
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs mt-0.5">
                          {t.note}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-foreground">
                      <Badge variant="outline" className="text-xs font-normal">
                        {t.tripKind}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {t.scheduledAt
                        ? new Date(t.scheduledAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </td>
                    <td className="py-3 px-4 text-xs text-foreground">
                      {t.vehicleNote || '-'}
                    </td>
                    <td className="py-3 px-4 text-xs text-foreground">
                      {t.passengerCount ? `${t.passengerCount} orang` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {formatStatusBadge(t.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.status === 'planned' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            disabled={isTransitioning}
                            onClick={() => onTransition(t.id, 'ongoing')}
                          >
                            <Play size={13} />
                            <span>Mulai</span>
                          </Button>
                        )}
                        {t.status === 'ongoing' && (
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
                            disabled={isTransitioning}
                            onClick={() => onTransition(t.id, 'completed')}
                          >
                            <CheckCircle2 size={13} />
                            <span>Selesai</span>
                          </Button>
                        )}
                        {(t.status === 'planned' || t.status === 'ongoing') && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-destructive hover:bg-destructive/10"
                            disabled={isTransitioning}
                            onClick={() => onTransition(t.id, 'cancelled')}
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
