import React from 'react';
import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
import { LetterView } from '@/features/letters';
import { getDictionary } from '@/lib/i18n';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary();
  return {
    title: `${dict.letters.title} | ${dict.common.appName}`,
    description: dict.letters.subtitle,
  };
}

export default async function LettersPage() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return <LetterView />;
}
