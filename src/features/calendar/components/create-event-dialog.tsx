'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { id as dictionary } from '@/lib/dictionaries/id';
import {
  createCalendarEventSchema,
  type CreateCalendarEventInput,
} from '../schemas/calendar';
import { useCreateCalendarEvent } from '../api/use-calendar';
import { CALENDAR_EVENT_TYPES } from '../types';

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEventDialog({
  isOpen,
  onClose,
}: CreateEventDialogProps) {
  const dict = dictionary.calendar.createDialog;
  const eventTypeLabels = dictionary.types.calendarEvents;
  const createMutation = useCreateCalendarEvent();

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCalendarEventInput>({
    resolver: zodResolver(createCalendarEventSchema),
    defaultValues: {
      title: '',
      eventType: 'field_activity',
      startAt: now.toISOString().slice(0, 16),
      endAt: oneHourLater.toISOString().slice(0, 16),
      location: '',
      meetingLink: '',
      agenda: '',
    },
  });

  const onSubmit = async (data: CreateCalendarEventInput) => {
    try {
      await createMutation.mutateAsync({
        ...data,
        startAt: new Date(data.startAt).toISOString(),
        endAt: new Date(data.endAt).toISOString(),
      });
      reset();
      onClose();
    } catch {
      // handled
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent id="create-event-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {dict.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="event-title" className="text-xs font-semibold">
              {dict.titleLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="event-title"
              placeholder={dict.titlePlaceholder}
              {...register('title')}
              className="h-9 text-sm"
            />
            {errors.title && (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="event-type" className="text-xs font-semibold">
              {dict.eventTypeLabel}
            </Label>
            <select
              id="event-type"
              {...register('eventType')}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {CALENDAR_EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {eventTypeLabels[t] || t}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="event-start-at" className="text-xs font-semibold">
                {dict.startAtLabel} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="event-start-at"
                type="datetime-local"
                {...register('startAt')}
                className="h-9 text-sm"
              />
              {errors.startAt && (
                <p className="text-destructive text-xs">{errors.startAt.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event-end-at" className="text-xs font-semibold">
                {dict.endAtLabel} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="event-end-at"
                type="datetime-local"
                {...register('endAt')}
                className="h-9 text-sm"
              />
              {errors.endAt && (
                <p className="text-destructive text-xs">{errors.endAt.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="event-location" className="text-xs font-semibold">
              {dict.locationLabel}
            </Label>
            <Input
              id="event-location"
              placeholder={dict.locationPlaceholder}
              {...register('location')}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="event-meeting-link" className="text-xs font-semibold">
              Tautan Rapat Daring (Google Meet / Zoom)
            </Label>
            <Input
              id="event-meeting-link"
              placeholder="https://meet.google.com/..."
              {...register('meetingLink')}
              className="h-9 text-sm"
            />
            {errors.meetingLink && (
              <p className="text-destructive text-xs">{errors.meetingLink.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="event-agenda" className="text-xs font-semibold">
              {dict.agendaLabel}
            </Label>
            <textarea
              id="event-agenda"
              rows={3}
              placeholder={dict.agendaPlaceholder}
              {...register('agenda')}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? dict.submittingButton : dict.submitButton}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
