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
  createAnnouncementSchema,
  type CreateAnnouncementInput,
} from '../schemas/team';
import { useCreateAnnouncement } from '../api/use-team';

interface CreateAnnouncementDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAnnouncementDialog({
  isOpen,
  onClose,
}: CreateAnnouncementDialogProps) {
  const dict = dictionary.team.announcements.createDialog;
  const createMutation = useCreateAnnouncement();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: {
      title: '',
      body: '',
      pinned: false,
    },
  });

  const onSubmit = async (data: CreateAnnouncementInput) => {
    try {
      await createMutation.mutateAsync(data);
      reset();
      onClose();
    } catch {
      // handled
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent id="create-announcement-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {dict.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => onSubmit(data as CreateAnnouncementInput))} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="ann-title" className="text-xs font-semibold">
              {dict.titleLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ann-title"
              placeholder={dict.titlePlaceholder}
              {...register('title')}
              className="h-9 text-sm"
            />
            {errors.title && (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ann-content" className="text-xs font-semibold">
              {dict.contentLabel} <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="ann-content"
              rows={4}
              placeholder={dict.contentPlaceholder}
              {...register('body')}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
            />
            {errors.body && (
              <p className="text-destructive text-xs">{errors.body.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="ann-pinned"
              type="checkbox"
              {...register('pinned')}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
            />
            <Label htmlFor="ann-pinned" className="text-xs font-medium cursor-pointer">
              {dict.pinLabel}
            </Label>
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
