'use client';

import React from 'react';
import type { RequestItem, RequestPriority, RequestStatus } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  UserCheck,
  UserX,
  ChevronRight,
  Inbox,
  Clock,
} from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface RequestTableProps {
  items: RequestItem[];
  onSelectItem: (item: RequestItem) => void;
  onResolveConflictClick?: (item: RequestItem) => void;
}

/**
 * Kembalikan kelas warna untuk status badge pengajuan
 */
function getStatusBadgeClass(status: RequestStatus): string {
  switch (status) {
    case 'draft':
      return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20';
    case 'submitted':
      return 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30';
    case 'accepted':
      return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
    case 'in_progress':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
    case 'need_review':
      return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
    case 'need_clarification':
      return 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30';
    case 'on_hold':
      return 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-zinc-500/30';
    case 'done':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    case 'rejected':
      return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

/**
 * Kembalikan kelas badge prioritas
 */
function getPriorityBadgeClass(priority: RequestPriority): string {
  switch (priority) {
    case 'urgent':
      return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 font-semibold';
    case 'high':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
    case 'medium':
      return 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30';
    case 'low':
      return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20';
    default:
      return '';
  }
}

export function RequestTable({
  items,
  onSelectItem,
  onResolveConflictClick,
}: RequestTableProps) {
  const dict = getDictionary();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card">
        <div className="p-3 rounded-full bg-muted/60 text-muted-foreground mb-3">
          <Inbox className="h-8 w-8" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          {dict.requests.emptyTitle}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {dict.requests.emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/80 bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3.5">
                {dict.requests.table.requestNumber}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.requests.table.titleAndType}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.requests.table.targetDivision}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.requests.table.requester}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.requests.table.pic}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.requests.table.status}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.requests.table.dueDate}
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                {dict.requests.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((item) => {
              const formattedDueDate = item.dueDate
                ? new Intl.DateTimeFormat('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(item.dueDate))
                : '-';

              const isOverdue =
                item.dueDate &&
                item.status !== 'done' &&
                item.status !== 'rejected' &&
                new Date(item.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

              const hasConflict = Boolean(item.syncConflictAt);

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="group hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  {/* Request Number */}
                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-primary whitespace-nowrap">
                    {item.requestNumber}
                  </td>

                  {/* Title & Type */}
                  <td className="px-4 py-3.5 max-w-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                      <span>{dict.types.requests[item.type] ?? item.type}</span>
                      <span>•</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] px-1 py-0 h-4 border font-normal',
                          getPriorityBadgeClass(item.priority)
                        )}
                      >
                        {dict.priorities[item.priority] ?? item.priority}
                      </Badge>
                    </div>
                  </td>

                  {/* Target Division */}
                  <td className="px-4 py-3.5 text-xs text-foreground/90 whitespace-nowrap">
                    {item.targetDivisionName || '-'}
                  </td>

                  {/* Requester */}
                  <td className="px-4 py-3.5 text-xs text-foreground/90 whitespace-nowrap">
                    {item.requesterName || '-'}
                  </td>

                  {/* PIC */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {item.assignedPicName ? (
                      <div className="flex items-center gap-1.5 text-xs text-foreground/90">
                        <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{item.assignedPicName}</span>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-[10px] gap-1 font-normal py-0 h-5"
                      >
                        <UserX className="h-3 w-3" />
                        <span>Belum Ada PIC</span>
                      </Badge>
                    )}
                  </td>

                  {/* Status & Sync Conflict */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1 items-start">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs font-medium border px-2 py-0.5',
                          getStatusBadgeClass(item.status)
                        )}
                      >
                        {dict.statuses.requests[item.status] ?? item.status}
                      </Badge>

                      {hasConflict && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onResolveConflictClick?.(item);
                          }}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-[10px] font-semibold hover:bg-rose-500/25 transition-colors cursor-pointer"
                          title="Klik untuk menyelesaikan konflik sinkronisasi"
                        >
                          <AlertTriangle className="h-3 w-3 text-rose-600 animate-pulse" />
                          <span>Konflik Sinkronisasi</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div
                      className={cn(
                        'flex items-center gap-1.5 text-xs',
                        isOverdue
                          ? 'text-rose-600 dark:text-rose-400 font-semibold'
                          : 'text-muted-foreground'
                      )}
                    >
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{formattedDueDate}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                      className="h-8 px-2 text-xs text-muted-foreground group-hover:text-primary"
                    >
                      <span>{dict.common.viewDetails}</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
