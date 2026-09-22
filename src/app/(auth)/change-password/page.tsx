import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { verifySession } from '@/lib/verify-session';
import { ChangePasswordForm } from '@/features/auth/components/change-password-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { KeyRound } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.auth.changePassword.title,
    description: dict.auth.changePassword.subtitle,
  };
}

export default async function ChangePasswordPage() {
  const dict = await getDictionary();
  const session = await verifySession();

  // Jika tidak punya sesi sama sekali, kembalikan ke /login
  if (!session) {
    redirect('/login');
  }

  // Jika sudah tidak perlu ganti password, kembalikan ke /dashboard
  if (!session.mustChangePassword) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-muted/30 to-background p-4 relative overflow-hidden">
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-4 ring-amber-500/10">
            <KeyRound className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {dict.auth.changePassword.title}
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {dict.auth.changePassword.subtitle}
          </p>
        </div>

        <Card className="border-border/60 shadow-xl backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-semibold">
              Perbarui Kata Sandi Akun
            </CardTitle>
            <CardDescription>
              Akun: <span className="font-medium text-foreground">{session.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm dict={dict.auth.changePassword} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
