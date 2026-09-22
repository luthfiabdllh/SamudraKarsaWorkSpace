'use client';

import React from 'react';
import { Calendar as CalendarIcon, Plus, List, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { id as dictionary } from '@/lib/dictionaries/id';

export type CalendarViewMode = 'agenda' | 'month';

interface CalendarHeaderProps {
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onOpenCreate: () => void;
}

export function CalendarHeader({
  viewMode,
  onViewModeChange,
  onOpenCreate,
}: CalendarHeaderProps) {
  const dict = dictionary.calendar;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <CalendarIcon className="h-7 w-7 text-primary shrink-0" aria-hidden="true" />
          {dict.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {dict.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        {/* Toggle View Mode */}
        <div className="flex items-center rounded-lg border border-border/70 p-0.5 bg-muted/30">
          <button
            type="button"
            onClick={() => onViewModeChange('agenda')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
              viewMode === 'agenda'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List size={14} />
            <span>{dict.viewModes.agenda}</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('month')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
              viewMode === 'month'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Grid3X3 size={14} />
            <span>{dict.viewModes.month}</span>
          </button>
        </div>

        <Button
          id="calendar-primary-action-btn"
          onClick={onOpenCreate}
          className="gap-2 shadow-sm shrink-0"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Jadwalkan Acara</span>
        </Button>
      </div>
    </div>
  );
}
