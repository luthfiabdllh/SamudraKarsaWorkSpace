'use client';

import React, { useState } from 'react';
import { useCalendarEvents } from '../api/use-calendar';
import { CalendarHeader, type CalendarViewMode } from './calendar-header';
import { CalendarAgenda } from './calendar-agenda';
import { CalendarMonthGrid } from './calendar-month-grid';
import { CalendarDrawer } from './calendar-drawer';
import { CreateEventDialog } from './create-event-dialog';
import type { CalendarEventItem } from '../types';

export function CalendarView() {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('agenda');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: events = [], isLoading } = useCalendarEvents();

  return (
    <div className="space-y-6">
      <CalendarHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      {viewMode === 'agenda' ? (
        <CalendarAgenda
          events={events}
          isLoading={isLoading}
          onSelectEvent={setSelectedEvent}
        />
      ) : (
        <CalendarMonthGrid
          events={events}
          onSelectEvent={setSelectedEvent}
        />
      )}

      {/* Slide-over Drawer for Event Details & RSVP */}
      <CalendarDrawer
        event={selectedEvent}
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Modal to schedule new event */}
      <CreateEventDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
