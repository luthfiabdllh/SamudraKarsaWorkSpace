import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/verify-session';
import { AdminView } from '@/features/admin';
import { id as dictionary } from '@/lib/dictionaries/id';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${dictionary.admin.title} | ${dictionary.common.appName}`,
    description: dictionary.admin.subtitle,
  };
}

export default async function AdminPage() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return <AdminView userRoles={session.roles} />;
}
