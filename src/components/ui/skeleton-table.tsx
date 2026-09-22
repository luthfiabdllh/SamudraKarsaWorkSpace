import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 5,
  className,
}: SkeletonTableProps) {
  return (
    <div
      className={cn(
        'w-full rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs animate-pulse',
        className
      )}
      aria-busy="true"
      aria-label="Memuat data tabel..."
    >
      {/* Skeleton Header */}
      <div className="flex border-b border-border/70 bg-muted/60 px-4 py-3 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`sh-${i}`}
            className="h-3.5 bg-muted-foreground/15 rounded-md"
            style={{ width: `${Math.max(40, 100 / columns)}%` }}
          />
        ))}
      </div>

      {/* Skeleton Rows */}
      <div className="divide-y divide-border/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`sr-${r}`} className="flex items-center px-4 py-3.5 gap-4">
            {Array.from({ length: columns }).map((_, c) => (
              <div
                key={`sc-${r}-${c}`}
                className="h-3 bg-muted-foreground/10 rounded-sm"
                style={{
                  width: `${c === 0 ? 30 : Math.max(30, 80 / columns)}%`,
                  opacity: 1 - r * 0.12,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
