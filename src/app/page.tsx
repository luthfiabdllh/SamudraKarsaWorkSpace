import { redirect } from 'next/navigation';

/**
 * Halaman utama root — mengarahkan langsung ke /dashboard.
 * src/proxy.ts akan memeriksa sesi aktif:
 * - Jika ada sesi valid: menuju ke /dashboard
 * - Jika belum masuk: dialihkan ke /login
 */
export default function RootPage() {
  redirect('/dashboard');
}
