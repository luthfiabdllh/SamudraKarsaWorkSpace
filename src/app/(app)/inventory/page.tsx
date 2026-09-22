import React from 'react';
import type { Metadata } from 'next';
import { verifySession } from '@/lib/verify-session';
import { InventoryView } from '@/features/inventory';
import { getDictionary } from '@/lib/i18n';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary();
  return {
    title: `${dict.inventory.title} | ${dict.common.appName}`,
    description: dict.inventory.subtitle,
  };
}

export default async function InventoryPage() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return <InventoryView />;
}
