import React from 'react';
import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
import { FinanceView } from '@/features/finance';
import { getDictionary } from '@/lib/i18n';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary();
  return {
    title: `${dict.finance.title} | ${dict.common.appName}`,
    description: dict.finance.subtitle,
  };
}

export default async function FinancePage() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return <FinanceView userRoles={session.roles} />;
}
