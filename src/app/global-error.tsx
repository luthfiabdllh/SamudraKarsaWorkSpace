'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground antialiased font-sans">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 max-w-md shadow-xs space-y-4 text-center">
          <div className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-bold">
              Terjadi Kendala Sistem Serius
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Aplikasi mengalami kegagalan proses tak terduga. Silakan muat ulang halaman.
            </p>
          </div>

          {error.digest && (
            <div className="rounded-md bg-muted/60 p-2 font-mono text-[10px] text-muted-foreground break-all select-all">
              Kode Error: {error.digest}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={reset}
              className="gap-1.5 text-xs font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Muat Ulang Halaman</span>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
