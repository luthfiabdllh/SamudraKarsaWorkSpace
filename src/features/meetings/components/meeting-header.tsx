'use client';

import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { id as dictionary } from '@/lib/dictionaries/id';

interface MeetingHeaderProps {
  onOpenCreate: () => void;
}

export function MeetingHeader({ onOpenCreate }: MeetingHeaderProps) {
  const dict = dictionary.meetings;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Clock className="h-7 w-7 text-primary shrink-0" aria-hidden="true" />
          {dict.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {dict.subtitle}
        </p>
      </div>

      <Button
        id="meeting-primary-action-btn"
        onClick={onOpenCreate}
        className="gap-2 shadow-sm shrink-0"
      >
        <Plus size={16} aria-hidden="true" />
        <span>Jadwalkan Rapat Baru</span>
      </Button>
    </div>
  );
}
