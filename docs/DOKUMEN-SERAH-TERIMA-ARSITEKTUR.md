# Dokumen Serah Terima Arsitektur Frontend
## Samudra Karsa WorkSpace v2.0

Dokumen ini merupakan referensi teknis arsitektur, pola implementasi, standar keamanan, dan panduan pemeliharaan kode untuk tim pengembang yang melanjutkan pengembangan frontend **Samudra Karsa WorkSpace**.

---

## 1. Spesifikasi Tumpukan Teknologi (Tech Stack)

| Lapisan / Komponen | Teknologi | Versi | Catatan Khusus |
| :--- | :--- | :--- | :--- |
| **Framework Inti** | Next.js (App Router) | `16.2.12` | Kompilasi Turbopack aktif, Server & Client Components |
| **Pustaka UI** | React & React DOM | `19.2.4` | Fitur React 19, JSX compiler modern, hooks terbaru |
| **Styling & Token** | Tailwind CSS & TW-Animate | `v4` | Variabel CSS dinamis (`oklch`), skema warna dark/light |
| **Primitif UI** | Radix UI (`radix-ui`) | `1.6.7` | Dialog, Drawer, Dropdown, Tabs, Avatar yang aksesibel |
| **Validasi Skema** | Zod | `4.0.0` | Validasi tipe aman di form dan kontrak API |
| **Manajemen Form** | React Hook Form | `7.54.2` | Resolver `@hookform/resolvers/zod` tanpa re-render berlebih |
| **State Asinkron** | TanStack React Query | `5.101.4` | Manajemen cache, query keys factory, polling 30 detik |
| **State UI Klien** | Zustand | `5.0.5` | Persistensi tema lokal; sidebar state transien |
| **Ikonografi** | Lucide React | `0.525.0` | Ikon SVG teroptimasi dengan `aria-hidden="true"` |
| **Notifikasi Toast** | Sonner | `2.0.6` | Sistem toast modern di pojok kanan atas |
| **Pengujian Unit** | Vitest & V8 Coverage | `3.2.4` | 137 tests unit, 99.83% statement coverage |
| **Pengujian E2E** | Playwright | `1.53.2` | Pengujian alur otentikasi, proteksi rute, dan responsivitas |

---

## 2. Prinsip Arsitektur Zero-Trust & Alur Keamanan

Sistem frontend dirancang dengan model **Zero-Trust** tanpa kompromi keamanan di sisi browser:

```
[Browser Klien]
       │
       ▼ (Permintaan HTTP dengan Cookie httpOnly)
[Next.js 16 Proxy: src/proxy.ts]
       │  ├─ 1. Pemeriksaan Header CSRF (Origin / Referer)
       │  ├─ 2. Pemeriksaan Keberadaan Cookie (Thin Check)
       │  └─ 3. Pengalihan Pengguna Anonim ke /login
       ▼
[Next.js Server Component Layout: (app)/layout.tsx]
       │
       ▼ Lapis 2 Otoritatif: verifySession()
[Backend NestJS API: GET /api/v1/auth/session]
       │  ├─ Validasi Kriptografis Token JWT
       │  └─ Mengembalikan Data Sesi Aktor (Peran & Divisi)
       ▼
[Render Antarmuka Sesuai Hak Akses Pengguna]
```

### Aturan Keamanan Mutlak:
1. **Tidak Ada Token di Memori Klien**:
   - `access_token` dan `refresh_token` disimpan secara eksklusif dalam cookie bertanda `httpOnly`, `secure`, dan `sameSite=lax`.
   - JavaScript di sisi klien (`window`, `localStorage`, `sessionStorage`, TanStack store, Zustand) sama sekali tidak memiliki akses baca ke string token JWT.
2. **Gateway Catch-All BFF (`/api/v1/[...path]`)**:
   - Seluruh pemanggilan API dari klien diarahkan ke URL lokal `/api/v1/...`.
   - Route Handler Next.js membaca cookie `access_token` dan menyematkannya ke header `Authorization: Bearer <token>` saat meneruskan permintaan ke Backend NestJS (`http://localhost:3000/api/v1/...`).
   - Meneruskan header penting: `If-Match` (optimistic locking), `Idempotency-Key` (pencegahan eksekusi ganda), dan `X-Request-Id` (pelacakan log).
   - Menangkap respons kegagalan dalam format standar RFC 7807 `application/problem+json` dan meneruskannya secara utuh.

---

## 3. Struktur Direktori Proyek

