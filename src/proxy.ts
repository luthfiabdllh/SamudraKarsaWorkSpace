import { type NextRequest, NextResponse } from 'next/server';

/**
 * Thin Proxy — Next.js 16 App Router Convention.
 *
 * ATURAN ARSITEKTUR ZERO-TRUST (PRD-FRONTEND & PRD-REVAMP):
 * 1. Fungsi proxy ini HANYA melakukan pemeriksaan cepat (thin check) keberadaan cookie
 *    dan validasi CSRF header (Origin/Referer).
 * 2. Proxy TIDAK melakukan verifikasi kriptografis token.
 * 3. Verifikasi token otoritatif dilakukan di Server Component Layout `(app)/layout.tsx`
 *    melalui `verifySession()` yang memanggil `/api/v1/auth/session` ke Backend NestJS.
 */

const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ?? 'http://localhost:3001,http://localhost:3000'
)
  .split(',')
  .map((o) => o.trim());

// Rute publik yang boleh diakses tanpa token
const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/refresh', '/api/auth/google'];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('access_token')?.value;

  // ─── 1. Proteksi CSRF (Mutasi State) ──────────────────────────────────────
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');

    if (origin) {
      const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);
      const isSameHost = host ? origin.endsWith(host) : false;

      if (!isAllowedOrigin && !isSameHost) {
        return NextResponse.json(
          { success: false, error: { code: 403, message: 'Origin tidak diizinkan (CSRF Guard).' } },
          { status: 403 }
        );
      }
    }
  }

  // ─── 2. Pengalihan Rute Root (/) ──────────────────────────────────────────
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // ─── 3. Pengalihan Halaman Masuk jika sudah memiliki Sesi ─────────────────
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // ─── 4. Pemeriksaan Tipis Rute Terproteksi ────────────────────────────────
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isApiRoute = pathname.startsWith('/api/');

  if (!isPublic && !isApiRoute) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      // Simpan rute kembali (redirect back) jika diperlukan
      if (pathname !== '/dashboard') {
        loginUrl.searchParams.set('from', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Matcher Next.js mengecualikan:
     * - _next/static (aset statis)
     * - _next/image (optimasi gambar)
     * - favicon.ico, sitemap.xml, robots.txt
     * - berkas media publik (.svg, .png, .jpg, dll.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
