# Samudra Karsa WorkSpace v2.0

Platform terpadu kolaborasi, manajemen operasional, pengajuan alur kerja FSM, keuangan, persuratan, inventaris posko, kemitraan, rapat koordinasi, kalender kegiatan, dan back-office administrasi organisasi **Samudra Karsa**.

Dibangun menggunakan standar rekayasa perangkat lunak modern: **Next.js 16 (Turbopack, Server Components, App Router)**, **React 19**, **Tailwind CSS v4**, **TanStack React Query v5**, **Radix UI**, **Zod v4**, dan arsitektur keamanan **Zero-Trust Backend-for-Frontend (BFF)**. Seluruh antarmuka disajikan dalam **100% Bahasa Indonesia** dengan rute navigasi terstandarisasi.

---

## 🚀 Fitur Utama & Modul Sistem

### 1. Pusat Kerja Harian (Daily Hubs)
- **Beranda (`/dashboard`)**: Metrik ringkasan organisasi, alur persetujuan aktif, tugas prioritas, dan notifikasi terkini.
- **Work Center (`/work-center`)**: Papan Kanban responsif 5 kolom status, tampilan tabel data, filter cepat pekerjaan tanpa penanggung jawab (`?withoutPic=true`), klaim PIC instan, dan dialog penanganan *Optimistic Locking* (409 Conflict).
- **Pengajuan Operasional & FSM Approval Center (`/requests`)**: Penanganan 14 jenis pengajuan operasional lintas divisi, 9 status alur kerja FSM, penanda konflik sinkronisasi dua arah dengan Work Center, dan dialog transisi status bersyarat.
- **Direktori Divisi (`/divisions`)**: Struktur organisasi, profil divisi kerja, dan daftar tanggung jawab.
- **Ruang Tim & Aspirasi Anggota (`/team`)**: Papan pengumuman resmi tersemat, kotak aspirasi dan evaluasi anggota dengan opsi pengirim anonim.

### 2. Modul Operasional Fungsional (Functional Modules)
- **Keuangan & Kas (`/finance`)**: Penyusunan Rencana Anggaran Biaya (RAB) bertingkat, verifikasi mutasi kas masuk/keluar, dan kartu setoran iuran kas anggota.
- **Persuratan & Kearsipan (`/letters`)**: Registrasi surat masuk dan keluar, status pengarsipan FSM 9 status, dan penomoran surat resmi.
- **Inventaris & Logistik Posko (`/inventory`)**: Katalog aset posko, pencatatan mutasi barang antar-lokasi, manifes koli pengiriman ekspedisi, dan log perjalanan kurir/armada posko.
- **Kemitraan & Sponsorship (`/partners`)**: Saluran pipa kemitraan 11 status FSM, metrik perolehan dana sponsor, dan linimasa tindak lanjut negosiasi kontraprestasi.
- **Rapat & Notulensi (`/meetings`)**: Penjadwalan rapat divisi/pleno, presensi kehadiran anggota, risalah notulensi, dan konversi butir kesepakatan menjadi Work Item.
- **Kalender Kegiatan (`/calendar`)**: Kalender agenda bulanan posko dan bakti sosial, serta respons RSVP kehadiran interaktif.

### 3. Modul Administrasi Back-Office (`/admin`)
*(Hanya dapat diakses oleh peran `owner` / `co_owner`)*
- **Manajemen Anggota**: Direktori anggota, pendaftaran akun baru, pembaruan peran & divisi, penonaktifan akun, dan modal reset kata sandi sementara sekali pakai dengan tombol salin instan.
- **Tempat Sampah (Recycle Bin - 14 Tabel)**: Penampil data terhapus lunak (*soft-deleted*), pemulihan instan (*restore*), dan modal hapus permanen (*hard delete*) dengan verifikasi ulang kata sandi admin serta header `Idempotency-Key`.
- **Audit Log Viewer**: Penampil jejak aktivitas sistem secara real-time dengan filter aksi/entitas/aktor dan penampil payload JSON.

---

## 🛡️ Arsitektur Keamanan Zero-Trust

1. **Ketiadaan Token di Sisi Klien**:
   - Token JWT `access_token` dan `refresh_token` disimpan secara eksklusif dalam cookie HTTP-Only bertanda `secure` dan `sameSite=lax`.
   - Kode JavaScript browser tidak memiliki akses ke string token JWT.
2. **Next.js 16 Thin Proxy (`src/proxy.ts`)**:
   - Melakukan verifikasi proteksi CSRF berdasarkan header `Origin` / `Referer`.
   - Melakukan pemeriksaan cepat keberadaan cookie sesi pada rute terproteksi.
3. **Verifikasi Sesi Lapis 2 Otoritatif (`(app)/layout.tsx`)**:
   - Server Component memanggil fungsi `verifySession()` yang memverifikasi token ke Backend NestJS melalui rute `/api/v1/auth/session`.
   - Mengambil data peran (`roles`) dan divisi terkini secara otoritatif sebelum merender antarmuka.
