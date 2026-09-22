'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  Inbox,
  Send,
  ScrollText,
  X,
  RotateCcw,
} from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import {
  LETTER_STATUSES,
  type LetterDirection,
  type LetterFilterParams,
  type LetterStatus,
} from '../types';
import { cn } from '@/lib/utils';

interface LetterHeaderProps {
  filters: LetterFilterParams;
  onFiltersChange: (filters: LetterFilterParams) => void;
  onOpenCreateDialog: () => void;
  totalCount: number;
  inboundCount: number;
  outboundCount: number;
}

export function LetterHeader({
  filters,
  onFiltersChange,
  onOpenCreateDialog,
  totalCount,
  inboundCount,
  outboundCount,
}: LetterHeaderProps) {
  const dict = getDictionary();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      q: e.target.value || undefined,
    });
  };

  const handleStatusChange = (val: string) => {
    onFiltersChange({
      ...filters,
      status: val === 'all' ? undefined : (val as LetterStatus),
    });
  };

  const handleDirectionChange = (direction?: LetterDirection) => {
    onFiltersChange({
      ...filters,
      direction,
    });
  };

  const handleResetFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Boolean(filters.q || filters.status || filters.direction);

  return (
    <div className="space-y-4">
      {/* Top Banner Row: Title + Register Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {dict.letters.title}
            </h1>
            <Badge variant="secondary" className="font-semibold text-xs">
              {totalCount}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {dict.letters.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button onClick={onOpenCreateDialog} className="gap-2 shadow-xs">
            <Plus className="h-4 w-4" />
            <span>{dict.letters.createButton}</span>
          </Button>
        </div>
      </div>

      {/* Control Bar: Direction Tabs + Status Select + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Direction Tabs */}
          <div className="inline-flex rounded-xl border border-border p-1 bg-muted/40">
            <Button
              type="button"
              variant={!filters.direction ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleDirectionChange(undefined)}
              className={cn(
                'h-7 px-3 gap-1.5 text-xs font-medium',
                !filters.direction && 'shadow-xs bg-background text-foreground'
              )}
            >
              <ScrollText className="h-3.5 w-3.5" />
              <span>{dict.letters.tabs.all}</span>
            </Button>

            <Button
              type="button"
              variant={filters.direction === 'inbound' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleDirectionChange('inbound')}
              className={cn(
                'h-7 px-3 gap-1.5 text-xs font-medium',
                filters.direction === 'inbound' && 'shadow-xs bg-background text-foreground'
              )}
            >
              <Inbox className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{dict.letters.tabs.inbound}</span>
              <span className="text-[10px] opacity-75">({inboundCount})</span>
            </Button>

            <Button
              type="button"
              variant={filters.direction === 'outbound' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleDirectionChange('outbound')}
              className={cn(
                'h-7 px-3 gap-1.5 text-xs font-medium',
                filters.direction === 'outbound' && 'shadow-xs bg-background text-foreground'
              )}
            >
              <Send className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>{dict.letters.tabs.outbound}</span>
              <span className="text-[10px] opacity-75">({outboundCount})</span>
            </Button>
          </div>

          {/* Status Select */}
          <div className="w-44">
            <Select
              value={filters.status ?? 'all'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={dict.letters.filterStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{dict.letters.filterStatus}</SelectItem>
                {LETTER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {dict.statuses.letters[s] ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{dict.common.resetFilter}</span>
            </Button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={filters.q ?? ''}
            onChange={handleSearchChange}
            placeholder={dict.letters.searchPlaceholder}
            className="pl-8 pr-8 h-9 text-xs"
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, q: undefined })}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
