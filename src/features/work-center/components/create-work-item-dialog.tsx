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
import { useCreateWorkItem } from '../api/use-work-item-mutations';
import { useWorkItems } from '../api/use-work-items';
import { getDictionary } from '@/lib/i18n';
import { WORK_ITEM_PRIORITIES, WORK_ITEM_TYPES, type WorkItemPriority, type WorkItemType } from '../types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CreateWorkItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkItemDialog({ open, onOpenChange }: CreateWorkItemDialogProps) {
  const dict = getDictionary();
  const createMutation = useCreateWorkItem();
  const { data: rawStories = [] } = useWorkItems({ type: 'story' });

  const [title, setTitle] = useState('');
  const [type, setType] = useState<WorkItemType>('task');
  const [priority, setPriority] = useState<WorkItemPriority>('medium');
  const [parentId, setParentId] = useState('');
  const [storyPoints, setStoryPoints] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError('Judul pekerjaan minimal 3 karakter.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        type,
        priority,
        parentId: parentId || null,
        storyPoints: type === 'task' ? storyPoints : 0,
        startDate: startDate || null,
        dueDate: dueDate || null,
        description: description.trim() || null,
        progressPercentage: 0,
      });

      toast.success(dict.workCenter.create.success);
      // Reset form
      setTitle('');
      setType('task');
      setPriority('medium');
      setParentId('');
      setStoryPoints(0);
      setStartDate('');
      setDueDate('');
      setDescription('');
      onOpenChange(false);
    } catch {
      toast.error('Gagal membuat pekerjaan baru. Silakan coba lagi.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {dict.workCenter.create.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground pt-1">
              {dict.workCenter.create.subtitle}
            </DialogDescription>
          </DialogHeader>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="create-title">
              {dict.workCenter.create.titleLabel}{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="create-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={dict.workCenter.create.titlePlaceholder}
              required
            />
          </div>

          {/* Type & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="create-type">{dict.workCenter.create.typeLabel}</Label>
              <Select value={type} onValueChange={(val) => setType(val as WorkItemType)}>
                <SelectTrigger id="create-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORK_ITEM_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {dict.types.workItems[t] ?? t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-priority">
                {dict.workCenter.create.priorityLabel}
              </Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as WorkItemPriority)}
              >
                <SelectTrigger id="create-priority">
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
          </div>

          {/* Parent Story Selector (if type is task) */}
          {type === 'task' && rawStories.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="create-parent-story">{dict.workCenter.parentStory}</Label>
              <Select
                value={parentId || 'none'}
                onValueChange={(val) => setParentId(val === 'none' ? '' : val)}
              >
                <SelectTrigger id="create-parent-story">
                  <SelectValue placeholder={dict.workCenter.selectStoryPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{dict.workCenter.noParentStory}</SelectItem>
                  {rawStories.map((story) => (
                    <SelectItem key={story.id} value={story.id}>
                      📖 {story.workNumber} - {story.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Fibonacci Story Points for Task */}
          {type === 'task' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>{dict.workCenter.storyPointsLabel}</Label>
                <span className="text-[11px] text-muted-foreground">{dict.workCenter.storyPointsHelp}</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {[1, 2, 3, 5, 8, 13].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setStoryPoints(storyPoints === pts ? 0 : pts)}
                    className={cn(
                      'py-1.5 text-xs font-bold rounded-lg border transition-all',
                      storyPoints === pts
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-muted/40 hover:bg-muted text-foreground border-border/80'
                    )}
                  >
                    ⚡ {pts}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="create-start-date">
                {dict.workCenter.create.startDateLabel}
              </Label>
              <Input
                id="create-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-due-date">
                {dict.workCenter.create.dueDateLabel}
              </Label>
              <Input
                id="create-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="create-description">
              {dict.workCenter.create.descLabel}
            </Label>
            <Textarea
              id="create-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={dict.workCenter.create.descPlaceholder}
              rows={3}
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-destructive">{error}</p>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              {dict.common.cancel}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {dict.workCenter.create.submitButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
