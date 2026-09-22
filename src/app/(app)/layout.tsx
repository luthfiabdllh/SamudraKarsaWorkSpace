import React from 'react';
import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/verify-session';
import { getDictionary } from '@/lib/i18n';
import { DashboardSidebar } from '@/components/layouts/dashboard-sidebar';
import { DashboardHeader } from '@/components/layouts/dashboard-header';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * App Layout — Lapis 2 Verifikasi Sesi Otoritatif.
 *
 * 1. Memanggil verifySession() yang meminta /api/v1/auth/session ke Backend.
 * 2. Mengalihkan ke /login jika cookie tidak valid atau sesi berakhir.
 * 3. Mengalihkan ke /change-password jika mustChangePassword bernilai true.
 * 4. Menyajikan struktur App Shell (Sidebar 5 Hubs + Header + Content Area).
 */
export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  if (session.mustChangePassword) {
    redirect('/change-password');
  }

  const dict = await getDictionary();

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
      {/* Sidebar Navigasi Harian & Modul */}
      <DashboardSidebar dict={dict.navigation} userRoles={session.roles} />

      {/* Konten Utama */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <DashboardHeader user={session} logoutLabel={dict.auth.logout.button} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
