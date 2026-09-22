import React from 'react';
import Link from 'next/link';
import { Anchor, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-background via-muted/30 to-background p-4 text-center">
      <div className="w-full max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Anchor className="h-8 w-8" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="text-6xl font-black tracking-tight text-primary">404</span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Halaman yang Anda cari tidak tersedia, telah dipindahkan, atau Anda tidak memiliki akses ke alamat ini.
          </p>
        </div>

        <div>
          <Button asChild className="gap-2">
            <Link href="/dashboard" aria-label="Kembali ke Beranda">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
