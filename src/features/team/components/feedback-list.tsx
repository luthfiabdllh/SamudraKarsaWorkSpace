'use client';

import React from 'react';
import { MessageSquare, ShieldCheck, UserCheck, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { id as dictionary } from '@/lib/dictionaries/id';
import type { FeedbackItem } from '../types';

interface FeedbackListProps {
  feedback: FeedbackItem[];
  isLoading: boolean;
}

export function FeedbackList({ feedback, isLoading }: FeedbackListProps) {
  const dict = dictionary.team.feedback;

  if (isLoading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs">Memuat aspirasi dan evaluasi...</p>
        </div>
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground border border-dashed border-border/70 rounded-xl bg-card/40">
        <div className="flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-9 w-9 text-muted-foreground/40" />
          <p className="font-medium text-foreground">{dict.emptyTitle}</p>
          <p className="text-xs text-muted-foreground max-w-xs">{dict.emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {feedback.map((item) => {
        const isAnon = item.visibility === 'anonymous';

        return (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-border/70 bg-card/60 shadow-xs space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                {isAnon ? (
                  <Badge variant="secondary" className="text-xs font-normal gap-1 bg-muted">
                    <ShieldCheck size={12} className="text-muted-foreground" />
                    <span>{dict.anonymousBadge}</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs font-normal gap-1 text-primary border-primary/30">
                    <UserCheck size={12} />
                    <span>
                      {item.author?.fullName || item.author?.email || dict.namedBadge}
                    </span>
                  </Badge>
                )}

                {item.category && (
                  <Badge variant="outline" className="text-xs font-normal">
                    {item.category}
                  </Badge>
                )}
              </div>

              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={12} />
                <span>
                  {new Date(item.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <p className="text-sm text-foreground leading-relaxed">
              {item.message}
            </p>
          </div>
        );
      })}
    </div>
  );
}
