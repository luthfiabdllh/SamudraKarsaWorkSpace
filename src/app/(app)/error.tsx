'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { id as dictionary } from '@/lib/dictionaries/id';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring if needed
    console.error('App ErrorBoundary caught error:', error);
  }, [error]);

  const dict = dictionary.errors.serverError;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 max-w-md shadow-xs space-y-4">
        <div className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-foreground">
            {dict.title}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {error.message || dict.description}
          </p>
        </div>

        {error.digest && (
          <div className="rounded-md bg-muted/60 p-2 font-mono text-[10px] text-muted-foreground break-all select-all">
            <span className="font-semibold">Kode Pelacakan (Digest):</span>{' '}
            {error.digest}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={reset}
            className="gap-1.5 text-xs font-semibold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{dict.retry}</span>
          </Button>

          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
            <Link href="/dashboard">
              <Home className="h-3.5 w-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
