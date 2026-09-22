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
  createPartnerSchema,
  type CreatePartnerInput,
} from '../schemas/partner';
import { useCreatePartner } from '../api/use-partners';

interface CreatePartnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePartnerDialog({
  isOpen,
  onClose,
}: CreatePartnerDialogProps) {
  const dict = dictionary.partners.createDialog;
  const createMutation = useCreatePartner();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePartnerInput>({
    resolver: zodResolver(createPartnerSchema),
    defaultValues: {
      name: '',
      category: '',
      industry: '',
      contactPerson: '',
      contactInfo: '',
      targetSupport: '',
      agreedValue: '',
      inKindSupport: '',
    },
  });

  const onSubmit = async (data: CreatePartnerInput) => {
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
      <DialogContent id="create-partner-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {dict.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="partner-name" className="text-xs font-semibold">
              {dict.nameLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="partner-name"
              placeholder={dict.namePlaceholder}
              {...register('name')}
              className="h-9 text-sm"
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="partner-category" className="text-xs font-semibold">
                {dict.categoryLabel}
              </Label>
              <Input
                id="partner-category"
                placeholder={dict.categoryPlaceholder}
                {...register('category')}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="partner-industry" className="text-xs font-semibold">
                {dict.industryLabel}
              </Label>
              <Input
                id="partner-industry"
                placeholder={dict.industryPlaceholder}
                {...register('industry')}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="partner-contact-person" className="text-xs font-semibold">
                {dict.contactPersonLabel}
              </Label>
              <Input
                id="partner-contact-person"
                placeholder={dict.contactPersonPlaceholder}
                {...register('contactPerson')}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="partner-contact-info" className="text-xs font-semibold">
                {dict.contactInfoLabel}
              </Label>
              <Input
                id="partner-contact-info"
                placeholder={dict.contactInfoPlaceholder}
                {...register('contactInfo')}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="partner-target" className="text-xs font-semibold">
                {dict.targetSupportLabel}
              </Label>
              <Input
                id="partner-target"
                placeholder="Contoh: 10000000"
                {...register('targetSupport')}
                className="h-9 text-sm"
              />
              {errors.targetSupport && (
                <p className="text-destructive text-xs">{errors.targetSupport.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="partner-agreed" className="text-xs font-semibold">
                {dict.agreedValueLabel}
              </Label>
              <Input
                id="partner-agreed"
                placeholder="Contoh: 7500000"
                {...register('agreedValue')}
                className="h-9 text-sm"
              />
              {errors.agreedValue && (
                <p className="text-destructive text-xs">{errors.agreedValue.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="partner-inkind" className="text-xs font-semibold">
              {dict.inKindSupportLabel}
            </Label>
            <Input
              id="partner-inkind"
              placeholder={dict.inKindSupportPlaceholder}
              {...register('inKindSupport')}
              className="h-9 text-sm"
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
