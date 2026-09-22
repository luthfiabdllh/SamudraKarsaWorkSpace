import React from 'react';
import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
import { PartnerView } from '@/features/partners';
import { getDictionary } from '@/lib/i18n';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary();
  return {
    title: `${dict.partners.title} | ${dict.common.appName}`,
    description: dict.partners.subtitle,
  };
}

export default async function PartnersPage() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return <PartnerView />;
}
