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
  AlertTriangle,
  UserX,
  X,
  RotateCcw,
} from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import {
  REQUEST_PRIORITIES,
  REQUEST_STATUSES,
  REQUEST_TYPES,
  type RequestFilterParams,
  type RequestPriority,
  type RequestStatus,
  type RequestType,
} from '../types';
import type { DivisionOption } from '../api/use-requests';
import { cn } from '@/lib/utils';

interface RequestHeaderProps {
  filters: RequestFilterParams;
  onFiltersChange: (filters: RequestFilterParams) => void;
  onOpenCreateDialog: () => void;
  totalCount: number;
  syncConflictCount: number;
  withoutPicCount: number;
  divisions: DivisionOption[];
}

export function RequestHeader({
  filters,
  onFiltersChange,
  onOpenCreateDialog,
  totalCount,
  syncConflictCount,
  withoutPicCount,
  divisions,
}: RequestHeaderProps) {
  const dict = getDictionary();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      q: e.target.value || undefined,
    });
  };

  const handleDivisionChange = (val: string) => {
    onFiltersChange({
      ...filters,
      targetDivisionId: val === 'all' ? undefined : val,
    });
  };

  const handleStatusChange = (val: string) => {
    onFiltersChange({
      ...filters,
      status: val === 'all' ? undefined : (val as RequestStatus),
    });
  };

  const handlePriorityChange = (val: string) => {
    onFiltersChange({
      ...filters,
      priority: val === 'all' ? undefined : (val as RequestPriority),
    });
  };

  const handleTypeChange = (val: string) => {
    onFiltersChange({
      ...filters,
      type: val === 'all' ? undefined : (val as RequestType),
    });
  };

  const handleToggleSyncConflict = () => {
    onFiltersChange({
      ...filters,
      hasSyncConflict: !filters.hasSyncConflict ? true : undefined,
    });
  };

  const handleToggleWithoutPic = () => {
    onFiltersChange({
      ...filters,
      withoutPic: !filters.withoutPic ? true : undefined,
    });
  };

  const handleResetFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Boolean(
    filters.q ||
      filters.targetDivisionId ||
      filters.status ||
      filters.priority ||
      filters.type ||
      filters.hasSyncConflict ||
      filters.withoutPic
  );

  return (
    <div className="space-y-4">
      {/* Top Banner Row: Title + Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {dict.requests.title}
            </h1>
            <Badge variant="secondary" className="font-semibold text-xs">
              {totalCount}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {dict.requests.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button onClick={onOpenCreateDialog} className="gap-2 shadow-xs">
            <Plus className="h-4 w-4" />
            <span>{dict.requests.createButton}</span>
          </Button>
        </div>
      </div>

      {/* Control Bar: Search + Quick Toggle Tabs + Dropdown Filters */}
      <div className="flex flex-col gap-3 pt-2">
        {/* Row 1: Search + Quick Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={filters.q ?? ''}
              onChange={handleSearchChange}
              placeholder={dict.requests.searchPlaceholder}
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

          {/* Quick Tab: Konflik Sinkronisasi */}
          <Button
            type="button"
            variant={filters.hasSyncConflict ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleSyncConflict}
            className={cn(
              'h-9 gap-1.5 text-xs font-medium',
              filters.hasSyncConflict
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'text-muted-foreground hover:text-foreground border-border/80'
            )}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{dict.requests.tabs.conflict}</span>
            {syncConflictCount > 0 && (
              <Badge
                variant={filters.hasSyncConflict ? 'secondary' : 'outline'}
                className={cn(
                  'px-1.5 py-0 text-[10px] h-4 font-bold',
                  filters.hasSyncConflict
                    ? 'bg-white/20 text-white'
                    : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                )}
              >
                {syncConflictCount}
              </Badge>
            )}
          </Button>

          {/* Quick Tab: Tanpa PIC */}
          <Button
            type="button"
            variant={filters.withoutPic ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleWithoutPic}
            className={cn(
              'h-9 gap-1.5 text-xs font-medium',
              filters.withoutPic
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'text-muted-foreground hover:text-foreground border-border/80'
            )}
          >
            <UserX className="h-3.5 w-3.5" />
            <span>{dict.requests.tabs.withoutPic}</span>
            {withoutPicCount > 0 && (
              <Badge
                variant={filters.withoutPic ? 'secondary' : 'outline'}
                className={cn(
                  'px-1.5 py-0 text-[10px] h-4 font-bold',
                  filters.withoutPic
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                )}
              >
                {withoutPicCount}
              </Badge>
            )}
          </Button>

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

        {/* Row 2: Secondary Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Target Division Select */}
          <div className="w-44">
            <Select
              value={filters.targetDivisionId ?? 'all'}
              onValueChange={handleDivisionChange}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={dict.requests.filterTargetDivision} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{dict.requests.filterTargetDivision}</SelectItem>
                {divisions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Select */}
          <div className="w-36">
            <Select
              value={filters.status ?? 'all'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={dict.requests.filterStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{dict.requests.filterStatus}</SelectItem>
                {REQUEST_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {dict.statuses.requests[s] ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Select */}
          <div className="w-40">
            <Select
              value={filters.type ?? 'all'}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={dict.requests.filterType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{dict.requests.filterType}</SelectItem>
                {REQUEST_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {dict.types.requests[t] ?? t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Select */}
          <div className="w-32">
            <Select
              value={filters.priority ?? 'all'}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={dict.requests.filterPriority} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{dict.requests.filterPriority}</SelectItem>
                {REQUEST_PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {dict.priorities[p] ?? p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
