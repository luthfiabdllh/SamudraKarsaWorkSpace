'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CalendarEventItem } from '../types';

interface CalendarMonthGridProps {
  events: CalendarEventItem[];
  onSelectEvent: (event: CalendarEventItem) => void;
}

export function CalendarMonthGrid({
  events,
  onSelectEvent,
}: CalendarMonthGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const getEventsForDay = (day: number) => {
    return events.filter((evt) => {
      const d = new Date(evt.startAt);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      );
    });
  };

  return (
    <div className="border border-border/70 rounded-xl overflow-hidden bg-card/60 shadow-xs p-4 space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-foreground capitalize">
          {monthName}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handlePrevMonth}
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleNextMonth}
            aria-label="Bulan berikutnya"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground pb-2 border-b border-border/70">
        {weekDays.map((wd) => (
          <div key={wd} className="py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Date Cells */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Leading empty cells */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-20 p-1.5 rounded-lg bg-muted/10 opacity-30" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDay(day);
          const isToday =
            new Date().getFullYear() === year &&
            new Date().getMonth() === month &&
            new Date().getDate() === day;

          return (
            <div
              key={`day-${day}`}
              className={`min-h-20 p-1.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                isToday
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border/50 bg-card hover:bg-accent/20'
              }`}
            >
              <span
                className={`text-xs font-bold inline-block h-5 w-5 rounded-full text-center leading-5 ${
                  isToday
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground'
                }`}
              >
                {day}
              </span>

              {/* Event indicators */}
              <div className="space-y-1 mt-1">
                {dayEvents.slice(0, 2).map((evt) => (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => onSelectEvent(evt)}
                    className="w-full text-left truncate text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors block"
                  >
                    {evt.title}
                  </button>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[9px] text-muted-foreground font-medium pl-1 block">
                    +{dayEvents.length - 2} acara
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
