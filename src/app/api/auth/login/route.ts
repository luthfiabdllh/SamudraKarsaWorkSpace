import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/env';
import { loginSchema } from '@/features/auth/types';

/**
 * POST /api/auth/login
 *
 * BFF Proxy Route Handler:
 * 1. Menerima kredensial email & password dari antarmuka.
 * 2. Meneruskan ke backend NestJS (/api/v1/auth/login).
 * 3. Menyimpan accessToken ke cookie httpOnly 'access_token' (root path).
 * 4. Menyimpan refreshToken ke cookie httpOnly 'sk_refresh' (terbatas ke /api/auth/refresh).
 * 5. Mengembalikan data profil (tanpa token) ke browser.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 400, message: 'Format data permintaan tidak valid.' } },
      { status: 400 }
    );
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 422,
          message: 'Validasi gagal. Periksa kembali email dan kata sandi Anda.',
          issues: parsed.error.issues,
        },
      },
      { status: 422 }
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const backendResponse = await fetch(`${env.BACKEND_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') ?? 'SamudraKarsa-BFF',
        'X-Forwarded-For': request.headers.get('x-forwarded-for') ?? '127.0.0.1',
      },
      body: JSON.stringify(parsed.data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!backendResponse.ok) {
      const errorJson = await backendResponse.json().catch(() => null);
      const message =
        errorJson?.title ||
        errorJson?.message ||
        'Kredensial tidak sah, atau akun ini tidak aktif. Hubungi pemilik organisasi.';

      return NextResponse.json(
        { success: false, error: { code: backendResponse.status, message } },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    const cookieStore = await cookies();

    // Simpan access token di cookie httpOnly
    cookieStore.set('access_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: data.expiresIn ?? 900,
    });

    // Simpan refresh token di cookie httpOnly terbatas ke endpoint refresh
    if (data.refreshToken) {
      cookieStore.set('sk_refresh', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60, // 7 hari
      });
    }

    return NextResponse.json({
      success: true,
      data: { user: data.actor },
    });
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: { code: 504, message: 'Waktu permintaan ke layanan backend habis.' } },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: 500, message: 'Terjadi kendala internal pada server.' } },
      { status: 500 }
    );
  }
}
