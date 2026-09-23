import React from 'react';
import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
import { DivisionsView } from '@/features/divisions';
import { getDictionary } from '@/lib/i18n';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary();
  return {
    title: `${dict.divisions.title} | ${dict.common.appName}`,
    description: dict.divisions.subtitle,
  };
}

export default async function DivisionsPage() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return <DivisionsView />;
}
