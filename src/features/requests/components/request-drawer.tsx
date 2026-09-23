'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import { useRequestDetail } from '../api/use-request-detail';
import {
  useTransitionRequest,
  useResolveSyncConflict,
} from '../api/use-request-mutations';
import { RequestTransitionDialog } from './request-transition-dialog';
import { ResolveSyncConflictDialog } from './resolve-sync-conflict-dialog';
import { getDictionary } from '@/lib/i18n';
import type { RequestItem, RequestStatus } from '../types';
import type {
  ResolveSyncConflictValues,
  TransitionRequestValues,
} from '../schemas/request';
import {
  UserCheck,
  Layers,
  ArrowRight,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Building2,
  User,
  Clock,
  CheckCircle2,
  HelpCircle,
  PauseCircle,
  Info,
  Sparkles,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { AxiosError } from 'axios';
import { useWorkItemsByRequest } from '@/features/work-center';
import { DecomposeRequestDialog } from './decompose-request-dialog';

interface RequestDrawerProps {
  selectedItem: RequestItem | null;
  onClose: () => void;
  onOpenConflictModalDirectly?: () => void;
}

export function RequestDrawer({
  selectedItem,
  onClose,
}: RequestDrawerProps) {
  const dict = getDictionary();

  const { data: detail, isLoading: isDetailLoading, refetch } = useRequestDetail(
    selectedItem?.id ?? null
  );

  const transitionMutation = useTransitionRequest();
  const resolveConflictMutation = useResolveSyncConflict();
  const { data: requestWorkItems, refetch: refetchWorkItems } = useWorkItemsByRequest(
    selectedItem?.id ?? null
  );

  const [activeTargetStatus, setActiveTargetStatus] = useState<RequestStatus | null>(null);
  const [showTransitionDialog, setShowTransitionDialog] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [showDecomposeDialog, setShowDecomposeDialog] = useState(false);

  if (!selectedItem) return null;

  const currentStatus = detail?.status ?? selectedItem.status;
  const currentVersion = detail?.version ?? selectedItem.version;
  const availableTransitions = detail?.availableTransitions ?? [];
  const hasConflict = Boolean(detail?.syncConflictAt || selectedItem.syncConflictAt);
  const transitionRequirements = detail?.transitionRequirements ?? {};

  const formattedDueDate = selectedItem.dueDate
    ? new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(selectedItem.dueDate))
    : '-';

  const formattedCreatedAt = selectedItem.createdAt
    ? new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(selectedItem.createdAt))
    : '-';

  const formattedCompletedAt = detail?.completedAt
    ? new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(detail.completedAt))
    : null;

  const handleTransitionClick = async (target: RequestStatus) => {
    const requiredForTarget = transitionRequirements[target] ?? [];
    const requiresModal =
      requiredForTarget.length > 0 ||
      target === 'need_clarification' ||
      target === 'on_hold' ||
      target === 'done' ||
      target === 'rejected';

    if (requiresModal) {
      setActiveTargetStatus(target);
      setShowTransitionDialog(true);
      return;
    }

    // Direct transition without required fields
    try {
      await transitionMutation.mutateAsync({
        id: selectedItem.id,
        version: currentVersion,
        data: { to: target },
      });
      toast.success(
        `Pengajuan berhasil dipindahkan ke status: ${dict.statuses.requests[target] ?? target}`
      );
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ title?: string; detail?: string }>;
      if (axiosErr.response?.status === 409) {
        toast.error(dict.fsm.concurrencyError);
        void refetch();
      } else {
        toast.error(
          axiosErr.response?.data?.detail ||
            axiosErr.response?.data?.title ||
            'Gagal mengubah status pengajuan.'
        );
      }
    }
  };

  const handleConfirmTransition = async (data: TransitionRequestValues) => {
    try {
      await transitionMutation.mutateAsync({
        id: selectedItem.id,
        version: currentVersion,
        data,
      });
      toast.success(dict.requests.transitionDialog.success);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ title?: string; detail?: string }>;
      if (axiosErr.response?.status === 409) {
        toast.error(dict.fsm.concurrencyError);
        void refetch();
      } else {
        throw err;
      }
    }
  };

  const handleConfirmResolveConflict = async (data: ResolveSyncConflictValues) => {
    try {
      await resolveConflictMutation.mutateAsync({
        id: selectedItem.id,
        version: currentVersion,
        data,
      });
      toast.success(dict.requests.conflictDialog.success);
      void refetch();
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ title?: string; detail?: string }>;
      if (axiosErr.response?.status === 409) {
        toast.error(dict.fsm.concurrencyError);
        void refetch();
      } else {
        throw err;
      }
    }
  };

  return (
    <>
      <Sheet open={Boolean(selectedItem)} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="space-y-3 pb-2 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                  {selectedItem.requestNumber}
                </span>
                <Badge variant="outline" className="text-xs">
                  {dict.types.requests[selectedItem.type] ?? selectedItem.type}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-xs capitalize font-medium">
                  {dict.priorities[selectedItem.priority] ?? selectedItem.priority}
                </Badge>
                <Badge variant="outline" className="text-xs font-semibold">
                  {dict.statuses.requests[currentStatus] ?? currentStatus}
                </Badge>
              </div>
            </div>

            <SheetTitle className="text-xl font-bold leading-tight">
              {selectedItem.title}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {dict.requests.drawer.title}
            </SheetDescription>
          </SheetHeader>

          <Separator className="my-3" />

          {/* Sync Conflict Banner (Decision 49) */}
          {hasConflict && (
            <div className="mb-4 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 dark:bg-rose-500/15 space-y-2.5">
              <div className="flex items-start gap-2.5 text-rose-700 dark:text-rose-300">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    {dict.requests.drawer.conflictBannerTitle}
                  </h4>
                  <p className="text-xs mt-0.5 leading-relaxed text-rose-600/90 dark:text-rose-300/90">
                    {dict.requests.drawer.conflictBannerDesc}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setShowConflictDialog(true)}
                className="w-full h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white gap-1.5 font-semibold"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{dict.requests.drawer.resolveConflictButton}</span>
              </Button>
            </div>
          )}

          {/* Linked Work Item Card */}
          <div className="mb-4 p-3 rounded-xl border border-border/70 bg-muted/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  {dict.requests.drawer.linkedWorkItem}
                </span>
              </div>
              {detail?.linkedWorkItemId ? (
                <Link
                  href="/work-center"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <span>{dict.requests.drawer.viewWorkItem}</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              ) : (
                <Badge variant="outline" className="text-[10px] text-muted-foreground font-normal">
                  {dict.requests.drawer.noLinkedWorkItem}
                </Badge>
              )}
            </div>
            {detail?.linkedWorkItemId && (
              <p className="text-[11px] text-muted-foreground mt-1.5 font-mono">
                ID Pekerjaan: {detail.linkedWorkItemId}
              </p>
            )}
          </div>

          {/* Details Grid */}
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px] mb-2.5">
                {dict.requests.drawer.targetInfo}
              </h4>
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-card border border-border/60">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    {dict.requests.table.targetDivision}
                  </span>
                  <p className="font-medium text-foreground">
                    {detail?.targetDivisionName || selectedItem.targetDivisionName || '-'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    {dict.requests.table.pic}
                  </span>
                  <p className="font-medium text-foreground">
                    {detail?.assignedPicName || selectedItem.assignedPicName || 'Belum Ditugaskan'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    {dict.requests.table.requester}
                  </span>
                  <p className="font-medium text-foreground">
                    {detail?.requesterName || selectedItem.requesterName || '-'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {dict.requests.drawer.dueDate}
                  </span>
                  <p className="font-medium text-foreground">{formattedDueDate}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                {dict.requests.drawer.description}
              </h4>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-foreground/90 whitespace-pre-wrap leading-relaxed text-xs">
                {detail?.description || dict.requests.drawer.noDescription}
              </div>
            </div>

            {/* Special Notes Callouts (Clarification, Result, Hold) */}
            {detail?.clarificationNote && (
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs space-y-1">
                <span className="font-bold text-orange-700 dark:text-orange-400 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Catatan Klarifikasi yang Diminta:
                </span>
                <p className="text-foreground/90 leading-relaxed pl-5 whitespace-pre-wrap">
                  {detail.clarificationNote}
                </p>
              </div>
            )}

            {detail?.holdReason && (
              <div className="p-3 rounded-xl bg-zinc-500/10 border border-zinc-500/30 text-xs space-y-1">
                <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <PauseCircle className="h-3.5 w-3.5" />
                  Alasan Penahanan (Hold):
                </span>
                <p className="text-foreground/90 leading-relaxed pl-5 whitespace-pre-wrap">
                  {detail.holdReason}
                </p>
              </div>
            )}

            {detail?.resultSummary && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Ringkasan Hasil / Luaran Akhir:
                </span>
                <p className="text-foreground/90 leading-relaxed pl-5 whitespace-pre-wrap">
                  {detail.resultSummary}
                </p>
              </div>
            )}

            {/* Timeline Meta */}
            <div className="pt-2 text-[11px] text-muted-foreground space-y-1">
              <div>
                {dict.requests.drawer.createdAt}: {formattedCreatedAt}
              </div>
              {formattedCompletedAt && (
                <div>
                  {dict.requests.drawer.completedAt}: {formattedCompletedAt}
                </div>
              )}
            </div>

            {/* Agile Decomposition: Stories & Tasks Section */}
            <div className="space-y-3 p-3.5 rounded-xl border border-primary/20 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-primary">
                    {dict.workCenter.decomposedStories}
                  </h4>
                </div>
                {(currentStatus === 'accepted' || currentStatus === 'in_progress') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDecomposeDialog(true)}
                    className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{dict.workCenter.decomposeTitle}</span>
                  </Button>
                )}
              </div>

              {requestWorkItems?.stories && requestWorkItems.stories.length > 0 ? (
                <div className="space-y-2.5">
                  {requestWorkItems.stories.map((story) => (
                    <div
                      key={story.id}
                      className="p-3 rounded-lg border border-border/80 bg-card space-y-2 text-xs shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground flex items-center gap-1.5">
                          <span>📖</span>
                          <span className="truncate">{story.title}</span>
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            ⚡ {story.storyPoints} SP
                          </span>
                          <Badge variant="secondary" className="text-[10px] capitalize">
                            {dict.statuses.workItems[story.status] ?? story.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Child Tasks */}
                      {story.tasks && story.tasks.length > 0 && (
                        <div className="pl-3 border-l-2 border-primary/20 space-y-1.5 pt-1">
                          {story.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between text-[11px] text-muted-foreground"
                            >
                              <span className="truncate max-w-[65%]">
                                • {task.title}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span>⚡ {task.storyPoints} SP</span>
                                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                                  {dict.statuses.workItems[task.status] ?? task.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Belum ada Story atau Task yang dipecah untuk pengajuan ini. Klik tombol &ldquo;{dict.workCenter.decomposeTitle}&rdquo; di atas untuk memecah pengajuan ini ke dalam Kanban tim pelaksana.
                </p>
              )}
            </div>

            <Separator className="my-3" />

            {/* FSM Workflow Actions */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  {dict.requests.drawer.transitionsTitle}
                </h4>
                {isDetailLoading && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                )}
              </div>

              {hasConflict ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Transisi alur FSM dinonaktifkan sementara karena terdapat konflik sinkronisasi. Selesaikan konflik terlebih dahulu di atas.
                  </span>
                </div>
              ) : availableTransitions.length === 0 ? (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground text-center">
                  {dict.requests.drawer.noTransitions}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableTransitions.map((target) => {
                    const label = dict.statuses.requests[target] ?? target;
                    const isReject = target === 'rejected';
                    const isDone = target === 'done';

                    return (
                      <Button
                        key={target}
                        variant={isReject ? 'destructive' : isDone ? 'default' : 'secondary'}
                        size="sm"
                        disabled={transitionMutation.isPending}
                        onClick={() => handleTransitionClick(target)}
                        className={cn(
                          'justify-between text-xs h-9 font-medium shadow-xs',
                          isDone && 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        )}
                      >
                        <span className="truncate">Lanjutkan ke {label}</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 ml-1 opacity-70" />
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* FSM Transition Dialog */}
      <RequestTransitionDialog
        open={showTransitionDialog}
        onOpenChange={setShowTransitionDialog}
        targetStatus={activeTargetStatus}
        requiredFields={
          activeTargetStatus ? transitionRequirements[activeTargetStatus] ?? [] : []
        }
        isLoading={transitionMutation.isPending}
        onConfirm={handleConfirmTransition}
      />

      {/* Resolve Sync Conflict Dialog */}
      <ResolveSyncConflictDialog
        open={showConflictDialog}
        onOpenChange={setShowConflictDialog}
        requestNumber={selectedItem.requestNumber}
        currentStatus={currentStatus}
        isLoading={resolveConflictMutation.isPending}
        onConfirm={handleConfirmResolveConflict}
      />

      {/* Agile Story Decompose Dialog */}
      <DecomposeRequestDialog
        open={showDecomposeDialog}
        onOpenChange={setShowDecomposeDialog}
        request={selectedItem}
        description={detail?.description}
        onSuccess={() => {
          void refetchWorkItems();
          void refetch();
        }}
      />
    </>
  );
}
