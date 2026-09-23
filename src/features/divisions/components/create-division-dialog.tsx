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
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { id as dictionary } from '@/lib/dictionaries/id';
import {
  createDivisionSchema,
  type CreateDivisionInput,
} from '../schemas/division';
import { useCreateDivision } from '../api/use-divisions';

interface CreateDivisionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nextSortOrder?: number;
}

export function CreateDivisionDialog({
  isOpen,
  onClose,
  nextSortOrder = 10,
}: CreateDivisionDialogProps) {
  const dict = dictionary.divisions.createDialog;
  const createMutation = useCreateDivision();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createDivisionSchema),
    defaultValues: {
      name: '',
      code: '',
      icon: '🏢',
      description: '',
      sortOrder: nextSortOrder,
    },
  });

  const onSubmit = async (data: CreateDivisionInput) => {
    try {
      await createMutation.mutateAsync(data);
      reset();
      onClose();
    } catch {
      // handled in mutation onError
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {dict.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((d) => onSubmit(d as CreateDivisionInput))} className="space-y-4 py-2">
          {/* Division Name */}
          <div className="space-y-1.5">
            <Label htmlFor="div-name" className="text-xs font-semibold">
              {dict.nameLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="div-name"
              placeholder={dict.namePlaceholder}
              {...register('name')}
              className="text-sm"
            />
            {errors.name && (
              <p className="text-[11px] text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Division Code */}
            <div className="space-y-1.5">
              <Label htmlFor="div-code" className="text-xs font-semibold">
                {dict.codeLabel} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="div-code"
                placeholder={dict.codePlaceholder}
                {...register('code')}
                className="font-mono text-xs"
              />
              {errors.code && (
                <p className="text-[11px] text-destructive">{errors.code.message}</p>
              )}
            </div>

            {/* Division Icon */}
            <div className="space-y-1.5">
              <Label htmlFor="div-icon" className="text-xs font-semibold">
                {dict.iconLabel}
              </Label>
              <Input
                id="div-icon"
                placeholder={dict.iconPlaceholder}
                {...register('icon')}
                className="text-sm"
              />
              {errors.icon && (
                <p className="text-[11px] text-destructive">{errors.icon.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="div-desc" className="text-xs font-semibold">
              {dict.descriptionLabel}
            </Label>
            <Textarea
              id="div-desc"
              rows={3}
              placeholder={dict.descriptionPlaceholder}
              {...register('description')}
              className="text-xs sm:text-sm resize-none"
            />
            {errors.description && (
              <p className="text-[11px] text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              {dict.cancel}
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="gap-2"
            >
              {createMutation.isPending ? 'Menyimpan...' : dict.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
