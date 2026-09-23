'use client';

import React from 'react';
import { Layers, GraduationCap, MapPin, Plus, Search, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { id as dictionary } from '@/lib/dictionaries/id';

export type DivisionsTab = 'divisions' | 'clusters' | 'subunits';

interface DivisionsHeaderProps {
  activeTab: DivisionsTab;
  onTabChange: (tab: DivisionsTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  canCreate: boolean;
  onOpenCreate: () => void;
}

export function DivisionsHeader({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  canCreate,
  onOpenCreate,
}: DivisionsHeaderProps) {
  const dict = dictionary.divisions;

  return (
    <div className="space-y-4">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Building2 className="h-7 w-7 text-primary shrink-0" aria-hidden="true" />
            {dict.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {dict.subtitle}
          </p>
        </div>

        {canCreate && activeTab === 'divisions' && (
          <Button
            id="add-division-btn"
            onClick={onOpenCreate}
            className="gap-2 shadow-sm shrink-0"
          >
            <Plus size={16} aria-hidden="true" />
            <span>{dict.addDivision}</span>
          </Button>
        )}
      </div>

      {/* Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            id="tab-divisions"
            onClick={() => onTabChange('divisions')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'divisions'
                ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Layers size={15} />
            {dict.tabs.divisions}
          </button>

          <button
            type="button"
            id="tab-clusters"
            onClick={() => onTabChange('clusters')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'clusters'
                ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <GraduationCap size={15} />
            {dict.tabs.clusters}
          </button>

          <button
            type="button"
            id="tab-subunits"
            onClick={() => onTabChange('subunits')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'subunits'
                ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <MapPin size={15} />
            {dict.tabs.subunits}
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="divisions-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={dict.searchPlaceholder}
            className="pl-9 h-9 text-xs sm:text-sm bg-background/80"
          />
        </div>
      </div>
    </div>
  );
}
