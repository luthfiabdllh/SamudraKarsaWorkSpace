import React from 'react';
import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
import { CalendarView } from '@/features/calendar';
import { getDictionary } from '@/lib/i18n';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary();
  return {
    title: `${dict.calendar.title} | ${dict.common.appName}`,
    description: dict.calendar.subtitle,
  };
}

export default async function CalendarPage() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return <CalendarView />;
}
