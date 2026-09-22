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
import {
  useWorkItemDetail,
} from '../api/use-work-item-detail';
import {
  useSetWorkItemPic,
  useTransitionWorkItem,
} from '../api/use-work-item-mutations';
import { FsmTransitionDialog } from './fsm-transition-dialog';
import { ConflictDialog } from './conflict-dialog';
import { getDictionary } from '@/lib/i18n';
import type { WorkItem, WorkItemStatus } from '../types';
import {
  UserCheck,
  Calendar,
  Layers,
  ArrowRight,
  History,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

interface WorkItemDrawerProps {
  selectedItem: WorkItem | null;
  currentUserId?: string;
  onClose: () => void;
}

export function WorkItemDrawer({
  selectedItem,
  currentUserId,
  onClose,
}: WorkItemDrawerProps) {
  const dict = getDictionary();

  const { data: detail, isLoading: isDetailLoading, refetch } = useWorkItemDetail(
    selectedItem?.id ?? null
  );

  const transitionMutation = useTransitionWorkItem();
  const setPicMutation = useSetWorkItemPic();

  const [activeTargetStatus, setActiveTargetStatus] = useState<WorkItemStatus | null>(null);
  const [showFsmDialog, setShowFsmDialog] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);

  if (!selectedItem) return null;

  // Gunakan data detail jika sudah termuat, atau fallback ke selectedItem ringkas
  const currentStatus = detail?.status ?? selectedItem.status;
  const currentVersion = detail?.version ?? selectedItem.version;
  const availableTransitions = detail?.availableTransitions ?? [];

  const formattedDueDate = selectedItem.dueDate
    ? new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(selectedItem.dueDate))
    : '-';

  const formattedStartDate = selectedItem.startDate
    ? new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(selectedItem.startDate))
    : '-';

  const handleTransitionClick = async (target: WorkItemStatus) => {
    // Jika butuh input (on_hold butuh alasan, done butuh ringkasan)
    if (target === 'on_hold' || target === 'done') {
      setActiveTargetStatus(target);
      setShowFsmDialog(true);
      return;
    }

    // Transisi langsung tanpa isian syarat
    try {
      await transitionMutation.mutateAsync({
        id: selectedItem.id,
        version: currentVersion,
        data: { to: target },
      });
      toast.success(
        `Status berhasil diubah ke ${dict.statuses.workItems[target] ?? target}`
      );
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 409) {
        setShowConflictDialog(true);
      } else {
        toast.error('Gagal memproses transisi status pekerjaan.');
      }
    }
  };

  const handleFsmConfirm = async (data: {
    to: WorkItemStatus;
    note?: string | null;
    holdReason?: string | null;
    completionSummary?: string | null;
  }) => {
    try {
      await transitionMutation.mutateAsync({
        id: selectedItem.id,
        version: currentVersion,
        data,
      });
      toast.success(
        `Status berhasil diubah ke ${dict.statuses.workItems[data.to] ?? data.to}`
      );
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 409) {
        setShowConflictDialog(true);
      } else {
        toast.error('Gagal memperbarui status pekerjaan.');
      }
    }
  };

  const handleQuickClaimPic = async () => {
    if (!currentUserId) {
      toast.error('Gagal mengidentifikasi akun Anda.');
      return;
    }

    try {
      await setPicMutation.mutateAsync({
        id: selectedItem.id,
        version: currentVersion,
        data: {
          primaryPicId: currentUserId,
          note: 'Klaim mandiri penanggung jawab pekerjaan (Quick Claim PIC).',
        },
      });
      toast.success(dict.workCenter.quickClaimSuccess);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 409) {
        setShowConflictDialog(true);
      } else {
        toast.error('Gagal mengambil alih penanggung jawab pekerjaan.');
      }
    }
  };

  return (
    <>
      <Sheet open={!!selectedItem} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className="flex flex-col gap-0 p-0 sm:max-w-xl">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b border-border/80 bg-muted/30">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="font-mono text-xs font-bold text-primary px-2.5 py-0.5 rounded-md bg-primary/10">
                {selectedItem.workNumber}
              </span>
              <Badge variant="outline" className="text-xs capitalize font-semibold">
                {dict.priorities[selectedItem.priority] ?? selectedItem.priority}
              </Badge>
            </div>
            <SheetTitle className="text-xl font-bold leading-snug text-foreground">
              {selectedItem.title}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <span>{dict.types.workItems[selectedItem.type] ?? selectedItem.type}</span>
              {selectedItem.divisionName && (
                <>
                  <span>•</span>
                  <span>{selectedItem.divisionName}</span>
                </>
              )}
            </SheetDescription>
          </SheetHeader>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick PIC Claim Banner (if without PIC) */}
            {!selectedItem.primaryPicId && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="text-xs font-semibold">
                    Pekerjaan ini belum memiliki Penanggung Jawab (PIC).
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={handleQuickClaimPic}
                  disabled={setPicMutation.isPending}
                  className="gap-2 shrink-0 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {setPicMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserCheck className="h-4 w-4" />
                  )}
                  <span>{dict.workCenter.quickClaim}</span>
                </Button>
              </div>
            )}

            {/* Status & FSM Transitions Section */}
            <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {dict.workCenter.drawer.status}
                </span>
                <Badge variant="secondary" className="text-xs font-bold">
                  {dict.statuses.workItems[currentStatus] ?? currentStatus}
                </Badge>
              </div>

              <Separator />

              <div>
                <span className="text-xs font-semibold text-foreground mb-2.5 block">
                  {dict.workCenter.drawer.transitionsTitle}
                </span>
                {isDetailLoading ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memuat tindakan alur yang tersedia...</span>
                  </div>
                ) : availableTransitions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {availableTransitions.map((target) => (
                      <Button
                        key={target}
                        size="sm"
                        variant={target === 'done' ? 'default' : 'outline'}
                        onClick={() => handleTransitionClick(target)}
                        disabled={transitionMutation.isPending}
                        className="gap-1.5 text-xs"
                      >
                        {target === 'done' ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5" />
                        )}
                        <span>{dict.statuses.workItems[target] ?? target}</span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    {dict.workCenter.drawer.noTransitions}
                  </p>
                )}
              </div>
            </div>

            {/* Detail Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {dict.workCenter.drawer.details}
              </h4>
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-border/70 p-4 bg-muted/20 text-xs">
                <div>
                  <span className="text-muted-foreground block mb-1">
                    {dict.workCenter.drawer.pic}
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    {selectedItem.primaryPicName ? (
                      <>
                        <UserCheck className="h-3.5 w-3.5 text-primary" />
                        <span>{selectedItem.primaryPicName}</span>
                      </>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-500 font-medium">
                        {dict.workCenter.drawer.noPic}
                      </span>
                    )}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block mb-1">
                    {dict.workCenter.drawer.division}
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    <span>{selectedItem.divisionName ?? '-'}</span>
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block mb-1">
                    {dict.workCenter.drawer.startDate}
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formattedStartDate}</span>
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block mb-1">
                    {dict.workCenter.drawer.dueDate}
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formattedDueDate}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {dict.workCenter.drawer.description}
              </h4>
              <div className="rounded-xl border border-border/70 p-4 bg-card text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                {detail?.description || dict.workCenter.drawer.noDescription}
              </div>
            </div>

            {/* Status History Timeline (if available) */}
            {detail?.statusHistory && detail.statusHistory.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <History className="h-3.5 w-3.5" />
                  <span>{dict.workCenter.drawer.historyTitle}</span>
                </h4>
                <div className="space-y-3 pl-2 border-l-2 border-border/80">
                  {detail.statusHistory.map((h) => {
                    const formattedDate = new Intl.DateTimeFormat('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(h.changedAt));

                    return (
                      <div key={h.id} className="relative pl-4 space-y-1">
                        <div className="absolute -left-5.25 top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-foreground">
                            {dict.statuses.workItems[h.toStatus] ?? h.toStatus}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {formattedDate}
                          </span>
                        </div>
                        {h.note && (
                          <p className="text-xs text-muted-foreground bg-muted/40 rounded-md p-2">
                            {h.note}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* FSM Transition Modal Dialog */}
      <FsmTransitionDialog
        open={showFsmDialog}
        onOpenChange={setShowFsmDialog}
        targetStatus={activeTargetStatus}
        isLoading={transitionMutation.isPending}
        onConfirm={handleFsmConfirm}
      />

      {/* 409 Conflict Dialog */}
      <ConflictDialog
        open={showConflictDialog}
        onOpenChange={setShowConflictDialog}
        onReload={() => {
          void refetch();
        }}
      />
    </>
  );
}
