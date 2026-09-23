import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { env } from '@/env';

export interface SessionUser {
  readonly id: string;
  readonly email: string;
  readonly fullName: string | null;
  readonly roles: readonly string[];
  readonly divisionCodes: readonly string[];
  readonly divisionId?: string | null;
  readonly mustChangePassword: boolean;
  readonly mustChangePasswordExempt: readonly string[];
}

/**
 * Melakukan verifikasi sesi otoritatif langsung ke Backend NestJS (/api/v1/auth/session).
 *
 * Menerapkan prinsip Zero-Trust Security:
 * - Frontend Next.js tidak menandatangani atau memverifikasi kunci rahasia token sendiri.
 * - Menggunakan token dari cookie httpOnly 'access_token'.
 * - Hasil di-cache menggunakan React cache() per siklus rendering RSC (deduplikasi otomatis).
 *
 * Mengembalikan data sesi pengguna jika valid, atau null jika tidak valid / kedaluwarsa.
 */
export const verifySession = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${env.BACKEND_API_URL}/auth/session`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as SessionUser;
    return data;
  } catch {
    return null;
  }
});
