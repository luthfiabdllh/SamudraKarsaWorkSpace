import { redirect } from 'next/navigation';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Home page — redirects to the dashboard.
 * The proxy.ts thin check will redirect to /login if not authenticated.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  redirect(`/${lang}/dashboard`);
}
