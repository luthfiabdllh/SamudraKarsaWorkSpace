import React from 'react';
import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
import { MeetingView } from '@/features/meetings';
import { getDictionary } from '@/lib/i18n';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary();
  return {
    title: `${dict.meetings.title} | ${dict.common.appName}`,
    description: dict.meetings.subtitle,
  };
}

export default async function MeetingsPage() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return <MeetingView />;
}
