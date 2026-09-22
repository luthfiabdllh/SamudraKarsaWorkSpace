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
  addMovementSchema,
  type AddMovementInput,
} from '../schemas/inventory';
import { useAddMovement } from '../api/use-inventory';
import type { InventoryItem } from '../types';

interface AddMovementDialogProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AddMovementDialog({
  item,
  isOpen,
  onClose,
}: AddMovementDialogProps) {
  const dict = dictionary.inventory.movementDialog;
  const movementLabels = dictionary.statuses.movements;

  const addMovementMutation = useAddMovement(item?.id ?? '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMovementInput>({
    resolver: zodResolver(addMovementSchema),
    defaultValues: {
      movementType: 'borrowed',
      quantity: -1,
      note: '',
    },
  });

  const onSubmit = async (data: AddMovementInput) => {
    try {
      await addMovementMutation.mutateAsync(data);
      reset();
      onClose();
    } catch {
      // handled in hook
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent id="add-movement-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {dict.description} ({item.name})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="mov-type" className="text-xs font-semibold">
              {dict.movementTypeLabel}
            </Label>
            <select
              id="mov-type"
              {...register('movementType')}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="borrowed">{movementLabels.borrowed}</option>
              <option value="returned">{movementLabels.returned}</option>
              <option value="inbound">{movementLabels.inbound}</option>
              <option value="outbound">{movementLabels.outbound}</option>
              <option value="used">{movementLabels.used}</option>
              <option value="relocated">{movementLabels.relocated}</option>
              <option value="damaged_or_lost">{movementLabels.damaged_or_lost}</option>
            </select>
            {errors.movementType && (
              <p className="text-destructive text-xs">{errors.movementType.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mov-quantity" className="text-xs font-semibold">
              {dict.quantityLabel}
            </Label>
            <Input
              id="mov-quantity"
              type="number"
              {...register('quantity', { valueAsNumber: true })}
              className="h-9 text-sm"
            />
            {errors.quantity && (
              <p className="text-destructive text-xs">{errors.quantity.message}</p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Stok saat ini: {item.currentStock} {item.unit || 'unit'}.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mov-note" className="text-xs font-semibold">
              {dict.noteLabel}
            </Label>
            <Input
              id="mov-note"
              placeholder={dict.notePlaceholder}
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
              disabled={addMovementMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={addMovementMutation.isPending}
            >
              {addMovementMutation.isPending ? dict.submittingButton : dict.submitButton}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
