'use client';

import React, { useState, useMemo } from 'react';
import { RequestHeader } from './request-header';
import { RequestTable } from './request-table';
import { RequestDrawer } from './request-drawer';
import { CreateRequestDialog } from './create-request-dialog';
import { ResolveSyncConflictDialog } from './resolve-sync-conflict-dialog';
import { useRequests, useDivisions } from '../api/use-requests';
import { useResolveSyncConflict } from '../api/use-request-mutations';
import type { RequestFilterParams, RequestItem } from '../types';
import type { ResolveSyncConflictValues } from '../schemas/request';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/i18n';
import { toast } from 'sonner';

export function RequestView() {
  const dict = getDictionary();
  const [filters, setFilters] = useState<RequestFilterParams>({});
  const [selectedItem, setSelectedItem] = useState<RequestItem | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [conflictItemToResolve, setConflictItemToResolve] = useState<RequestItem | null>(null);

  // Queries
  const {
    data: rawItems,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useRequests(filters);

  const { data: rawDivisions } = useDivisions();

  const resolveConflictMutation = useResolveSyncConflict();

  const items = useMemo(() => rawItems ?? [], [rawItems]);
  const divisions = useMemo(() => rawDivisions ?? [], [rawDivisions]);

  // Derived metric counts
  const syncConflictCount = useMemo(() => {
    return items.filter((item) => Boolean(item.syncConflictAt)).length;
  }, [items]);

  const withoutPicCount = useMemo(() => {
    return items.filter((item) => !item.assignedPicId).length;
  }, [items]);

  const handleConfirmDirectResolve = async (data: ResolveSyncConflictValues) => {
    if (!conflictItemToResolve) return;

    try {
      await resolveConflictMutation.mutateAsync({
        id: conflictItemToResolve.id,
        version: conflictItemToResolve.version,
        data,
      });
      toast.success(dict.requests.conflictDialog.success);
      setConflictItemToResolve(null);
      void refetch();
    } catch (err: unknown) {
      const maybeAxios = err as { response?: { status?: number } };
      if (maybeAxios.response?.status === 409) {
        toast.error(dict.fsm.concurrencyError);
        void refetch();
      } else {
        throw err;
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Control Header */}
      <RequestHeader
        filters={filters}
        onFiltersChange={setFilters}
        onOpenCreateDialog={() => setCreateDialogOpen(true)}
        totalCount={items.length}
        syncConflictCount={syncConflictCount}
        withoutPicCount={withoutPicCount}
        divisions={divisions}
      />

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3 rounded-2xl border border-border/60 bg-muted/20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground font-medium">
            {dict.common.loading}
          </span>
        </div>
      ) : isError ? (
        /* Error State */
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3">
          <div className="text-destructive font-semibold text-sm">
            Gagal memuat data pengajuan dari server backend.
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            className="gap-2 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{dict.common.retry}</span>
          </Button>
        </div>
      ) : (
        /* Main Table Container */
        <div className="relative">
          {isFetching && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary font-medium shadow-xs">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>{dict.common.refresh}</span>
              </span>
            </div>
          )}

          <RequestTable
            items={items}
            onSelectItem={(item) => setSelectedItem(item)}
            onResolveConflictClick={(item) => setConflictItemToResolve(item)}
          />
        </div>
      )}

      {/* Slide-over Detail Drawer */}
      <RequestDrawer
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Create Request Dialog */}
      <CreateRequestDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        divisions={divisions}
      />

      {/* Direct Resolve Conflict Dialog (when clicked directly from table) */}
      {conflictItemToResolve && (
        <ResolveSyncConflictDialog
          open={Boolean(conflictItemToResolve)}
          onOpenChange={(open) => !open && setConflictItemToResolve(null)}
          requestNumber={conflictItemToResolve.requestNumber}
          currentStatus={conflictItemToResolve.status}
          isLoading={resolveConflictMutation.isPending}
          onConfirm={handleConfirmDirectResolve}
        />
      )}
    </div>
  );
}
