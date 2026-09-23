'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDivisionMembers } from '@/features/divisions/api/use-divisions';
import { useSetWorkItemPic } from '../api/use-work-item-mutations';
import { getDictionary } from '@/lib/i18n';
import type { WorkItem } from '../types';
import { Loader2, UserCheck, UserMinus } from 'lucide-react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

interface AssignPicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workItem: WorkItem;
  currentVersion: number;
  divisionId?: string | null;
  onConflict?: () => void;
}

export function AssignPicDialog({
  open,
  onOpenChange,
  workItem,
  currentVersion,
  divisionId,
  onConflict,
}: AssignPicDialogProps) {
  const dict = getDictionary();
  const setPicMutation = useSetWorkItemPic();

  // Ambil daftar anggota dari divisi pelaksana tiket
  const { data: members = [], isLoading: isLoadingMembers } = useDivisionMembers(
    divisionId || undefined
  );

  const [selectedPicId, setSelectedPicId] = useState<string>(
    workItem.primaryPicId ?? 'unassigned'
  );
  const [note, setNote] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const targetPicId = selectedPicId === 'unassigned' ? null : selectedPicId;

    try {
      await setPicMutation.mutateAsync({
        id: workItem.id,
        version: currentVersion,
        data: {
          primaryPicId: targetPicId,
          note: note.trim() || null,
        },
      });

      toast.success(dict.workCenter.drawer.picAssignSuccess);
      onOpenChange(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 409) {
        onOpenChange(false);
        onConflict?.();
      } else {
        toast.error(dict.workCenter.drawer.picAssignError);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <span>{dict.workCenter.drawer.assignPicDialogTitle}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {dict.workCenter.drawer.assignPicDialogDesc}
            </DialogDescription>
          </DialogHeader>

          {/* Selector PIC Anggota */}
          <div className="space-y-1.5">
            <Label htmlFor="assign-pic-select" className="text-xs font-semibold">
              {dict.workCenter.drawer.pic}
            </Label>
            {isLoadingMembers ? (
              <div className="flex items-center gap-2 p-2 rounded-md border border-input text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Memuat daftar anggota divisi...</span>
              </div>
            ) : (
              <Select value={selectedPicId} onValueChange={setSelectedPicId}>
                <SelectTrigger id="assign-pic-select" className="w-full text-xs">
                  <SelectValue placeholder={dict.workCenter.drawer.selectPicPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned" className="text-muted-foreground">
                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <UserMinus className="h-3.5 w-3.5" />
                      <span>{dict.workCenter.drawer.unassignPic}</span>
                    </span>
                  </SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <span className="font-medium text-foreground">
                        {member.fullName || member.nickname || 'Anggota'}
                      </span>
                      {member.teamRole && (
                        <span className="text-muted-foreground ml-1.5 text-[11px]">
                          ({member.teamRole})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Catatan Arahan Penugasan */}
          <div className="space-y-1.5">
            <Label htmlFor="assign-pic-note" className="text-xs font-semibold">
              {dict.workCenter.drawer.assignNoteLabel}
            </Label>
            <Textarea
              id="assign-pic-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={dict.workCenter.drawer.assignNotePlaceholder}
              rows={3}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={setPicMutation.isPending}
              className="text-xs"
            >
              {dict.common.cancel}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={setPicMutation.isPending || isLoadingMembers}
              className="text-xs gap-1.5"
            >
              {setPicMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <UserCheck className="h-3.5 w-3.5" />
              )}
              <span>
                {setPicMutation.isPending
                  ? dict.workCenter.drawer.assigningButton
                  : dict.workCenter.drawer.assignButton}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
