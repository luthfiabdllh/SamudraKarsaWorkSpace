'use client';

import React from 'react';
import { Megaphone, Pin, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { id as dictionary } from '@/lib/dictionaries/id';
import type { AnnouncementItem } from '../types';

interface AnnouncementFeedProps {
  announcements: AnnouncementItem[];
  isLoading: boolean;
}

export function AnnouncementFeed({
  announcements,
  isLoading,
}: AnnouncementFeedProps) {
  const dict = dictionary.team.announcements;

  if (isLoading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs">Memuat pengumuman resmi...</p>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground border border-dashed border-border/70 rounded-xl bg-card/40">
        <div className="flex flex-col items-center justify-center gap-2">
          <Megaphone className="h-9 w-9 text-muted-foreground/40" />
          <p className="font-medium text-foreground">{dict.emptyTitle}</p>
          <p className="text-xs text-muted-foreground max-w-xs">{dict.emptyDescription}</p>
        </div>
      </div>
    );
  }

  // Pinned items first
  const sorted = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-4">
      {sorted.map((item) => (
        <div
          key={item.id}
          className={`p-5 rounded-xl border transition-all shadow-xs space-y-3 ${
            item.pinned
              ? 'border-primary/40 bg-primary/5'
              : 'border-border/70 bg-card/60'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                {item.pinned && (
                  <Badge variant="default" className="text-xs font-normal gap-1 bg-amber-600 hover:bg-amber-600">
                    <Pin size={11} />
                    <span>{dict.pinnedBadge}</span>
                  </Badge>
                )}
                {item.division && (
                  <Badge variant="outline" className="text-xs font-normal">
                    {item.division.name}
                  </Badge>
                )}
                <h3 className="font-bold text-base text-foreground">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0">
              <Calendar size={13} />
              <span>
                {new Date(item.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
            {item.body}
          </div>

          <div className="flex items-center gap-1.5 pt-2 border-t border-border/40 text-xs text-muted-foreground">
            <User size={13} className="shrink-0" />
            <span>Oleh {item.author?.fullName || item.author?.email || 'Pimpinan Organisasi'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
