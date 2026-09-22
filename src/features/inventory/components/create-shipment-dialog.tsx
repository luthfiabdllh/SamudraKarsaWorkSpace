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
  createShipmentSchema,
  type CreateShipmentInput,
} from '../schemas/inventory';
import { useCreateShipment } from '../api/use-inventory';

interface CreateShipmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateShipmentDialog({
  isOpen,
  onClose,
}: CreateShipmentDialogProps) {
  const dict = dictionary.logistics.createShipmentDialog;
  const createMutation = useCreateShipment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateShipmentInput>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: {
      packageName: '',
      expedition: '',
      trackingNumber: '',
      origin: '',
      destination: '',
      weightKg: '',
      cost: '',
    },
  });

  const onSubmit = async (data: CreateShipmentInput) => {
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
      <DialogContent id="create-shipment-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {dict.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="shipment-pkg-name" className="text-xs font-semibold">
              {dict.packageNameLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="shipment-pkg-name"
              placeholder={dict.packageNamePlaceholder}
              {...register('packageName')}
              className="h-9 text-sm"
            />
            {errors.packageName && (
              <p className="text-destructive text-xs">{errors.packageName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="shipment-expedition" className="text-xs font-semibold">
                {dict.expeditionLabel}
              </Label>
              <Input
                id="shipment-expedition"
                placeholder={dict.expeditionPlaceholder}
                {...register('expedition')}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shipment-tracking" className="text-xs font-semibold">
                {dict.trackingNumberLabel}
              </Label>
              <Input
                id="shipment-tracking"
                placeholder={dict.trackingNumberPlaceholder}
                {...register('trackingNumber')}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="shipment-origin" className="text-xs font-semibold">
                {dict.originLabel}
              </Label>
              <Input
                id="shipment-origin"
                placeholder="Pelabuhan Kendari..."
                {...register('origin')}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shipment-destination" className="text-xs font-semibold">
                {dict.destinationLabel}
              </Label>
              <Input
                id="shipment-destination"
                placeholder="Posko Wakatobi..."
                {...register('destination')}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="shipment-weight" className="text-xs font-semibold">
                {dict.weightKgLabel}
              </Label>
              <Input
                id="shipment-weight"
                placeholder="Contoh: 15.5"
                {...register('weightKg')}
                className="h-9 text-sm"
              />
              {errors.weightKg && (
                <p className="text-destructive text-xs">{errors.weightKg.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shipment-cost" className="text-xs font-semibold">
                {dict.costLabel}
              </Label>
              <Input
                id="shipment-cost"
                placeholder="Contoh: 150000"
                {...register('cost')}
                className="h-9 text-sm"
              />
              {errors.cost && (
                <p className="text-destructive text-xs">{errors.cost.message}</p>
              )}
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
