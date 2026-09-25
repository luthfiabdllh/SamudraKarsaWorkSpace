import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { verifySession } from '@/lib/verify-session';
import { DashboardView } from '@/features/dashboard';

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary();
  return {
    title: `${dict.dashboard.title} | ${dict.common.appName}`,
    description: dict.dashboard.subtitle,
  };
}

export default async function DashboardPage() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return <DashboardView currentUser={session} />;
}
