'use client';

import React, { useState } from 'react';
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
  createFeedbackSchema,
  type CreateFeedbackInput,
} from '../schemas/team';
import { useCreateFeedback } from '../api/use-team';

interface CreateFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateFeedbackDialog({
  isOpen,
  onClose,
}: CreateFeedbackDialogProps) {
  const dict = dictionary.team.feedback.createDialog;
  const createMutation = useCreateFeedback();

  const [isAnonymous, setIsAnonymous] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createFeedbackSchema),
    defaultValues: {
      message: '',
      visibility: 'named',
      category: 'Evaluasi Posko',
      isPrivate: false,
    },
  });

  const onSubmit = async (data: CreateFeedbackInput) => {
    try {
      await createMutation.mutateAsync({
        ...data,
        visibility: isAnonymous ? 'anonymous' : 'named',
      });
      reset();
      setIsAnonymous(false);
      onClose();
    } catch {
      // handled
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent id="create-feedback-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {dict.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => onSubmit(data as CreateFeedbackInput))} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="fb-category" className="text-xs font-semibold">
              Kategori Aspirasi / Masukan
            </Label>
            <Input
              id="fb-category"
              placeholder="Contoh: Operasional, Logistik, Konsumsi..."
              {...register('category')}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fb-message" className="text-xs font-semibold">
              {dict.feedbackLabel} <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="fb-message"
              rows={4}
              placeholder={dict.feedbackPlaceholder}
              {...register('message')}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
            />
            {errors.message && (
              <p className="text-destructive text-xs">{errors.message.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="fb-anonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
            />
            <Label htmlFor="fb-anonymous" className="text-xs font-medium cursor-pointer">
              {dict.anonymousLabel}
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
