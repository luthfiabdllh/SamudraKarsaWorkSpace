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
import { useCreateLetter } from '../api/use-letters';
import { getDictionary } from '@/lib/i18n';
import type { LetterDirection } from '../types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateLetterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLetterDialog({
  open,
  onOpenChange,
}: CreateLetterDialogProps) {
  const dict = getDictionary();
  const createMutation = useCreateLetter();

  const [direction, setDirection] = useState<LetterDirection>('outbound');
  const [letterKind, setLetterKind] = useState('UND');
  const [subject, setSubject] = useState('');
  const [institution, setInstitution] = useState('');
  const [senderRecipient, setSenderRecipient] = useState('');
  const [signerName, setSignerName] = useState('');
  const [letterDate, setLetterDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (subject.trim().length < 3) {
      setError('Perihal surat minimal 3 karakter.');
      return;
    }

    if (!letterKind.trim()) {
      setError('Klasifikasi/kode jenis surat wajib diisi.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        direction,
        letterKind: letterKind.trim().toUpperCase(),
        subject: subject.trim(),
        institution: institution.trim() || null,
        senderRecipient: senderRecipient.trim() || null,
        signerName: signerName.trim() || null,
        letterDate: letterDate || null,
        dueDate: dueDate || null,
        note: note.trim() || null,
      });

      toast.success(dict.letters.create.success);
      setSubject('');
      setInstitution('');
      setSenderRecipient('');
      setSignerName('');
      setDueDate('');
      setNote('');
      onOpenChange(false);
    } catch {
      toast.error('Gagal mendaftarkan surat. Silakan coba lagi.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {dict.letters.create.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {dict.letters.create.subtitle}
            </DialogDescription>
          </DialogHeader>

          {/* Grid: Direction & Letter Kind */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="letter-dir" className="text-xs">
                {dict.letters.create.directionLabel}
              </Label>
              <Select
                value={direction}
                onValueChange={(val) => setDirection(val as LetterDirection)}
              >
                <SelectTrigger id="letter-dir" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outbound">Surat Keluar (Outbound)</SelectItem>
                  <SelectItem value="inbound">Surat Masuk (Inbound)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="letter-kind" className="text-xs">
                {dict.letters.create.kindLabel}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="letter-kind"
                value={letterKind}
                onChange={(e) => setLetterKind(e.target.value.toUpperCase())}
                placeholder="UND / PMH / ST"
                className="h-9 text-xs font-mono uppercase"
                required
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <Label htmlFor="letter-subject" className="text-xs">
              {dict.letters.create.subjectLabel}{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="letter-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={dict.letters.create.subjectPlaceholder}
              className="text-xs"
              required
            />
          </div>

          {/* Institution & Correspondent */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="letter-inst" className="text-xs">
                {dict.letters.create.institutionLabel}
              </Label>
              <Input
                id="letter-inst"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder={dict.letters.create.institutionPlaceholder}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="letter-corr" className="text-xs">
                {dict.letters.create.correspondentLabel}
              </Label>
              <Input
                id="letter-corr"
                value={senderRecipient}
                onChange={(e) => setSenderRecipient(e.target.value)}
                placeholder={dict.letters.create.correspondentPlaceholder}
                className="text-xs"
              />
            </div>
          </div>

          {/* Signer & Date */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="letter-signer" className="text-xs">
                {dict.letters.create.signerLabel}
              </Label>
              <Input
                id="letter-signer"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Ketua / Sekretaris"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="letter-date" className="text-xs">
                {dict.letters.create.letterDateLabel}
              </Label>
              <Input
                id="letter-date"
                type="date"
                value={letterDate}
                onChange={(e) => setLetterDate(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="letter-due" className="text-xs">
                {dict.letters.create.dueDateLabel}
              </Label>
              <Input
                id="letter-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label htmlFor="letter-note" className="text-xs">
              {dict.letters.create.noteLabel}
            </Label>
            <Textarea
              id="letter-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={dict.letters.create.notePlaceholder}
              rows={2}
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
                  ? dict.letters.create.submittingButton
                  : dict.letters.create.submitButton}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
