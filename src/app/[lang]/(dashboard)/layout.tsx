import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/verify-session';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

/**
 * Dashboard Layout — AUTHORITATIVE auth check.
 *
 * This is the second layer of the two-layer auth pattern:
 * 1. proxy.ts: thin check — only verifies cookie existence
 * 2. THIS layout: cryptographic JWT verification via jose
 *
 * Even if proxy.ts is bypassed (e.g., misconfig), this check catches it.
 * verifySession() validates: signature, algorithm, expiry.
 */
export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { lang } = await params;
  const session = await verifySession();

  if (!session) {
    redirect(`/${lang}/login`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Layout shell — sidebar and header are in child pages/components */}
      {children}
    </div>
  );
}
