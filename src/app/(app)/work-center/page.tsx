import React from 'react';
import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
import { WorkCenterView } from '@/features/work-center';
import { getDictionary } from '@/lib/i18n';

import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary();
  return {
    title: `${dict.workCenter.title} | ${dict.common.appName}`,
    description: dict.workCenter.subtitle,
  };
}

export default async function WorkCenterPage() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return <WorkCenterView currentUserId={session.id} />;
}
