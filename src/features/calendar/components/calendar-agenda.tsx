'use client';

import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Video, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { id as dictionary } from '@/lib/dictionaries/id';
import type { CalendarEventItem, CalendarEventType } from '../types';

interface CalendarAgendaProps {
  events: CalendarEventItem[];
  isLoading: boolean;
  onSelectEvent: (event: CalendarEventItem) => void;
}

export function CalendarAgenda({
  events,
  isLoading,
  onSelectEvent,
}: CalendarAgendaProps) {
  const dict = dictionary.calendar;
  const eventTypeLabels = dictionary.types.calendarEvents;

  const formatEventTypeBadge = (type: CalendarEventType) => {
    switch (type) {
      case 'weekly_meeting':
      case 'all_hands_meeting':
        return <Badge variant="default" className="text-xs font-normal bg-primary">{eventTypeLabels[type]}</Badge>;
      case 'daily_meeting':
      case 'division_meeting':
        return <Badge variant="secondary" className="text-xs font-normal">{eventTypeLabels[type]}</Badge>;
      case 'field_activity':
        return <Badge variant="default" className="text-xs font-normal bg-emerald-600 hover:bg-emerald-600">{eventTypeLabels[type]}</Badge>;
      case 'audience':
        return <Badge variant="default" className="text-xs font-normal bg-amber-600 hover:bg-amber-600">{eventTypeLabels[type]}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs font-normal">{eventTypeLabels[type] || type}</Badge>;
    }
  };

  // Sort events ascending by startAt
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );

  if (isLoading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs">Memuat agenda kegiatan kalender...</p>
        </div>
      </div>
    );
  }

  if (sortedEvents.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground border border-dashed border-border/70 rounded-xl bg-card/40">
        <div className="flex flex-col items-center justify-center gap-2">
          <CalendarIcon className="h-9 w-9 text-muted-foreground/40" />
          <p className="font-medium text-foreground">{dict.emptyTitle}</p>
          <p className="text-xs text-muted-foreground max-w-xs">{dict.emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedEvents.map((evt) => {
        const startDate = new Date(evt.startAt);
        const endDate = new Date(evt.endAt);

        return (
          <div
            key={evt.id}
            onClick={() => onSelectEvent(evt)}
            className="p-4 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/30 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-xs"
          >
            <div className="flex items-start gap-3.5">
              {/* Date Box */}
              <div className="h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex flex-col items-center justify-center shrink-0 text-primary">
                <span className="text-[10px] uppercase font-semibold leading-none">
                  {startDate.toLocaleDateString('id-ID', { month: 'short' })}
                </span>
                <span className="text-lg font-bold leading-tight">
                  {startDate.getDate()}
                </span>
              </div>

              {/* Title & Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                    {evt.title}
                  </span>
                  {formatEventTypeBadge(evt.eventType)}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="shrink-0" />
                    <span>
                      {startDate.toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {endDate.toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {evt.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate max-w-40">{evt.location}</span>
                    </div>
                  )}

                  {evt.meetingLink && (
                    <div className="flex items-center gap-1 text-primary">
                      <Video size={12} className="shrink-0" />
                      <span>Tautan Daring</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground group-hover:text-primary self-end sm:self-center"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
