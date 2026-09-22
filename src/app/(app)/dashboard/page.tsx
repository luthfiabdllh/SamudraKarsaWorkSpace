import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import { verifySession } from '@/lib/verify-session';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckSquare,
  FileSpreadsheet,
  Calendar,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Inbox,
} from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.navigation.beranda,
    description: dict.dashboard.subtitle,
  };
}

export default async function DashboardPage() {
  const [dict, session] = await Promise.all([
    getDictionary(),
    verifySession(),
  ]);

  const userName = session?.fullName || session?.email.split('@')[0] || 'Anggota';

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                WorkSpace v2.0
              </span>
              <span className="text-xs text-muted-foreground">{todayFormatted}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {dict.dashboard.welcome.replace('{name}', userName)}
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              {dict.dashboard.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2 sm:pt-0">
            <Button asChild size="sm" className="gap-2 shadow-sm">
              <Link href="/work-center">
                <CheckSquare className="h-4 w-4" />
                <span>Work Center</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2 bg-card/60">
              <Link href="/requests">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Buat Pengajuan</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/70 shadow-sm hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Pekerjaan Aktif PIC
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CheckSquare className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span>3 pekerjaan prioritas tinggi</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Menunggu Telaah
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pengajuan & surat masuk
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Agenda Hari Ini
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">
              Rapat koordinasi mingguan
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Pekerjaan Tanpa PIC
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Inbox className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">
              Siap diklaim oleh anggota
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections: Quick Hub Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Hub Work Center Card */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">
                  Pusat Kerja (Work Center)
                </CardTitle>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
                <Link href="/work-center">
                  Buka Papan
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <CardDescription>
              Pantau tiket pekerjaan aktif dengan tampilan Kanban Board dan Tabel Data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground bg-muted/20">
              Pekerjaan aktif divisi Anda akan disinkronkan secara langsung di Work Center.
            </div>
          </CardContent>
        </Card>

        {/* Hub Permintaan & Pengajuan */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">
                  Pengajuan & Permintaan
                </CardTitle>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
                <Link href="/requests">
                  Lihat Semua
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <CardDescription>
              Lacak status persetujuan FSM pengajuan dana, logistik, dan surat keluar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground bg-muted/20">
              Tidak ada pengajuan yang membutuhkan persetujuan mendesak saat ini.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
