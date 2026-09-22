'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLetterDetail, useTransitionLetter } from '../api/use-letters';
import { LetterTransitionDialog } from './letter-transition-dialog';
import { getDictionary } from '@/lib/i18n';
import type { LetterItem, LetterStatus } from '../types';
import {
  Building2,
  User,
  Clock,
  ArrowRight,
  Send,
  Inbox,
  UserCheck,
  FileCheck2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface LetterDrawerProps {
  selectedLetter: LetterItem | null;
  onClose: () => void;
}

export function LetterDrawer({ selectedLetter, onClose }: LetterDrawerProps) {
  const dict = getDictionary();

  const { data: detail, isLoading } = useLetterDetail(selectedLetter?.id ?? null);
  const transitionMutation = useTransitionLetter();

  const [activeTargetStatus, setActiveTargetStatus] = useState<LetterStatus | null>(null);
  const [showTransitionDialog, setShowTransitionDialog] = useState(false);

  if (!selectedLetter) return null;

  const currentStatus = detail?.status ?? selectedLetter.status;
  const availableTransitions = detail?.availableTransitions ?? [];
  const isInbound = selectedLetter.direction === 'inbound';

  const formattedLetterDate = selectedLetter.letterDate
    ? new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(selectedLetter.letterDate))
    : '-';

  const formattedDueDate = selectedLetter.dueDate
    ? new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(selectedLetter.dueDate))
    : '-';

  const handleTransitionClick = (target: LetterStatus) => {
    setActiveTargetStatus(target);
    setShowTransitionDialog(true);
  };

  const handleConfirmTransition = async (note?: string | null) => {
    if (!activeTargetStatus) return;

    try {
      await transitionMutation.mutateAsync({
        id: selectedLetter.id,
        data: {
          to: activeTargetStatus,
          note: note ?? null,
        },
      });

      toast.success(
        `Status surat diperbarui menjadi: ${dict.statuses.letters[activeTargetStatus] ?? activeTargetStatus}`
      );
      setShowTransitionDialog(false);
    } catch {
      toast.error('Gagal memperbarui status surat.');
    }
  };

  return (
    <>
      <Sheet open={Boolean(selectedLetter)} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="space-y-3 pb-2 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                {selectedLetter.letterNumber}
              </span>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-xs">
                  {isInbound ? (
                    <Inbox className="h-3 w-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Send className="h-3 w-3 mr-1 text-sky-600 dark:text-sky-400" />
                  )}
                  <span>{dict.types.letters[selectedLetter.direction] ?? selectedLetter.direction}</span>
                </Badge>
                <Badge variant="outline" className="text-xs font-semibold">
                  {dict.statuses.letters[currentStatus] ?? currentStatus}
                </Badge>
              </div>
            </div>

            <SheetTitle className="text-xl font-bold leading-tight">
              {selectedLetter.subject}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {dict.letters.drawer.title}
            </SheetDescription>
          </SheetHeader>

          <Separator className="my-3" />

          {/* Details Grid */}
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px] mb-2.5">
                {dict.letters.drawer.generalInfo}
              </h4>
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-card border border-border/60">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    {dict.letters.drawer.institution}
                  </span>
                  <p className="font-medium text-foreground">
                    {detail?.institution || selectedLetter.institution || '-'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    {dict.letters.drawer.senderRecipient}
                  </span>
                  <p className="font-medium text-foreground">
                    {detail?.senderRecipient || selectedLetter.senderRecipient || '-'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <FileCheck2 className="h-3.5 w-3.5 text-muted-foreground" />
                    {dict.letters.drawer.signer}
                  </span>
                  <p className="font-medium text-foreground">
                    {detail?.signerName || selectedLetter.signerName || '-'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    {dict.letters.drawer.pic}
                  </span>
                  <p className="font-medium text-foreground">
                    {detail?.picName || selectedLetter.picName || 'Belum Ditugaskan'}
                  </p>
                </div>
              </div>
            </div>

            {/* Schedule Info */}
            <div>
              <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px] mb-2.5">
                {dict.letters.drawer.dates}
              </h4>
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/60">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {dict.letters.drawer.letterDate}
                  </span>
                  <p className="font-medium text-foreground">{formattedLetterDate}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {dict.letters.drawer.dueDate}
                  </span>
                  <p className="font-medium text-foreground">{formattedDueDate}</p>
                </div>
              </div>
            </div>

            {/* Notes / Description */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                {dict.letters.drawer.note}
              </h4>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-foreground/90 whitespace-pre-wrap leading-relaxed text-xs">
                {detail?.note || selectedLetter.note || dict.letters.drawer.noNote}
              </div>
            </div>

            <Separator className="my-3" />

            {/* FSM Workflow Actions */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  {dict.letters.drawer.transitionsTitle}
                </h4>
                {isLoading && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                )}
              </div>

              {availableTransitions.length === 0 ? (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground text-center">
                  {dict.letters.drawer.noTransitions}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableTransitions.map((target) => (
                    <Button
                      key={target}
                      variant="secondary"
                      size="sm"
                      disabled={transitionMutation.isPending}
                      onClick={() => handleTransitionClick(target)}
                      className="justify-between text-xs h-9 font-medium"
                    >
                      <span className="truncate">
                        Lanjutkan ke {dict.statuses.letters[target] ?? target}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1 opacity-70" />
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Transition Confirmation Dialog */}
      <LetterTransitionDialog
        open={showTransitionDialog}
        onOpenChange={setShowTransitionDialog}
        targetStatus={activeTargetStatus}
        isLoading={transitionMutation.isPending}
        onConfirm={handleConfirmTransition}
      />
    </>
  );
}