```
src/
├── app/                          # Next.js 16 App Router
│   ├── (app)/                    # Area Aplikasi Terautentikasi
│   │   ├── layout.tsx            # Lapis 2 Auth (verifySession) & App Shell
│   │   ├── error.tsx             # Error Boundary RFC 7807 untuk Area App
│   │   ├── dashboard/            # Beranda Utama
│   │   ├── work-center/          # Work Center & Kanban
│   │   ├── requests/             # Pengajuan Operasional Lintas Divisi
│   │   ├── divisions/            # Profil & Direktori Divisi
│   │   ├── team/                 # Ruang Tim & Kotak Aspirasi
│   │   ├── finance/              # Modul Keuangan & Kas
│   │   ├── letters/              # Modul Persuratan & Arsip
│   │   ├── partners/             # Kemitraan & Sponsorship
│   │   ├── inventory/            # Logistik, Posko & Manifes
│   │   ├── meetings/             # Rapat, Presensi & Notulensi
│   │   ├── calendar/             # Kalender Kegiatan & RSVP
│   │   └── admin/                # Back-Office Admin & Recycle Bin
│   ├── (auth)/                   # Area Masuk & Pemulihan
│   │   ├── login/                # Halaman Masuk
│   │   └── change-password/      # Formulir Wajib Ganti Kata Sandi
│   ├── api/                      # Route Handlers BFF
│   │   ├── auth/                 # Auth BFF (login, logout, refresh, me)
│   │   └── v1/[...path]/         # Gateway Catch-All Forwarding
│   ├── error.tsx                 # Error Boundary Root
│   ├── global-error.tsx          # Global Error Boundary Level Dokumen
│   ├── not-found.tsx             # Halaman 404 Kustom Bahasa Indonesia
│   ├── layout.tsx                # Root HTML, Inter Font, Theme Provider
│   └── page.tsx                  # Root Redirector (ke /dashboard atau /login)
├── components/                   # Komponen Bersama (Shared UI)
│   ├── ui/                       # Shadcn UI (button, card, dialog, drawer, dll.)
│   ├── layouts/                  # App Shell (dashboard-header, dashboard-sidebar)
│   └── theme-toggle.tsx          # Switch Mode Gelap / Terang
├── features/                     # Arsitektur Modular Berbasis Fitur
│   ├── auth/                     # Fitur Autentikasi
│   ├── work-center/              # Fitur Work Center
│   ├── requests/                 # Fitur Pengajuan
│   ├── finance/                  # Fitur Keuangan
│   ├── letters/                  # Fitur Persuratan
│   ├── partners/                 # Fitur Kemitraan
│   ├── inventory/                # Fitur Inventaris & Logistik
│   ├── meetings/                 # Fitur Rapat & Notulensi
│   ├── calendar/                 # Fitur Kalender
│   ├── team/                     # Fitur Tim & Anggota
│   ├── admin/                    # Fitur Administrasi & Recycle Bin
│   └── notifications/            # Fitur Polling Notifikasi Navbar
├── lib/                          # Pustaka Bantuan
│   ├── dictionaries/             # Kamus Bahasa Indonesia (id.ts)
│   ├── i18n.ts                   # Pengambil Kamus Tunggal
│   ├── verify-session.ts         # Server-Side Session Verifier
│   └── utils.ts                  # cn() Tailwind Merge
├── proxy.ts                      # Next.js 16 Thin Proxy (Middleware)
└── store/                        # State Klien Transien (ui.store.ts)
```

---

## 4. Pola State Management & Query Keys

Setiap fitur memiliki modul `api/query-keys.ts` yang terstandarisasi untuk mencegah bentrok cache dan mempermudah pembersihan cache (*invalidation*):

Contoh pola query keys:
```ts
export const requestQueryKeys = {
  all: ['requests'] as const,
  lists: () => [...requestQueryKeys.all, 'list'] as const,
  list: (params: RequestFilterParams) => [...requestQueryKeys.lists(), params] as const,
  details: () => [...requestQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...requestQueryKeys.details(), id] as const,
};
```

Setelah mutasi berhasil:
```ts
queryClient.invalidateQueries({ queryKey: requestQueryKeys.all });
```

---

## 5. Standar Penanganan FSM & Optimistic Concurrency Control (OCC)

1. **Header `If-Match`**:
   - Setiap mutasi pada entitas yang memiliki versi (`WorkItem`, `Request`, `Letter`, dll.) menyertakan header `If-Match: "<version>"`.
2. **Respons 409 Conflict**:
   - Jika backend mendeteksi versi telah berubah, gateway BFF meneruskan error 409 Conflict.
   - Antarmuka menampilkan dialog resolusi konflik (`SyncConflictDialog` atau `ResolveSyncConflictDialog`) yang memungkinkan pengguna melihat perubahan terbaru sebelum menimpa.
3. **Pencegahan Double-Submit (`Idempotency-Key`)**:
   - Aksi sensitif (pembuatan pekerjaan, mutasi kas, hapus permanen recycle bin) otomatis menyertakan header `Idempotency-Key: crypto.randomUUID()`.

---

## 6. Prosedur Uji Mutu & Kesiapan Rilis

Sebelum melakukan rilis atau penggabungan ke cabang produksi (`main`), seluruh pengecekan berikut wajib bernilai lulus:

```bash
# 1. Pengecekan Tipe TypeScript (0 error)
npm run typecheck

# 2. Pengecekan Linting ESLint (0 error, 0 warning)
npm run lint

# 3. Pengujian Unit & Cakupan Kode (>80% coverage)
npm run test:unit

# 4. Pengujian End-to-End Playwright (100% lulus)
npx playwright test --project=chromium

# 5. Kompilasi Produksi Turbopack (22/22 rute berhasil)
npm run build
```

---

## 7. Variabel Lingkungan (.env.local)

```env
# URL Backend NestJS (Internal Network / Docker Network)
BACKEND_API_URL=http://localhost:3000

# URL Asal yang Diizinkan untuk Proteksi CSRF
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000

# Pengaturan Lingkungan
NODE_ENV=production
```
