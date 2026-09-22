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
  createMeetingDecisionSchema,
  type CreateMeetingDecisionInput,
} from '../schemas/meeting';
import { useCreateMeetingDecision } from '../api/use-meetings';
import type { MeetingItem } from '../types';

interface CreateDecisionDialogProps {
  meeting: MeetingItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateDecisionDialog({
  meeting,
  isOpen,
  onClose,
}: CreateDecisionDialogProps) {
  const dict = dictionary.meetings.decisionDialog;
  const priorityLabels = dictionary.priorities;
  const createMutation = useCreateMeetingDecision(meeting?.id ?? '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMeetingDecisionInput>({
    resolver: zodResolver(createMeetingDecisionSchema),
    defaultValues: {
      decisionText: '',
      dueDate: '',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: CreateMeetingDecisionInput) => {
    try {
      await createMutation.mutateAsync(data);
      reset();
      onClose();
    } catch {
      // handled
    }
  };

  if (!meeting) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent id="create-decision-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {dict.description} ({meeting.title})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="dec-text" className="text-xs font-semibold">
              {dict.decisionTextLabel} <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="dec-text"
              rows={3}
              placeholder={dict.decisionTextPlaceholder}
              {...register('decisionText')}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
            />
            {errors.decisionText && (
              <p className="text-destructive text-xs">{errors.decisionText.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dec-priority" className="text-xs font-semibold">
                {dict.priorityLabel}
              </Label>
              <select
                id="dec-priority"
                {...register('priority')}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="low">{priorityLabels.low}</option>
                <option value="medium">{priorityLabels.medium}</option>
                <option value="high">{priorityLabels.high}</option>
                <option value="urgent">{priorityLabels.urgent}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dec-due-date" className="text-xs font-semibold">
                {dict.dueDateLabel}
              </Label>
              <Input
                id="dec-due-date"
                type="date"
                {...register('dueDate')}
                className="h-9 text-sm"
              />
            </div>
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
