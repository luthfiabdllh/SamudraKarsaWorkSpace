import 'server-only';
import { cookies } from 'next/headers';
import { env } from '@/env';
import type { User } from '../types';

/**
 * Mengambil data pengguna aktif dari backend di Server Components.
 * Menggunakan native fetch dengan Authorization header dari cookie.
 */
export async function getCurrentUserServer(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${env.BACKEND_API_URL}/auth/session`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = (await response.json()) as User;
    return data;
  } catch {
    return null;
  }
}
