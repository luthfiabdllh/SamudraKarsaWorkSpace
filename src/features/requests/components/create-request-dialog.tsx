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
import { useCreateRequest } from '../api/use-request-mutations';
import { getDictionary } from '@/lib/i18n';
import {
  REQUEST_PRIORITIES,
  REQUEST_TYPES,
  type RequestPriority,
  type RequestType,
} from '../types';
import type { DivisionOption } from '../api/use-requests';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  divisions: DivisionOption[];
}

export function CreateRequestDialog({
  open,
  onOpenChange,
  divisions,
}: CreateRequestDialogProps) {
  const dict = getDictionary();
  const createMutation = useCreateRequest();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<RequestType>('other');
  const [targetDivisionId, setTargetDivisionId] = useState('');
  const [priority, setPriority] = useState<RequestPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError('Judul pengajuan minimal 3 karakter.');
      return;
    }

    if (!targetDivisionId) {
      setError('Divisi tujuan wajib dipilih.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        type,
        targetDivisionId,
        priority,
        dueDate: dueDate || null,
        description: description.trim() || null,
      });

      toast.success(dict.requests.create.success);
      // Reset form
      setTitle('');
      setType('other');
      setTargetDivisionId('');
      setPriority('medium');
      setDueDate('');
      setDescription('');
      onOpenChange(false);
    } catch (err: unknown) {
      const maybeAxios = err as { response?: { data?: { message?: string; title?: string; detail?: string } } };
      const serverMsg =
        maybeAxios.response?.data?.detail ||
        maybeAxios.response?.data?.message ||
        maybeAxios.response?.data?.title;
      setError(serverMsg || 'Gagal membuat pengajuan baru. Silakan coba lagi.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {dict.requests.create.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {dict.requests.create.subtitle}
            </DialogDescription>
          </DialogHeader>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="create-req-title">
              {dict.requests.create.titleLabel}{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="create-req-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={dict.requests.create.titlePlaceholder}
              className="text-xs"
              required
            />
          </div>

          {/* Grid: Type & Target Division */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Request Type */}
            <div className="space-y-1.5">
              <Label htmlFor="create-req-type">
                {dict.requests.create.typeLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={type}
                onValueChange={(val) => setType(val as RequestType)}
              >
                <SelectTrigger id="create-req-type" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {dict.types.requests[t] ?? t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Target Division */}
            <div className="space-y-1.5">
              <Label htmlFor="create-req-target-div">
                {dict.requests.create.targetDivisionLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={targetDivisionId}
                onValueChange={setTargetDivisionId}
              >
                <SelectTrigger id="create-req-target-div" className="h-9 text-xs">
                  <SelectValue placeholder="Pilih divisi tujuan" />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid: Priority & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Priority */}
            <div className="space-y-1.5">
              <Label htmlFor="create-req-priority">
                {dict.requests.create.priorityLabel}
              </Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as RequestPriority)}
              >
                <SelectTrigger id="create-req-priority" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {dict.priorities[p] ?? p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <Label htmlFor="create-req-due-date">
                {dict.requests.create.dueDateLabel}
              </Label>
              <Input
                id="create-req-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="create-req-desc">
              {dict.requests.create.descLabel}
            </Label>
            <Textarea
              id="create-req-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={dict.requests.create.descPlaceholder}
              rows={3}
              className="text-xs"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
              {error}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              {dict.common.cancel}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
              className="gap-1.5"
            >
              {createMutation.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              <span>
                {createMutation.isPending
                  ? dict.requests.create.submittingButton
                  : dict.requests.create.submitButton}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
