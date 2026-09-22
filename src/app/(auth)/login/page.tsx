import React from 'react';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { LoginForm } from '@/features/auth/components/login-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Anchor } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.auth.login.title,
    description: dict.auth.login.subtitle,
  };
}

export default async function LoginPage() {
  const dict = await getDictionary();

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-muted/30 to-background p-4 relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo & Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-4 ring-primary/10">
            <Anchor className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {dict.common.appName}
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {dict.auth.login.subtitle}
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/60 shadow-xl backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-semibold">
              {dict.auth.login.title}
            </CardTitle>
            <CardDescription>
              Gunakan email organisasi yang telah terdaftar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm dict={dict.auth.login} />
          </CardContent>
        </Card>

        {/* Footer Help */}
        <p className="text-center text-xs text-muted-foreground px-4">
          {dict.auth.login.footerHelp}
        </p>
      </div>
    </main>
  );
}
