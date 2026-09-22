import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/env';

/**
 * POST /api/auth/logout
 *
 * BFF Proxy Route Handler:
 * 1. Mengirim permintaan pencabutan sesi ke backend NestJS (/api/v1/auth/logout).
 * 2. Menghapus cookie 'access_token' dan 'sk_refresh'.
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken =
    cookieStore.get('sk_refresh')?.value ?? cookieStore.get('refresh_token')?.value;

  if (accessToken) {
    try {
      await fetch(`${env.BACKEND_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          ...(refreshToken ? { Cookie: `sk_refresh=${refreshToken}` } : {}),
          'User-Agent': request.headers.get('user-agent') ?? 'SamudraKarsa-BFF',
          'X-Forwarded-For': request.headers.get('x-forwarded-for') ?? '127.0.0.1',
        },
      });
    } catch {
      // Abaikan error jaringan saat logout agar cookie lokal tetap bersih
    }
  }

  // Hapus access token cookie
  cookieStore.set('access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  // Hapus refresh token cookie
  cookieStore.set('sk_refresh', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/refresh',
    maxAge: 0,
  });

  cookieStore.set('refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/refresh',
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}
