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
  addBenefitSchema,
  type AddBenefitInput,
} from '../schemas/partner';
import { useAddBenefit } from '../api/use-partners';
import type { PartnerItem } from '../types';

interface AddBenefitDialogProps {
  partner: PartnerItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AddBenefitDialog({
  partner,
  isOpen,
  onClose,
}: AddBenefitDialogProps) {
  const dict = dictionary.partners.benefitDialog;
  const addBenefitMutation = useAddBenefit(partner?.id ?? '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addBenefitSchema),
    defaultValues: {
      benefitDescription: '',
      deadline: '',
      proofUrl: '',
      status: 'pending',
    },
  });

  const onSubmit = async (data: AddBenefitInput) => {
    try {
      await addBenefitMutation.mutateAsync(data);
      reset();
      onClose();
    } catch {
      // handled
    }
  };

  if (!partner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent id="add-benefit-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {dict.description} ({partner.name})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => onSubmit(data as AddBenefitInput))} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="benefit-desc" className="text-xs font-semibold">
              {dict.descriptionLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="benefit-desc"
              placeholder={dict.descriptionPlaceholder}
              {...register('benefitDescription')}
              className="h-9 text-sm"
            />
            {errors.benefitDescription && (
              <p className="text-destructive text-xs">{errors.benefitDescription.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="benefit-deadline" className="text-xs font-semibold">
              {dict.deadlineLabel}
            </Label>
            <Input
              id="benefit-deadline"
              type="date"
              {...register('deadline')}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="benefit-proof" className="text-xs font-semibold">
              {dict.proofUrlLabel}
            </Label>
            <Input
              id="benefit-proof"
              placeholder="https://..."
              {...register('proofUrl')}
              className="h-9 text-sm"
            />
            {errors.proofUrl && (
              <p className="text-destructive text-xs">{errors.proofUrl.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={addBenefitMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={addBenefitMutation.isPending}
            >
              {addBenefitMutation.isPending ? dict.submittingButton : dict.submitButton}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
