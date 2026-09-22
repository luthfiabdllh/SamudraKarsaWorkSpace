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
  LayoutGrid,
  Table as TableIcon,
  Search,
  Plus,
  AlertCircle,
  X,
} from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { WORK_ITEM_PRIORITIES, type WorkCenterFilterParams, type WorkItemPriority } from '../types';
import { cn } from '@/lib/utils';

interface WorkCenterHeaderProps {
  viewMode: 'board' | 'table';
  onViewModeChange: (mode: 'board' | 'table') => void;
  filters: WorkCenterFilterParams;
  onFiltersChange: (filters: WorkCenterFilterParams) => void;
  onOpenCreateDialog: () => void;
  totalCount: number;
  withoutPicCount: number;
}

export function WorkCenterHeader({
  viewMode,
  onViewModeChange,
  filters,
  onFiltersChange,
  onOpenCreateDialog,
  totalCount,
  withoutPicCount,
}: WorkCenterHeaderProps) {
  const dict = getDictionary();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      q: e.target.value || undefined,
    });
  };

  const handlePriorityChange = (val: string) => {
    onFiltersChange({
      ...filters,
      priority: val === 'all' ? undefined : (val as WorkItemPriority),
    });
  };

  const handleToggleWithoutPic = () => {
    onFiltersChange({
      ...filters,
      withoutPic: !filters.withoutPic,
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Row: Title + Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {dict.workCenter.title}
            </h1>
            <Badge variant="secondary" className="font-semibold text-xs">
              {totalCount}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {dict.workCenter.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button onClick={onOpenCreateDialog} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>{dict.workCenter.createButton}</span>
          </Button>
        </div>
      </div>

      {/* Control Bar: Search + Filters + View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={filters.q ?? ''}
              onChange={handleSearchChange}
              placeholder={dict.workCenter.searchPlaceholder}
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

          {/* Priority Select */}
          <div className="w-36">
            <Select
              value={filters.priority ?? 'all'}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={dict.workCenter.filterPriority} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{dict.workCenter.filterPriority}</SelectItem>
                {WORK_ITEM_PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {dict.priorities[p] ?? p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Tab: Pekerjaan Tanpa PIC */}
          <Button
            type="button"
            variant={filters.withoutPic ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleWithoutPic}
            className={cn(
              'h-9 gap-2 text-xs font-medium',
              filters.withoutPic
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'text-muted-foreground hover:text-foreground border-border/80'
            )}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{dict.workCenter.views.withoutPic}</span>
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
        </div>

        {/* View Switcher: Board vs Table */}
        <div className="inline-flex rounded-lg border border-border p-1 bg-muted/40 shrink-0 self-start lg:self-auto">
          <Button
            type="button"
            variant={viewMode === 'board' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('board')}
            className={cn(
              'h-7 px-2.5 gap-1.5 text-xs font-medium',
              viewMode === 'board' && 'shadow-xs bg-background text-foreground'
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>{dict.workCenter.views.board}</span>
          </Button>
          <Button
            type="button"
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className={cn(
              'h-7 px-2.5 gap-1.5 text-xs font-medium',
              viewMode === 'table' && 'shadow-xs bg-background text-foreground'
            )}
          >
            <TableIcon className="h-3.5 w-3.5" />
            <span>{dict.workCenter.views.table}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
