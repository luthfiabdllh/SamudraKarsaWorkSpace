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
  createTripSchema,
  type CreateTripInput,
} from '../schemas/inventory';
import { useCreateTrip } from '../api/use-inventory';

interface CreateTripDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTripDialog({
  isOpen,
  onClose,
}: CreateTripDialogProps) {
  const dict = dictionary.logistics.createTripDialog;
  const createMutation = useCreateTrip();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTripInput>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      title: '',
      tripKind: 'Operasional',
      vehicleNote: '',
      passengerCount: 4,
      note: '',
    },
  });

  const onSubmit = async (data: CreateTripInput) => {
    try {
      await createMutation.mutateAsync(data);
      reset();
      onClose();
    } catch {
      // handled in hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent id="create-trip-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {dict.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="trip-title" className="text-xs font-semibold">
              {dict.titleLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="trip-title"
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
              <Label htmlFor="trip-kind" className="text-xs font-semibold">
                {dict.tripKindLabel}
              </Label>
              <Input
                id="trip-kind"
                placeholder={dict.tripKindPlaceholder}
                {...register('tripKind')}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="trip-passengers" className="text-xs font-semibold">
                {dict.passengerCountLabel}
              </Label>
              <Input
                id="trip-passengers"
                type="number"
                min={1}
                {...register('passengerCount', { valueAsNumber: true })}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="trip-vehicle" className="text-xs font-semibold">
              {dict.vehicleNoteLabel}
            </Label>
            <Input
              id="trip-vehicle"
              placeholder={dict.vehicleNotePlaceholder}
              {...register('vehicleNote')}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="trip-note" className="text-xs font-semibold">
              {dict.noteLabel}
            </Label>
            <Input
              id="trip-note"
              placeholder="Catatan rute atau barang bawaan..."
              {...register('note')}
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
