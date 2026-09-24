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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateWorkItem } from '../api/use-work-item-mutations';
import { getDictionary } from '@/lib/i18n';
import {
  WORK_ITEM_PRIORITIES,
  type WorkItem,
  type WorkItemDetail,
  type WorkItemPriority,
} from '../types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

interface EditWorkItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workItem: WorkItem;
  currentVersion: number;
  initialDetail?: WorkItemDetail | null;
  onConflict?: () => void;
}

export function EditWorkItemDialog({
  open,
  onOpenChange,
  workItem,
  currentVersion,
  initialDetail,
  onConflict,
}: EditWorkItemDialogProps) {
  const dict = getDictionary();
  const updateMutation = useUpdateWorkItem();

  const [title, setTitle] = useState(
    initialDetail?.title ?? workItem.title ?? ''
  );
  const [priority, setPriority] = useState<WorkItemPriority>(
    initialDetail?.priority ?? workItem.priority ?? 'medium'
  );
  const [storyPoints, setStoryPoints] = useState<number>(
    initialDetail?.storyPoints ?? workItem.storyPoints ?? 0
  );
  const [startDate, setStartDate] = useState(
    (initialDetail?.startDate ?? workItem.startDate)?.substring(0, 10) ?? ''
  );
  const [dueDate, setDueDate] = useState(
    (initialDetail?.dueDate ?? workItem.dueDate)?.substring(0, 10) ?? ''
  );
  const [progressPercentage, setProgressPercentage] = useState<number>(
    initialDetail?.progressPercentage ?? workItem.progressPercentage ?? 0
  );
  const [description, setDescription] = useState(
    initialDetail?.description ?? ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length < 3) {
      toast.error('Judul pekerjaan minimal 3 karakter.');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: workItem.id,
        version: currentVersion,
        data: {
          title: title.trim(),
          priority,
          storyPoints: workItem.type === 'task' ? storyPoints : undefined,
          startDate: startDate || null,
          dueDate: dueDate || null,
          progressPercentage,
          description: description.trim() || null,
        },
      });

      toast.success(dict.workCenter.drawer.editSuccess);
      onOpenChange(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 409) {
        onOpenChange(false);
        onConflict?.();
      } else {
        toast.error(dict.workCenter.drawer.editError);
      }
    }
  };

  const isTask = workItem.type === 'task';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {isTask ? dict.workCenter.drawer.editTask : dict.workCenter.drawer.editDialogTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground pt-1">
              {dict.workCenter.drawer.editDialogDesc}
            </DialogDescription>
          </DialogHeader>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">
              {dict.workCenter.create.titleLabel}{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={dict.workCenter.create.titlePlaceholder}
              required
              minLength={3}
              maxLength={200}
            />
          </div>

          {/* Priority & Story Points (if task) */}
          <div className={isTask ? 'grid grid-cols-2 gap-3' : 'space-y-1.5'}>
            <div className="space-y-1.5">
              <Label htmlFor="edit-priority">
                {dict.workCenter.create.priorityLabel}
              </Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as WorkItemPriority)}
              >
                <SelectTrigger id="edit-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORK_ITEM_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {dict.priorities[p] ?? p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isTask && (
              <div className="space-y-1.5">
                <Label htmlFor="edit-story-points">
                  {dict.workCenter.storyPoints} ({dict.workCenter.storyPointsShort})
                </Label>
                <Input
                  id="edit-story-points"
                  type="number"
                  min={0}
                  max={100}
                  value={storyPoints}
                  onChange={(e) => setStoryPoints(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
            )}
          </div>

          {/* Start Date & Due Date Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-start-date">
                {dict.workCenter.create.startDateLabel}
              </Label>
              <Input
                id="edit-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-due-date">
                {dict.workCenter.create.dueDateLabel}
              </Label>
              <Input
                id="edit-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-progress">
                {dict.workCenter.drawer.progressPercentageLabel}
              </Label>
              <span className="text-xs font-mono font-bold text-primary">
                {progressPercentage}%
              </span>
            </div>
            <Input
              id="edit-progress"
              type="number"
              min={0}
              max={100}
              value={progressPercentage}
              onChange={(e) => {
                const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                setProgressPercentage(val);
              }}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-description">
              {dict.workCenter.create.descLabel}
            </Label>
            <Textarea
              id="edit-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={dict.workCenter.create.descPlaceholder}
              maxLength={5000}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              {dict.common.cancel}
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <span>
                {updateMutation.isPending
                  ? dict.common.saving
                  : dict.common.save}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
