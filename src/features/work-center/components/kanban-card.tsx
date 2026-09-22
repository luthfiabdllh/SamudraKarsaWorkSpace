'use client';

import React from 'react';
import type { WorkItem, WorkItemPriority } from '../types';
import { Badge } from '@/components/ui/badge';
import { Calendar, UserCheck, AlertCircle } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  item: WorkItem;
  onClick: () => void;
}

const PRIORITY_STYLES: Record<WorkItemPriority, { badge: string; border: string }> = {
  urgent: {
    badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    border: 'border-l-rose-500',
  },
  high: {
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    border: 'border-l-amber-500',
  },
  medium: {
    badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    border: 'border-l-blue-500',
  },
  low: {
    badge: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
    border: 'border-l-slate-400',
  },
};

export function KanbanCard({ item, onClick }: KanbanCardProps) {
  const dict = getDictionary();
  const priorityStyle = PRIORITY_STYLES[item.priority] ?? PRIORITY_STYLES.medium;

  const formattedDueDate = item.dueDate
    ? new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
      }).format(new Date(item.dueDate))
    : null;

  const isOverdue =
    item.dueDate &&
    item.status !== 'done' &&
    new Date(item.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'group text-left cursor-pointer rounded-xl border border-border/80 bg-card p-3.5 shadow-xs transition-all duration-200',
        'hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary',
        'border-l-[3.5px]',
        priorityStyle.border
      )}
    >
      {/* Top row: Work Number + Priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
          {item.workNumber}
        </span>
        <Badge
          variant="outline"
          className={cn('text-[10px] px-1.5 py-0 h-4 font-semibold uppercase', priorityStyle.badge)}
        >
          {dict.priorities[item.priority] ?? item.priority}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-2.5">
        {item.title}
      </h3>

      {/* Progress Bar (if progress > 0 or in progress) */}
      {item.progressPercentage > 0 && (
        <div className="space-y-1 mb-2.5">
          <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
            <span>{dict.workCenter.table.progress}</span>
            <span>{item.progressPercentage}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${item.progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer: PIC + Due Date */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50 text-[11px]">
        {/* PIC Info */}
        <div className="flex items-center gap-1 text-muted-foreground min-w-0 max-w-[60%]">
          {item.primaryPicName ? (
            <>
              <UserCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">{item.primaryPicName}</span>
            </>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-500 font-medium">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span className="truncate">{dict.workCenter.drawer.noPic}</span>
            </span>
          )}
        </div>

        {/* Due Date */}
        {formattedDueDate && (
          <div
            className={cn(
              'flex items-center gap-1 font-medium shrink-0',
              isOverdue
                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                : 'text-muted-foreground'
            )}
          >
            <Calendar className="h-3 w-3" />
            <span>{formattedDueDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
