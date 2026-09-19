import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';
import { getDictionary, isValidLocale, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'id' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isId = lang === 'id';
  return {
    title: isId ? 'Template Enterprise Next.js' : 'Enterprise Next.js Template',
    description: isId
      ? 'Template Next.js enterprise-grade yang modular dan skalabel.'
      : 'A scalable, modular, enterprise-grade Next.js 16 template.',
  };
}

/**
 * Language layout — wraps all pages with providers.
 * Sets the html lang attribute for the correct locale.
 */
export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  // Pre-load the dictionary — passed to child Server Components via props
  await getDictionary(lang as Locale);

  return (
    <QueryProvider>
      {children}
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}
