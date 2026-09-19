import { redirect } from 'next/navigation';

/**
 * Root page — redirects to the default locale (English).
 * proxy.ts will then handle auth protection.
 */
export default function RootPage() {
  redirect('/en');
}
