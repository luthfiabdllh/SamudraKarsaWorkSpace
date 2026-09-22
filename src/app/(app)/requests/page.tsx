import React from 'react';
import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
import { RequestView } from '@/features/requests';
import { getDictionary } from '@/lib/i18n';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary();
  return {
    title: `${dict.requests.title} | ${dict.common.appName}`,
    description: dict.requests.subtitle,
  };
}

export default async function RequestsPage() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return <RequestView />;
}
