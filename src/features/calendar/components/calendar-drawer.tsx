'use client';

import React from 'react';
import {
  Clock,
  MapPin,
  Video,
  Users,
  Check,
  HelpCircle,
  X,
  ExternalLink,
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
import {
  useCalendarEventDetail,
  useUpdateRsvp,
} from '../api/use-calendar';
import type { CalendarEventItem, RsvpStatus } from '../types';

interface CalendarDrawerProps {
  event: CalendarEventItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentProfileId?: string;
}

export function CalendarDrawer({
  event,
  isOpen,
  onClose,
  currentProfileId,
}: CalendarDrawerProps) {
  const dict = dictionary.calendar.drawer;
  const eventTypeLabels = dictionary.types.calendarEvents;
  const rsvpLabels = dictionary.statuses.rsvp;

  const { data: detail, isLoading } = useCalendarEventDetail(event?.id ?? null);
  const rsvpMutation = useUpdateRsvp(
    event?.id ?? '',
    currentProfileId || 'self'
  );

  if (!event) return null;

  const displayData = detail || event;

  const handleSetRsvp = (status: RsvpStatus) => {
    rsvpMutation.mutate({ status });
  };

  const formatRsvpBadge = (status: RsvpStatus) => {
    switch (status) {
      case 'attending':
        return <Badge variant="default" className="text-xs font-normal bg-emerald-600 hover:bg-emerald-600">{rsvpLabels.attending}</Badge>;
      case 'maybe':
        return <Badge variant="secondary" className="text-xs font-normal">{rsvpLabels.maybe}</Badge>;
      case 'not_attending':
        return <Badge variant="destructive" className="text-xs font-normal">{rsvpLabels.not_attending}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs font-normal">{rsvpLabels.no_response}</Badge>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        id="calendar-event-drawer"
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full bg-card"
      >
        <SheetHeader className="p-5 border-b border-border/70 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-normal">
              {eventTypeLabels[displayData.eventType] || displayData.eventType}
            </Badge>
          </div>
          <SheetTitle className="text-lg font-bold text-foreground">
            {displayData.title}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {dict.description}
          </SheetDescription>
        </SheetHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Quick RSVP Action for Current User */}
          <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {dict.rsvpSection}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs gap-1 hover:bg-emerald-500/10 hover:text-emerald-600"
                disabled={rsvpMutation.isPending}
                onClick={() => handleSetRsvp('attending')}
              >
                <Check size={14} className="text-emerald-500" />
                <span>{rsvpLabels.attending}</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs gap-1 hover:bg-amber-500/10 hover:text-amber-600"
                disabled={rsvpMutation.isPending}
                onClick={() => handleSetRsvp('maybe')}
              >
                <HelpCircle size={14} className="text-amber-500" />
                <span>{rsvpLabels.maybe}</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs gap-1 hover:bg-destructive/10 hover:text-destructive"
                disabled={rsvpMutation.isPending}
                onClick={() => handleSetRsvp('not_attending')}
              >
                <X size={14} className="text-destructive" />
                <span>{rsvpLabels.not_attending}</span>
              </Button>
            </div>
          </div>

          {/* Time & Place */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              {dict.schedule}
            </h4>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Clock size={14} className="text-primary shrink-0" />
                <span>
                  {new Date(displayData.startAt).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(displayData.endAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {displayData.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={14} className="shrink-0" />
                  <span>{displayData.location}</span>
                </div>
              )}

              {displayData.meetingLink && (
                <div className="flex items-center gap-2">
                  <Video size={14} className="text-primary shrink-0" />
                  <a
                    href={displayData.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>Masuk ke Tautan Rapat Daring</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Agenda Description */}
          {displayData.agenda && (
            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                {dict.agenda}
              </h4>
              <div className="p-3 rounded-lg bg-muted/20 border border-border/60 text-foreground leading-relaxed whitespace-pre-line">
                {displayData.agenda}
              </div>
            </div>
          )}

          {/* Attendees RSVP list */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users size={13} />
              <span>{dict.attendeesTitle}</span>
            </h4>

            {isLoading ? (
              <div className="py-2 text-xs text-muted-foreground">Memuat peserta...</div>
            ) : !detail?.attendees || detail.attendees.length === 0 ? (
              <div className="p-3 rounded-lg border border-dashed border-border/70 text-muted-foreground text-xs text-center">
                {dict.noAttendees}
              </div>
            ) : (
              <div className="space-y-2">
                {detail.attendees.map((att) => (
                  <div
                    key={att.id}
                    className="p-2.5 rounded-lg border border-border/60 bg-card/60 flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="font-medium text-foreground truncate">
                      {att.profile?.fullName || att.profile?.email || 'Peserta'}
                    </span>
                    {formatRsvpBadge(att.status)}
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