4. **Gateway Catch-All Forwarding (`/api/v1/[...path]`)**:
   - Meneruskan seluruh permintaan API lokal dari TanStack Query ke Backend NestJS dengan menyematkan header `Authorization: Bearer <cookie>`, `If-Match`, `Idempotency-Key`, dan `X-Request-Id`.
   - Meneruskan respons format standar RFC 7807 `application/problem+json`.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

| Kategori | Teknologi |
| :--- | :--- |
| **Framework** | Next.js 16.2.12 (Turbopack, App Router) |
| **Pustaka UI** | React 19.2.4 & React DOM |
| **Styling** | Tailwind CSS v4 + TW-Animate CSS + Shadcn UI |
| **Komponen Primitif** | Radix UI (`radix-ui`) |
| **Validasi Skema** | Zod 4.0.0 |
| **Formulir** | React Hook Form 7.54.2 + `@hookform/resolvers/zod` |
| **Server State** | TanStack React Query v5.101.4 |
| **Client UI State** | Zustand v5.0.5 |
| **Ikon** | Lucide React 0.525.0 |
| **Notifikasi Toast** | Sonner 2.0.6 |
| **Pengujian Unit** | Vitest 3.2.4 (137 tests, 99.83% statement coverage) |
| **Pengujian E2E** | Playwright 1.53.2 (Chromium, 23/23 tests lulus) |

---

## 📁 Struktur Direktori

```
src/
├── app/                          # Next.js App Router (22 rute terkompilasi)
│   ├── (app)/                    # Area Aplikasi Terautentikasi
│   │   ├── layout.tsx            # Lapis 2 Auth & App Shell
│   │   ├── error.tsx             # Error Boundary RFC 7807
│   │   ├── dashboard/            # Beranda Utama
│   │   ├── work-center/          # Work Center & Kanban
│   │   ├── requests/             # Pengajuan Operasional
│   │   ├── divisions/            # Profil Divisi
│   │   ├── team/                 # Ruang Tim & Aspirasi
│   │   ├── finance/              # Keuangan & RAB
│   │   ├── letters/              # Persuratan & Arsip
│   │   ├── partners/             # Kemitraan & Sponsor
│   │   ├── inventory/            # Inventaris & Manifes
│   │   ├── meetings/             # Rapat & Notulensi
│   │   ├── calendar/             # Kalender Kegiatan
│   │   └── admin/                # Back-Office Admin & Tempat Sampah
│   ├── (auth)/                   # Area Otentikasi
│   │   ├── login/                # Halaman Masuk
│   │   └── change-password/      # Ganti Kata Sandi Wajib
│   ├── api/                      # Route Handlers BFF
│   │   ├── auth/                 # Auth BFF (login, logout, refresh, me)
│   │   └── v1/[...path]/         # Gateway Catch-All Forwarding
│   ├── error.tsx                 # Error Boundary Root
│   ├── global-error.tsx          # Global Error Boundary
│   ├── not-found.tsx             # Halaman 404 Kustom Bahasa Indonesia
│   ├── layout.tsx                # Root HTML & Providers
│   └── page.tsx                  # Root Redirector
├── components/                   # Komponen Bersama & Layouts
├── features/                     # Domain Fitur Modular
├── lib/                          # Kamus Bahasa Indonesia (id.ts), i18n, verifier
└── store/                        # Zustand Store (ui.store.ts)
```

---

## ⚡ Menjalankan Aplikasi

### 1. Prasyarat
- Node.js >= 20.x
- Backend NestJS Samudra Karsa berjalan di `http://localhost:3000`

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (`.env.local`)
```env
BACKEND_API_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Aplikasi berjalan di: `http://localhost:3001`

### 5. Menjalankan Pengujian & Quality Gates
```bash
# Pengujian Unit (137 tests, >99% coverage)
npm run test:unit

# Pengecekan Tipe TypeScript (0 error)
npm run typecheck

# Pengecekan Linting ESLint (0 error, 0 warning)
npm run lint

# Pengujian End-to-End Playwright (23/23 tests lulus)
npx playwright test --project=chromium

# Kompilasi Produksi Turbopack (22/22 rute berhasil)
npm run build
```

---

## 📖 Dokumentasi Lengkap
- [Panduan Pengguna Berdasarkan Peran](docs/PANDUAN-PENGGUNA-BERDASARKAN-PERAN.md)
- [Dokumen Serah Terima Arsitektur Frontend](docs/DOKUMEN-SERAH-TERIMA-ARSITEKTUR.md)
- [Alur Backend untuk Frontend](docs/ALUR-BACKEND-UNTUK-FE.md)
- [PRD Frontend Spesifikasi Asli](docs/PRD-FRONTEND.md)

---

&copy; 2026 Samudra Karsa. Hak Cipta Dilindungi.
