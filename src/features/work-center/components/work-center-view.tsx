'use client';

import React, { useState, useMemo } from 'react';
import { WorkCenterHeader } from './work-center-header';
import { KanbanBoard } from './kanban-board';
import { WorkCenterTable } from './work-center-table';
import { WorkItemDrawer } from './work-item-drawer';
import { CreateWorkItemDialog } from './create-work-item-dialog';
import { useWorkItems } from '../api/use-work-items';
import type { WorkCenterFilterParams, WorkItem } from '../types';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/i18n';

interface WorkCenterViewProps {
  currentUserId?: string;
}

export function WorkCenterView({ currentUserId }: WorkCenterViewProps) {
  const dict = getDictionary();
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');
  const [filters, setFilters] = useState<WorkCenterFilterParams>({});
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Fetch work items from BFF
  const {
    data: rawItems,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useWorkItems(filters);

  const items = useMemo(() => rawItems ?? [], [rawItems]);

  // Count without PIC for badge
  const withoutPicCount = useMemo(() => {
    return items.filter((item) => !item.primaryPicId).length;
  }, [items]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Control Header */}
      <WorkCenterHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFiltersChange={setFilters}
        onOpenCreateDialog={() => setCreateDialogOpen(true)}
        totalCount={items.length}
        withoutPicCount={withoutPicCount}
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
            Gagal memuat data pekerjaan dari server backend.
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
        /* Main View Container */
        <div className="relative">
          {isFetching && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary font-medium">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>{dict.common.refresh}</span>
              </span>
            </div>
          )}

          {viewMode === 'board' ? (
            <KanbanBoard items={items} onSelectCard={(item) => setSelectedItem(item)} />
          ) : (
            <WorkCenterTable items={items} onSelectItem={(item) => setSelectedItem(item)} />
          )}
        </div>
      )}

      {/* Slide-over Detail Drawer */}
      <WorkItemDrawer
        selectedItem={selectedItem}
        currentUserId={currentUserId}
        onClose={() => setSelectedItem(null)}
      />

      {/* Create Work Item Modal */}
      <CreateWorkItemDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
