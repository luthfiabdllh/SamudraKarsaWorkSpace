import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/env';
import { changePasswordSchema } from '@/features/auth/types';

/**
 * POST /api/auth/change-password
 *
 * BFF Proxy Route Handler:
 * 1. Menerima password lama dan baru.
 * 2. Meneruskan ke backend NestJS (/api/v1/auth/change-password) dengan access_token.
 * 3. Backend mencabut seluruh sesi token (204 No Content).
 * 4. BFF membersihkan cookie sesi agar pengguna masuk kembali secara bersih.
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: { code: 401, message: 'Sesi tidak ditemukan. Silakan masuk kembali.' } },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 400, message: 'Format data permintaan tidak valid.' } },
      { status: 400 }
    );
  }

  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 422,
          message: 'Validasi gagal.',
          issues: parsed.error.issues,
        },
      },
      { status: 422 }
    );
  }

  try {
    const backendResponse = await fetch(`${env.BACKEND_API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') ?? 'SamudraKarsa-BFF',
        'X-Forwarded-For': request.headers.get('x-forwarded-for') ?? '127.0.0.1',
      },
      body: JSON.stringify({
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      }),
    });

    if (!backendResponse.ok) {
      const errorJson = await backendResponse.json().catch(() => null);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: backendResponse.status,
            message: errorJson?.title || errorJson?.message || 'Gagal memperbarui kata sandi.',
          },
        },
        { status: backendResponse.status }
      );
    }

    // Backend mencabut seluruh sesi (204 No Content). Bersihkan cookie lokal.
    cookieStore.set('access_token', '', { maxAge: 0, path: '/' });
    cookieStore.set('sk_refresh', '', { maxAge: 0, path: '/api/auth/refresh' });
    cookieStore.set('refresh_token', '', { maxAge: 0, path: '/api/auth/refresh' });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 500, message: 'Terjadi kendala saat menghubungi server.' } },
      { status: 500 }
    );
  }
}
