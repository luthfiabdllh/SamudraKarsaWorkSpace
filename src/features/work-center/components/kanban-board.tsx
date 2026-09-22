'use client';

import React from 'react';
import type { WorkItem, WorkItemStatus } from '../types';
import { KanbanCard } from './kanban-card';
import { getDictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

interface KanbanBoardProps {
  items: WorkItem[];
  onSelectCard: (item: WorkItem) => void;
}

interface ColumnDefinition {
  id: string;
  titleKey: keyof typeof import('@/lib/dictionaries/id').id.workCenter.columns;
  statuses: WorkItemStatus[];
  headerColor: string;
  countBadgeColor: string;
}

const KANBAN_COLUMNS: ColumnDefinition[] = [
  {
    id: 'draft',
    titleKey: 'draft',
    statuses: ['draft'],
    headerColor: 'border-slate-400/60 dark:border-slate-600/60',
    countBadgeColor: 'bg-slate-500/15 text-slate-700 dark:text-slate-300',
  },
  {
    id: 'submitted',
    titleKey: 'submitted',
    statuses: ['submitted'],
    headerColor: 'border-blue-400/60 dark:border-blue-600/60',
    countBadgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  },
  {
    id: 'in_progress',
    titleKey: 'in_progress',
    statuses: ['in_progress', 'approved', 'need_review'],
    headerColor: 'border-amber-400/60 dark:border-amber-600/60',
    countBadgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  },
  {
    id: 'on_hold',
    titleKey: 'on_hold',
    statuses: ['on_hold'],
    headerColor: 'border-rose-400/60 dark:border-rose-600/60',
    countBadgeColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
  },
  {
    id: 'done',
    titleKey: 'done',
    statuses: ['done'],
    headerColor: 'border-emerald-400/60 dark:border-emerald-600/60',
    countBadgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  },
];

export function KanbanBoard({ items, onSelectCard }: KanbanBoardProps) {
  const dict = getDictionary();

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-125">
      {KANBAN_COLUMNS.map((col) => {
        const columnItems = items.filter((item) => col.statuses.includes(item.status));
        const columnTitle = dict.workCenter.columns[col.titleKey] ?? col.id;

        return (
          <div
            key={col.id}
            className="w-72 sm:w-80 shrink-0 flex flex-col rounded-2xl bg-muted/40 border border-border/70 p-3"
          >
            {/* Column Header */}
            <div
              className={cn(
                'flex items-center justify-between pb-3 mb-3 border-b-2 font-semibold text-xs uppercase tracking-wider',
                col.headerColor
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-foreground">{columnTitle}</span>
              </div>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-bold',
                  col.countBadgeColor
                )}
              >
                {columnItems.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-0.5">
              {columnItems.length > 0 ? (
                columnItems.map((item) => (
                  <KanbanCard
                    key={item.id}
                    item={item}
                    onClick={() => onSelectCard(item)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/60 rounded-xl bg-card/40 my-2">
                  <Inbox className="h-6 w-6 text-muted-foreground/40 mb-1.5" />
                  <span className="text-xs text-muted-foreground font-medium">
                    {dict.workCenter.emptyTitle}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
