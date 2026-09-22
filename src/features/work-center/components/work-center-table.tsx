'use client';

import React from 'react';
import type { WorkItem } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, UserCheck, AlertCircle, ChevronRight, Inbox } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface WorkCenterTableProps {
  items: WorkItem[];
  onSelectItem: (item: WorkItem) => void;
}

export function WorkCenterTable({ items, onSelectItem }: WorkCenterTableProps) {
  const dict = getDictionary();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card">
        <div className="p-3 rounded-full bg-muted/60 text-muted-foreground mb-3">
          <Inbox className="h-8 w-8" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          {dict.workCenter.emptyTitle}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {dict.workCenter.emptyDescription}
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
                {dict.workCenter.table.workNumber}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.workCenter.table.title}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.workCenter.table.priority}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.workCenter.table.status}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.workCenter.table.pic}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.workCenter.table.dueDate}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.workCenter.table.progress}
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                {dict.workCenter.table.actions}
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
                new Date(item.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="group hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  {/* Work Number */}
                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-primary">
                    {item.workNumber}
                  </td>

                  {/* Title & Type */}
                  <td className="px-4 py-3.5 max-w-xs">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {dict.types.workItems[item.type] ?? item.type}
                      {item.divisionName && ` • ${item.divisionName}`}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3.5">
                    <Badge variant="outline" className="text-xs capitalize">
                      {dict.priorities[item.priority] ?? item.priority}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {dict.statuses.workItems[item.status] ?? item.status}
                    </Badge>
                  </td>

                  {/* PIC */}
                  <td className="px-4 py-3.5">
                    {item.primaryPicName ? (
                      <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                        <UserCheck className="h-3.5 w-3.5 text-primary" />
                        <span>{item.primaryPicName}</span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500 font-medium">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>{dict.workCenter.drawer.noPic}</span>
                      </span>
                    )}
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
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formattedDueDate}</span>
                    </div>
                  </td>

                  {/* Progress */}
                  <td className="px-4 py-3.5 min-w-28">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground font-medium text-right">
                        {item.progressPercentage}%
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${item.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground group-hover:text-foreground"
                    >
                      <span className="text-xs mr-1">{dict.common.viewDetails}</span>
                      <ChevronRight className="h-4 w-4" />
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
