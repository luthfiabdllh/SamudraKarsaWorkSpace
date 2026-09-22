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
  createMeetingSchema,
  type CreateMeetingInput,
} from '../schemas/meeting';
import { useCreateMeeting } from '../api/use-meetings';
import { MEETING_TYPES } from '../types';

interface CreateMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMeetingDialog({
  isOpen,
  onClose,
}: CreateMeetingDialogProps) {
  const dict = dictionary.meetings.createDialog;
  const typeLabels = dictionary.types.meetings;
  const createMutation = useCreateMeeting();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMeetingInput>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      title: '',
      meetingType: 'coordination_meeting',
      heldAt: new Date().toISOString().slice(0, 16),
      locationOrMedia: '',
      agenda: '',
      summary: '',
    },
  });

  const onSubmit = async (data: CreateMeetingInput) => {
    try {
      await createMutation.mutateAsync({
        ...data,
        heldAt: new Date(data.heldAt).toISOString(),
      });
      reset();
      onClose();
    } catch {
      // handled
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent id="create-meeting-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {dict.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="meeting-title" className="text-xs font-semibold">
              {dict.titleLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="meeting-title"
              placeholder={dict.titlePlaceholder}
              {...register('title')}
              className="h-9 text-sm"
            />
            {errors.title && (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="meeting-type" className="text-xs font-semibold">
                {dict.meetingTypeLabel}
              </Label>
              <select
                id="meeting-type"
                {...register('meetingType')}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {MEETING_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {typeLabels[t] || t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="meeting-held-at" className="text-xs font-semibold">
                {dict.heldAtLabel} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="meeting-held-at"
                type="datetime-local"
                {...register('heldAt')}
                className="h-9 text-sm"
              />
              {errors.heldAt && (
                <p className="text-destructive text-xs">{errors.heldAt.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="meeting-location" className="text-xs font-semibold">
              {dict.locationLabel}
            </Label>
            <Input
              id="meeting-location"
              placeholder={dict.locationPlaceholder}
              {...register('locationOrMedia')}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="meeting-agenda" className="text-xs font-semibold">
              {dict.agendaLabel}
            </Label>
            <textarea
              id="meeting-agenda"
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
