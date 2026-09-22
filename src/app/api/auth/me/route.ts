import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/env';

/**
 * GET /api/auth/me
 *
 * BFF Proxy Route Handler:
 * Mengambil informasi sesi dan profil pengguna aktif dari backend NestJS (/api/v1/auth/session).
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: 401, message: 'Tidak ada sesi aktif.' } },
      { status: 401 }
    );
  }

  try {
    const backendResponse = await fetch(`${env.BACKEND_API_URL}/auth/session`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, error: { code: backendResponse.status, message: 'Sesi tidak sah.' } },
        { status: backendResponse.status }
      );
    }

    const actor = await backendResponse.json();
    return NextResponse.json({
      success: true,
      data: actor,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 500, message: 'Gagal mengambil data profil.' } },
      { status: 500 }
    );
  }
}
