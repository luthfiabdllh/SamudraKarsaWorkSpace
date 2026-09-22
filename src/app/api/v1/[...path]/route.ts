import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';

/**
 * BFF Catch-All Proxy Handler untuk `/api/v1/*`.
 *
 * Meneruskan panggilan API dari client component ke NestJS Backend API secara aman:
 * - Menyuntikkan token dari cookie `access_token` ke header `Authorization: Bearer <token>`.
 * - Meneruskan header audit & integritas: `If-Match`, `Idempotency-Key`, `X-Request-Id`.
 * - Mengembalikan status & body asli (termasuk RFC 7807 problem+json).
 */
async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const targetPath = path.join('/');
  const search = request.nextUrl.search;
  const targetUrl = `${env.BACKEND_API_URL}/${targetPath}${search}`;

  const headers = new Headers();

  // Forward access token dari httpOnly cookie ke backend
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // Forward header integritas & audit
  const ifMatch = request.headers.get('if-match');
  if (ifMatch) headers.set('If-Match', ifMatch);

  const idempotencyKey = request.headers.get('idempotency-key');
  if (idempotencyKey) headers.set('Idempotency-Key', idempotencyKey);

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  const clientRequestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
  headers.set('X-Request-Id', clientRequestId);

  const method = request.method;
  let body: BodyInit | undefined = undefined;

  if (!['GET', 'HEAD'].includes(method)) {
    const blob = await request.blob();
    if (blob.size > 0) {
      body = blob;
    }
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: 'no-store',
    });

    const resContentType = backendRes.headers.get('content-type') ?? '';
    const resHeaders = new Headers();
    if (resContentType) resHeaders.set('Content-Type', resContentType);
    resHeaders.set('X-Request-Id', clientRequestId);

    const data = await backendRes.arrayBuffer();

    return new NextResponse(data, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: resHeaders,
    });
  } catch (error) {
    console.error(`[BFF Proxy Error] ${method} ${targetUrl}:`, error);
    return NextResponse.json(
      {
        type: 'https://samudrakarsa.org/errors/internal',
        title: 'Layanan Backend Tidak Dapat Dijangkau',
        status: 502,
        detail: 'Gagal menghubungi server backend. Pastikan server API berjalan.',
        instance: `/api/v1/${targetPath}`,
      },
      { status: 502, headers: { 'Content-Type': 'application/problem+json' } }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PATCH = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
