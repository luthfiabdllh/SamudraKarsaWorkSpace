'use client';

import React, { useState, useMemo } from 'react';
import { LetterHeader } from './letter-header';
import { LetterTable } from './letter-table';
import { LetterDrawer } from './letter-drawer';
import { CreateLetterDialog } from './create-letter-dialog';
import { useLetters } from '../api/use-letters';
import type { LetterFilterParams, LetterItem } from '../types';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/i18n';

export function LetterView() {
  const dict = getDictionary();

  const [filters, setFilters] = useState<LetterFilterParams>({});
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Query letters
  const { data: rawLetters = [], isLoading, isError, refetch, isFetching } = useLetters(filters);

  // Search filter applied in client if query is provided
  const items = useMemo(() => {
    if (!filters.q) return rawLetters;
    const query = filters.q.toLowerCase();
    return rawLetters.filter(
      (l) =>
        l.letterNumber.toLowerCase().includes(query) ||
        l.subject.toLowerCase().includes(query) ||
        (l.institution && l.institution.toLowerCase().includes(query)) ||
        (l.senderRecipient && l.senderRecipient.toLowerCase().includes(query))
    );
  }, [rawLetters, filters.q]);

  const inboundCount = useMemo(() => {
    return rawLetters.filter((l) => l.direction === 'inbound').length;
  }, [rawLetters]);

  const outboundCount = useMemo(() => {
    return rawLetters.filter((l) => l.direction === 'outbound').length;
  }, [rawLetters]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <LetterHeader
        filters={filters}
        onFiltersChange={setFilters}
        onOpenCreateDialog={() => setCreateDialogOpen(true)}
        totalCount={items.length}
        inboundCount={inboundCount}
        outboundCount={outboundCount}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3 rounded-2xl border border-border/60 bg-muted/20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground font-medium">
            {dict.common.loading}
          </span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3">
          <div className="text-destructive font-semibold text-sm">
            Gagal memuat arsip surat dari server backend.
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
        <div className="relative">
          {isFetching && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary font-medium shadow-xs">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>{dict.common.refresh}</span>
              </span>
            </div>
          )}

          <LetterTable
            items={items}
            onSelectLetter={(letter) => setSelectedLetter(letter)}
          />
        </div>
      )}

      {/* Letter Detail Drawer */}
      <LetterDrawer
        selectedLetter={selectedLetter}
        onClose={() => setSelectedLetter(null)}
      />

      {/* Create Letter Dialog */}
      <CreateLetterDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
