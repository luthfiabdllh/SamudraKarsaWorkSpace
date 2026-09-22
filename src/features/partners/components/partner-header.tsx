'use client';

import React from 'react';
import { Handshake, Target, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { id as dictionary } from '@/lib/dictionaries/id';

interface PartnerHeaderProps {
  totalPartners: number;
  totalTarget: number;
  totalReceived: number;
  activeProspects: number;
  onOpenCreate: () => void;
}

export function PartnerHeader({
  totalPartners,
  totalTarget,
  totalReceived,
  activeProspects,
  onOpenCreate,
}: PartnerHeaderProps) {
  const dict = dictionary.partners;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Title & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Handshake className="h-7 w-7 text-primary shrink-0" aria-hidden="true" />
            {dict.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {dict.subtitle}
          </p>
        </div>

        <Button
          id="partner-primary-action-btn"
          onClick={onOpenCreate}
          className="gap-2 shadow-sm shrink-0"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Daftarkan Mitra Baru</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{dict.metrics.totalPartners}</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{totalPartners}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Handshake size={18} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{dict.metrics.targetSupport}</p>
              <p className="text-base font-bold text-foreground mt-0.5 font-mono">{formatIDR(totalTarget)}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Target size={18} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{dict.metrics.fundReceived}</p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">{formatIDR(totalReceived)}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <DollarSign size={18} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-xs">
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{dict.metrics.activeProspects}</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{activeProspects}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <TrendingUp size={18} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
