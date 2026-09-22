import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/env';

/**
 * POST /api/auth/refresh
 *
 * BFF Proxy Route Handler:
 * 1. Membaca cookie httpOnly 'sk_refresh'.
 * 2. Meneruskan penyegaran ke backend NestJS (/api/v1/auth/refresh) via header Cookie.
 * 3. Memperbarui cookie 'access_token' dan 'sk_refresh' (rotasi token).
 * 4. Jika sesi telah kedaluwarsa atau dicabut, membersihkan seluruh cookie.
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken =
    cookieStore.get('sk_refresh')?.value ?? cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, error: { code: 401, message: 'Tidak ada token penyegar yang tersedia.' } },
      { status: 401 }
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const backendResponse = await fetch(`${env.BACKEND_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `sk_refresh=${refreshToken}`,
        'User-Agent': request.headers.get('user-agent') ?? 'SamudraKarsa-BFF',
        'X-Forwarded-For': request.headers.get('x-forwarded-for') ?? '127.0.0.1',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!backendResponse.ok) {
      // Refresh token kedaluwarsa, tidak valid, atau pemakaian ulang terdeteksi
      cookieStore.set('access_token', '', { maxAge: 0, path: '/' });
      cookieStore.set('sk_refresh', '', { maxAge: 0, path: '/api/auth/refresh' });
      cookieStore.set('refresh_token', '', { maxAge: 0, path: '/api/auth/refresh' });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 401,
            message: 'Sesi telah berakhir atau tidak valid. Silakan masuk kembali.',
          },
        },
        { status: 401 }
      );
    }

    const data = await backendResponse.json();

    // Perbarui access token
    cookieStore.set('access_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: data.expiresIn ?? 900,
    });

    // Perbarui refresh token jika ada rotasi baru
    if (data.refreshToken) {
      cookieStore.set('sk_refresh', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: { code: 504, message: 'Waktu penyegaran sesi habis.' } },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: 500, message: 'Kendala internal penyegaran sesi.' } },
      { status: 500 }
    );
  }
}
