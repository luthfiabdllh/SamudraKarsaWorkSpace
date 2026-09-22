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
  createInventoryItemSchema,
  type CreateInventoryItemInput,
} from '../schemas/inventory';
import { useCreateInventoryItem } from '../api/use-inventory';

interface CreateInventoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateInventoryDialog({
  isOpen,
  onClose,
}: CreateInventoryDialogProps) {
  const dict = dictionary.inventory.createDialog;
  const createMutation = useCreateInventoryItem();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateInventoryItemInput>({
    resolver: zodResolver(createInventoryItemSchema),
    defaultValues: {
      name: '',
      category: '',
      unit: 'unit',
      initialStock: 1,
      storageLocation: '',
      note: '',
    },
  });

  const onSubmit = async (data: CreateInventoryItemInput) => {
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
      <DialogContent id="create-inventory-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {dict.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="item-name" className="text-xs font-semibold">
              {dict.nameLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="item-name"
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
              <Label htmlFor="item-category" className="text-xs font-semibold">
                {dict.categoryLabel}
              </Label>
              <Input
                id="item-category"
                placeholder={dict.categoryPlaceholder}
                {...register('category')}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="item-unit" className="text-xs font-semibold">
                {dict.unitLabel}
              </Label>
              <Input
                id="item-unit"
                placeholder={dict.unitPlaceholder}
                {...register('unit')}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="item-initial-stock" className="text-xs font-semibold">
              {dict.initialStockLabel}
            </Label>
            <Input
              id="item-initial-stock"
              type="number"
              min={0}
              {...register('initialStock', { valueAsNumber: true })}
              className="h-9 text-sm"
            />
            {errors.initialStock && (
              <p className="text-destructive text-xs">{errors.initialStock.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="item-location" className="text-xs font-semibold">
              {dict.storageLocationLabel}
            </Label>
            <Input
              id="item-location"
              placeholder={dict.storageLocationPlaceholder}
              {...register('storageLocation')}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="item-note" className="text-xs font-semibold">
              {dict.noteLabel}
            </Label>
            <Input
              id="item-note"
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
