'use client';

import React from 'react';
import type { LetterItem, LetterStatus } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Inbox,
  Send,
  UserCheck,
  UserX,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface LetterTableProps {
  items: LetterItem[];
  onSelectLetter: (letter: LetterItem) => void;
}

function getLetterStatusBadgeClass(status: LetterStatus): string {
  switch (status) {
    case 'submitted':
      return 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30';
    case 'needs_completion':
      return 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30';
    case 'verified':
      return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
    case 'drafting':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
    case 'review':
      return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
    case 'awaiting_signature':
      return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
    case 'ready_to_send':
      return 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30';
    case 'sent':
      return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
    case 'done':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function LetterTable({ items, onSelectLetter }: LetterTableProps) {
  const dict = getDictionary();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card">
        <div className="p-3 rounded-full bg-muted/60 text-muted-foreground mb-3">
          <Inbox className="h-8 w-8" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          {dict.letters.emptyTitle}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {dict.letters.emptyDescription}
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
                {dict.letters.table.letterNumber}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.letters.table.subject}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.letters.table.direction}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.letters.table.correspondent}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.letters.table.pic}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.letters.table.status}
              </th>
              <th scope="col" className="px-4 py-3.5">
                {dict.letters.table.date}
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                {dict.letters.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((item) => {
              const isInbound = item.direction === 'inbound';
              const formattedDate = item.letterDate
                ? new Intl.DateTimeFormat('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(item.letterDate))
                : '-';

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectLetter(item)}
                  className="group hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  {/* Letter Number */}
                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-primary whitespace-nowrap">
                    {item.letterNumber}
                  </td>

                  {/* Subject & Kind */}
                  <td className="px-4 py-3.5 max-w-xs">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {item.subject}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Klasifikasi: <span className="font-mono">{item.letterKind}</span>
                    </div>
                  </td>

                  {/* Direction */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs font-medium border gap-1 px-2 py-0.5',
                        isInbound
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30'
                      )}
                    >
                      {isInbound ? (
                        <Inbox className="h-3 w-3" />
                      ) : (
                        <Send className="h-3 w-3" />
                      )}
                      <span>{dict.types.letters[item.direction] ?? item.direction}</span>
                    </Badge>
                  </td>

                  {/* Correspondent (Institution or Person) */}
                  <td className="px-4 py-3.5 text-xs text-foreground/90 whitespace-nowrap">
                    {item.institution || item.senderRecipient || '-'}
                  </td>

                  {/* PIC */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {item.picName ? (
                      <div className="flex items-center gap-1.5 text-xs text-foreground/90">
                        <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{item.picName}</span>
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

                  {/* Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs font-medium border px-2 py-0.5',
                        getLetterStatusBadgeClass(item.status)
                      )}
                    >
                      {dict.statuses.letters[item.status] ?? item.status}
                    </Badge>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>{formattedDate}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLetter(item);
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
