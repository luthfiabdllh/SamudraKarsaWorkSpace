import React from 'react';
import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
import { TeamView } from '@/features/team';
import { getDictionary } from '@/lib/i18n';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary();
  return {
    title: `${dict.team.title} | ${dict.common.appName}`,
    description: dict.team.subtitle,
  };
}

export default async function TeamPage() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return <TeamView />;
}
