'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';

interface ConflictDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReload: () => void;
}

export function ConflictDialog({ open, onOpenChange, onReload }: ConflictDialogProps) {
  const dict = getDictionary();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500 mb-1">
            <div className="p-2 rounded-full bg-amber-500/15">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            <DialogTitle className="text-lg font-bold">
              {dict.workCenter.conflict.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground pt-1">
            {dict.workCenter.conflict.description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button
            type="button"
            variant="default"
            onClick={() => {
              onReload();
              onOpenChange(false);
            }}
            className="gap-2 w-full sm:w-auto"
          >
            <RotateCw className="h-4 w-4" aria-hidden="true" />
            <span>{dict.workCenter.conflict.reload}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
