# PRD Frontend — `SamudraKarsaWorkSpace`
**Next.js 16 · App Router · BFF · Tailwind v4 · Shadcn UI · TanStack Query v5 · Zustand v5 · Zod v4**  
*Revisi 2.0 (22 September 2026) — Diselaraskan 100% dengan Arsitektur & Kontrak Backend NestJS (Fase 1–8)*

---

## 1. Status Ekosistem & Latar Belakang

Dokumen ini adalah **Product Requirement Document (PRD)** resmi untuk repositori antarmuka pengguna (`SamudraKarsaWorkSpace`). Dokumen ini disusun ulang untuk merefleksikan arsitektur dan kapabilitas nyata backend NestJS (`SamudraKarsaWorkSpace-api`) yang telah rampung 100% dari Fase 1 hingga Fase 8.

### 1.1 Status Kesiapan Backend yang Dikonsumsi
- **154 Rute API Aktif**: Seluruh rute dilindungi oleh `PolicyGuard` otomatis, dengan 5 endpoint publik (`@Public()`).
- **Kontrak Terverifikasi**: Kontrak REST OpenAPI 3.1 aktif di `/api/v1/docs` dan spesifikasi error terstandarisasi RFC 7807 (`application/problem+json`).
- **Lingkungan Lokal & Basis Data**: PostgreSQL 16 berjalan di Docker Compose (`samudrakarsa-postgres` port 5432 dan API `samudrakarsa-api` port 3000) lengkap dengan data seeder operasional yang merepresentasikan alur kerja nyata tim KKN.
- **Penyimpanan Berkas**: Presigned URL berbasis Cloudflare R2 (S3-compatible) untuk unggah dan unduh berkas secara langsung dari peramban tanpa membebani server backend.

---

## 2. Lingkup, Batas & Filosofi Otorisasi

### 2.1 Tanggung Jawab Utama Frontend
1. **Penyajian Antarmuka & Interaksi Pengguna (UI/UX)**: Menghadirkan antarmuka modern, cepat, responsif di perangkat bergerak (mobile-first untuk posko KKN), dan mendukung Mode Gelap & Terang.
2. **Backend-for-Frontend (BFF)**: Menjalankan lapisan perantara `src/app/api/**` di Next.js Server Components / Route Handlers sebagai satu-satunya jembatan antara browser dan NestJS API.
3. **Pengelolaan Sesi Tanpa Paparan Token (Zero-Trust Security)**: Menyimpan JWT secara aman di cookie `httpOnly` milik domain frontend. JavaScript di browser tidak pernah memegang token akses maupun token penyegar.
4. **Dua Lapis Keamanan Sesi**:
   - **Lapis 1 (`src/proxy.ts`)**: Memvalidasi keberadaan cookie sesi dan origin sebelum me-render halaman.
   - **Lapis 2 (`(app)/layout.tsx`)**: Menjalankan fungsi `verifySession()` yang memvalidasi sesi aktif ke `GET /api/v1/auth/session`.
5. **Penyembunyian Elemen Antarmuka Berbasis Wewenang (UX Gating)**: Menyembunyikan tombol aksi atau menu yang tidak berhak diakses pengguna menggunakan fungsi pembantu dari `@samudrakarsa/shared/policy`.
6. **Kamus Bahasa Terpusat (i18n)**: Seluruh string antarmuka berbahasa Indonesia terpusat di `src/lib/dictionaries/id.ts`.
7. **Penanganan Status Komponen**: Menyediakan visualisasi *Empty State*, *Loading Skeleton*, dan *Error Boundary* di setiap layar tanpa kecuali.

### 2.2 Batasan Tegas (Yang BUKAN Tanggung Jawab Frontend)

| Hal | Pemilik Mutlak | Konsekuensi di Frontend |
|---|---|---|
| **Penegakan Izin (Authorization Enforcement)** | Backend (`PolicyGuard`) | UI hanya menyembunyikan tombol untuk kenyamanan pengguna. Jika tombol dibobol, backend menolak dengan HTTP 403 atau 404. |
| **Penerbitan & Verifikasi Token JWT** | Backend (`AuthModule`) | Frontend dilarang keras menandatangani token sendiri. Hapus `JWT_SECRET` dari `env.ts`. |
| **Aturan Transisi Status (FSM)** | Backend (`WorkflowService`) | Frontend tidak pernah melakukan hardcode status berikutnya. Dropdown aksi transisi wajib dirender dari array `availableTransitions`. |
| **Penomoran Dokumen Organisasi** | Backend (`NumberingService`) | Format nomor dokumen (`WI-YYYY-#####`, `REQ-YYYY-#####`, `RAB-YYYY-#####`, `SRT-<JENIS>-YYYY-#####`, `INV-YYYY-#####`) bersifat *read-only*. |
| **Akses Langsung ke Database** | Backend Postgres | Tidak ada klien database (seperti Supabase JS Client atau Prisma) di repo frontend. |

> [!CAUTION]
> **Prinsip Utama:** Frontend HANYA menyembunyikan tombol untuk UX. Backend adalah penegak mutlak keamanan. Jangan pernah menulis aturan otorisasi bisnis mandiri di frontend.

---

## 3. Arsitektur Sambungan Sistem & Autentikasi (BFF)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ BROWSER (Client Side - React 19)                                                │
│ - Zero-token: Tidak ada JWT di localStorage, sessionStorage, atau memory state   │
│ - Cookie httpOnly terpasang otomatis oleh browser (same-origin /api/*)          │
│ - Render antarmuka berbasis Server & Client Components                          │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │ /api/* (Same Origin)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│ NEXT.JS 16 BFF (App Router Server Runtime)                                      │
│ - Lapis 1: `src/proxy.ts` (Pemeriksaan cepat keberadaan cookie & origin)        │
│ - Lapis 2: `src/app/(app)/layout.tsx` -> `verifySession()`                      │
│ - Pengelola Cookie:                                                             │
│   * `access_token`: 15 menit, httpOnly, SameSite=Lax, Path=/                    │
│   * `refresh_token`: 7 hari, httpOnly, SameSite=Lax, Path=/api/auth/refresh     │
│ - Meneruskan permintaan server-to-server ke NestJS via Authorization Header     │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │ /api/v1/* (Authorization: Bearer <access_token>)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│ NESTJS API (`SamudraKarsaWorkSpace-api`)                                        │
│ - CORS: Direct browser call ditolak (`origin: false`)                           │
│ - Otentikasi: Argon2id Password Hash & Google OAuth ID Token Verification       │
│ - Penjagaan Rute: 154 endpoint dilindungi `PolicyGuard` otomatis                │
│ - Rate Limiter: Tabel terdistribusi `rate_limits`                               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Alur Masuk Sistem (Login Flow)

1. **Login Google OAuth**:
   - Pengguna menekan tombol *"Masuk dengan Akun Google"*.
   - Browser diarahkan ke Google OAuth Consent Screen.
   - Callback Google diterima oleh BFF di `/api/auth/google/callback`.
   - BFF menukar kode dengan token Google dan memperoleh `id_token` mentah.
   - BFF mengirim raw `id_token` ke backend: `POST /api/v1/auth/google { "credential": "<id_token>" }`.
   - Backend memverifikasi tanda tangan Google, memeriksa whitelist email anggota aktif, menerbitkan pasangan JWT, dan mencatat audit login.
   - BFF memasang cookie `httpOnly` dan mengarahkan browser ke `/beranda`.

2. **Login Password (Argon2id)**:
   - Pengguna memasukkan email dan password di `/masuk`.
   - Browser mengirim request ke BFF: `POST /api/auth/login`.
   - BFF mem-forward ke backend: `POST /api/v1/auth/login`.
   - Backend mencocokkan password via Argon2id (dibatasi rate limit 5 percobaan per 15 menit).
   - BFF memasang cookie `httpOnly` dan mengarahkan pengguna ke `/beranda`.

### 3.2 Penanganan Khusus `must_change_password`
- Jika akun memiliki flag `mustChangePassword === true` (misal saat akun baru diundang atau password baru saja di-reset oleh Admin):
- `SessionResult.mustChangePassword` bernilai `true`.
- Seluruh endpoint API backend otomatis menolak akses dengan status `403` kode `must_change_password`.
- **Alur Frontend:** `verifySession()` mendeteksi flag ini dan mengarahkan paksa browser ke halaman `/ganti-password`. Menu navigasi dan rute lain dikunci hingga kata sandi baru berhasil disimpan via `POST /api/v1/auth/change-password`.

### 3.3 Sesi Pengguna (`SessionResult`)
Data sesi yang disediakan oleh `GET /api/v1/auth/session` untuk otorisasi tampilan:
```ts
interface SessionResult {
  readonly id: string;
  readonly email: string;
  readonly fullName: string | null;
  readonly roles: readonly ('owner' | 'co_owner' | 'division_head' | 'division_deputy' | 'member')[];
  readonly divisionCodes: readonly string[]; // Contoh: ["SEKBEND", "MEDKRE"]
  readonly mustChangePassword: boolean;
  readonly mustChangePasswordExempt: readonly string[];
}
```

---

## 4. Standar Komunikasi & Penanganan Error RFC 7807

### 4.1 Header HTTP Wajib Antara BFF ↔ Backend
1. **`Authorization: Bearer <access_token>`**: Disertakan pada seluruh pemanggilan endpoint non-publik.
2. **`X-Request-Id`**: UUIDv4 unik per request pengguna. Di-forward ke backend dan dicantumkan pada modal dialog jika terjadi error sistem.
3. **`If-Match: "<version>"`**: **Wajib** disertakan pada setiap request mutasi `PATCH` untuk mencegah *lost updates* (Optimistic Locking).
4. **`Idempotency-Key: <uuidv4>`**: **Wajib** disertakan pada aksi rawan duplikasi jaringan (pembuatan pekerjaan, pengajuan request, transisi status, hapus permanen recycle bin, dan ekspor laporan).

### 4.2 Matriks Penanganan Kode Error RFC 7807 di UI

Semua error dari backend dikembalikan dalam format standar RFC 7807 (`application/problem+json`):

| HTTP Status | Makna di Backend | Tindakan & Perilaku Komponen Antarmuka |
|---|---|---|
| **400 Bad Request** | Sintaksis / payload tidak sesuai format | Tampilkan toast error: *"Format data tidak valid"* + tombol *Salin Request ID*. |
| **401 Unauthorized** | Token kedaluwarsa atau tidak sah | BFF otomatis mencoba rotasi token ke `/api/v1/auth/refresh`. Jika gagal, cabut cookie dan alihkan browser ke `/masuk`. |
| **403 Forbidden** | Akses ditolak / pelanggaran wewenang | Tampilkan halaman peringatan: *"Anda tidak memiliki akses ke fitur ini"*. (Seharusnya tidak pernah muncul jika UI menyembunyikan tombol dengan benar). |
| **404 Not Found** | Data tidak ada **atau** data privat divisi lain/keuangan | Tampilkan Empty State: *"Data tidak ditemukan"*. Backend sengaja mengembalikan 404 pada data privat agar tidak membocorkan eksistensi data. |
| **409 Conflict** | Konflik Versi (`If-Match` usang) atau Konflik Sinkronisasi | Tampilkan dialog modal konfirmasi: **"Data telah diperbarui oleh pengguna lain. Silakan muat ulang halaman untuk melihat data terbaru."** dengan tombol *"Muat Ulang"*. |
| **422 Unprocessable** | Validasi skema Zod gagal | Petakan array `errors[]` langsung ke pesan error masing-masing field form di `react-hook-form` (`setError(field, { message })`). |
| **428 Precondition Required** | Header `If-Match` lupa disertakan | Bug teknis frontend. Cegah dengan memastikan fungsi update selalu menyertakan atribut `version`. |
| **429 Too Many Requests** | Terkena batas laju (*Rate Limit*) | Ambil header `Retry-After`. Tampilkan banner peringatan: *"Terlalu banyak permintaan. Silakan tunggu X detik."* Kunci tombol aksi sementara. |
| **500 Internal Error** | Kendala pada server backend | Tampilkan dialog ramah: *"Terjadi kendala pada sistem. Silakan coba beberapa saat lagi"* disertai tombol salin `X-Request-Id`. Jangan tampilkan stack trace teknis. |

---

## 5. Peta Rute & Arsitektur Informasi (Navigasi)

Arsitektur navigasi menggunakan **Model Campuran (5 Hub Harian Terbuka + Modul Fungsional Khusus)**. Seluruh rute diratakan tanpa prefiks bahasa `[lang]` (Keputusan 15 & 32).

### 5.1 Struktur Rute Aplikasi

```
/masuk                                   ← Publik: Login Google OAuth & Form Password
/ganti-password                          ← Terproteksi: Ganti password mandiri / paksa mustChangePassword

/beranda                                 ← HUB 1: Dashboard personal, metrik ringkas, agenda hari ini, notifikasi
/work-center                             ← HUB 2: Papan kerja utama (Kanban / Tabel)
/work-center/[id]                        ← Halaman penuh detail pekerjaan (Fallback Drawer)
/permintaan                              ← HUB 3: Direktori & formulir pengajuan request lintas divisi
/permintaan/[id]                         ← Detail request & rekonsiliasi konflik
/divisi/[code]                           ← HUB 4: Workspace divisi (program klaster, staf divisi, kebutuhan subunit)
/tim                                     ← HUB 5: Direktori anggota aktif, pengumuman resmi, kotak aspirasi tim

/keuangan                                ← Modul Khusus: Kas, RAB proposal, tagihan iuran anggota (Owner, Co-Owner, Sekbend)
/keuangan/[id]                           ← Detail RAB & rincian pengeluaran per item
/persuratan                              ← Modul Khusus: Arsip surat masuk/keluar & penomoran resmi gapless
/kemitraan                               ← Modul Khusus: Pipeline sponsor, kontraprestasi benefit, follow-up
/inventaris                              ← Modul Khusus: Daftar aset posko, mutasi barang masuk/keluar/pinjam
/logistik                                ← Modul Khusus: Manifest pengiriman koli kapal & log perjalanan trip
/rapat                                   ← Modul Khusus: Notulensi rapat, daftar hadir, tindak lanjut keputusan
/kalender                                ← Modul Khusus: Kalender besar agenda tim, RSVP kehadiran, kegiatan eksternal

/admin/anggota                           ← Back-Office: Direktori admin, tambah anggota, reset password, nonaktifkan
/admin/recycle-bin                       ← Back-Office: Tempat sampah 14 tabel, restore, hapus permanen konfirmasi password
/admin/audit                             ← Back-Office: Penampil log audit aktivitas dan akses data sensitif
/profil                                  ← Profil diri anggota
/profil/pengaturan                       ← Setelan tema, preferensi notifikasi, data kontak darurat
```

### 5.2 Tata Letak Sidebar & Hak Akses Menu

Sidebar navigasi disusun menjadi 3 seksi utama yang beradaptasi secara otomatis berdasarkan peran pengguna (`roles`):

1. **Seksi "Hub Harian" (Tampil untuk Semua Anggota Aktif)**:
   - 🏠 Beranda (`/beranda`)
   - 📋 Work Center (`/work-center`)
   - 📨 Permintaan (`/permintaan`)
   - 🏢 Divisi Saya (`/divisi/[userDivision]`)
   - 👥 Tim & Komunitas (`/tim`)

2. **Seksi "Modul Operasional" (Tampil Sesuai Divisi & Peran)**:
   - 💼 Keuangan & Kas (Hanya `owner`, `co_owner`, dan pimpinan `sekbend`)
   - ✉️ Persuratan Resmi (Seluruh anggota dapat membaca; tulis oleh `sekbend` & pimpinan)
   - 🤝 Kemitraan & Sponsor (Dikelola oleh divisi `sponsor`)
   - 📦 Inventaris & Logistik (Dikelola oleh divisi `ops`)
   - 📝 Rapat & Notulensi (Semua anggota)
   - 📅 Kalender Agenda (Semua anggota)

3. **Seksi "Administrasi Tim" (Khusus `owner` dan `co_owner`)**:
   - 👤 Kelola Anggota (`/admin/anggota`)
   - 🗑️ Tempat Sampah (`/admin/recycle-bin`)
   - 🔍 Audit Log (`/admin/audit`)

---

## 6. Interaksi Domain Inti: Work Center & Permintaan Lintas Divisi

### 6.1 Penyajian Work Center: Tampilan Hibrida (Kanban & Tabel)
- Pengguna dapat beralih tampilan dengan tombol toggle di pojok kanan atas:
  - **Papan Kanban**: Mengelompokkan kartu pekerjaan berdasarkan kolom status (`draft`, `submitted`, `in_progress`, `need_review`, `on_hold`, `done`).
  - **Tabel Terstruktur (Data Table)**: Menampilkan data tabular padat dengan fitur pencarian teks, pengurutan kolom (*sorting*), filter divisi, dan paginasi cursor.
- **Tab Khusus "Pekerjaan Tanpa PIC" (`?withoutPic=true`)**:
  - Filter cepat bagi pimpinan divisi / ketua untuk memantau pekerjaan yang belum memiliki penanggung jawab (misal: pasca anggota dinonaktifkan oleh Admin).

### 6.2 Pola Interaksi Detail: Slide-Over Drawer & Dynamic Modal
- Saat kartu pekerjaan atau baris tabel diklik:
  1. Terbuka **Slide-over Panel (Drawer dari kanan)** tanpa meninggalkan konteks halaman kerja saat ini.
  2. Drawer memuat ringkasan lengkap: nomor resmi (`WI-2026-00001`), deskripsi, PIC utama, rekan kerja (*assignees*), checklist tugas, dan lampiran berkas.
  3. Menyediakan tombol pintas *"Buka Halaman Penuh"* menuju `/work-center/[id]` jika pengguna membutuhkan ruang telaah yang lebih luas.

### 6.3 Form Transisi Status FSM (`availableTransitions`)
- Dropdown status pada detail pekerjaan/permintaan **WAJIB dirender secara dinamis hanya dari array `availableTransitions`** yang dikirimkan backend.
- Nilai enum bahasa Inggris diterjemahkan ke label Indonesia via kamus `src/lib/dictionaries/id.ts`.
- **Form Dialog Konfirmasi Dinamis**:
  - Jika pengguna memilih transisi ke `on_hold`: Dialog pop-up wajib meminta isian:
    * `holdReason`: Alasan penahanan pekerjaan (min 5 karakter).
    * `blockerReason`: Kendala teknis utama.
    * `assistanceNeeded`: Bantuan yang diharapkan dari divisi lain/pimpinan.
  - Jika pengguna memilih transisi ke `done`: Dialog pop-up wajib meminta:
    * `completionSummary`: Ringkasan capaian kerja nyata (min 10 karakter).
  - Jika pengguna memilih transisi ke `need_clarification`: Dialog pop-up wajib meminta:
    * `clarificationNote`: Poin pertanyaan/kejelasan yang dibutuhkan pemohon.

### 6.4 Sinkronisasi Dua Arah & Penanganan Konflik (`sync_conflict_at`)
- Saat sebuah permintaan disetujui (`submitted`), backend secara otomatis membuat Work Item terkait di divisi tujuan.
- Perubahan status pada Work Item otomatis menyinkronkan status Permintaan induknya.
- **Penanganan Konflik Sinkronisasi**:
  - Jika terjadi perbedaan status yang bertolak belakang, backend menandai record dengan `syncConflictAt`.
  - Frontend menampilkan **Banner Peringatan Merah** pada kartu & detail request: *"Terdapat konflik sinkronisasi antara pekerjaan dan permintaan."*
  - Tombol *"Selesaikan Konflik"* memicu modal pemulihan yang memanggil `POST /api/v1/requests/:id/sync-conflict` dengan pilihan opsi:
    * `"sync_to_work_item"` (Menyelaraskan status permintaan mengikuti pekerjaan).
    * `"sync_to_request"` (Menyelaraskan status pekerjaan mengikuti permintaan).

---

## 7. Modul Pendukung, Media & Kolaborasi

### 7.1 Keuangan & Kas Anggota (`/keuangan`)
- Menu disembunyikan sepenuhnya bagi pengguna non-keuangan. Akses langsung via URL menghasilkan respons **404 Not Found** demi melindungi privasi kas organisasi.
- Proposal Anggaran (`RAB-YYYY-#####`): Menampilkan perbandingan nominal rencana vs realisasi pengeluaran per item.
- Buku Kas Transaksi: Pencatatan pemasukan dan pengeluaran kas disertai bukti dukung.
- Iuran Kas Anggota (`/keuangan/iuran`):
  - Daftar pemenuhan iuran target Rp 4.000.000 per anggota.
  - Badge status iuran: `Lunas` (Hijau), `Cicilan` (Kuning), `Belum Bayar` (Merah).
  - Aksi verifikasi bukti transfer oleh bendahara (`PATCH /api/v1/dues/:id/payments/:paymentId/verify`).

### 7.2 Persuratan Resmi (`/persuratan`)
- Pengarsipan surat keluar dengan nomor registrasi gapless otomatis (`SRT-UND-2026-00001`, `SRT-PBM-2026-00001`, `SRT-KTR-2026-00001`).
- Pelacakan alur surat dari draf, peninjauan, penandatanganan pimpinan/DPL, hingga status terkirim.

### 7.3 Unggah File / Media ke Cloudflare R2 (Presigned URL)
- Frontend tidak pernah mengirim binary file langsung ke server Next.js atau NestJS (menghindari limit serverless 4.5 MB).
- **Alur Unggah Berkas**:
  1. Pengguna memilih berkas di peramban.
  2. Frontend memanggil `POST /api/v1/attachments/upload-url` dengan metadata berkas.
  3. Backend merespons dengan `{ uploadUrl, fileKey, id }`.
  4. Frontend melakukan HTTP `PUT` langsung ke `uploadUrl` (Cloudflare R2) dan menampilkan indikator kemajuan (*progress bar*) persentase unggah.
  5. Setelah selesai, kartu lampiran berkas langsung aktif dan dapat diunduh via presigned GET URL (`GET /api/v1/attachments/:id/download-url`).

### 7.4 Ekspor Data Skala Besar (`/laporan`)
- Panggilan `GET /api/v1/reports/export/:table` (Dibatasi rate limit 5x per jam per user).
- Frontend menampilkan modal dialog proses: *"Sedang memproses ekspor data..."*.
- Setelah backend mengembalikan URL presigned Cloudflare R2, frontend memicu browser download otomatis via `window.open(url, '_blank')`.

### 7.5 Rapat & Notulensi (`/rapat`)
- Jadwal rapat koordinasi, presensi kehadiran anggota, dan pencatatan butir notulensi.
- Tombol *"Tindak Lanjut Menjadi Pekerjaan"*: Mengonversi butir keputusan rapat menjadi Work Item baru secara instan (`POST /api/v1/meetings/:meetingId/decisions/:id/follow-up`).

### 7.6 Kalender Besar Tim (`/kalender`)
- Kalender visual (tampilan bulan, minggu, dan agenda hari ini).
- Tombol RSVP kehadiran (*Hadir*, *Ragu-ragu*, *Tidak Hadir*).
- Dukungan peserta eksternal non-anggota (misal: pejabat desa atau camat) tanpa akun sistem.

### 7.7 Polling Notifikasi Berkala (30s Polling)
- TanStack Query menjalankan query polling otomatis setiap 30 detik: `GET /api/v1/notifications?since=<iso_timestamp>`.
- Menampilkan indikator titik merah (*badge*) pada ikon lonceng navbar dan menyajikan dropdown ringkas notifikasi terbaru.

### 7.8 Kotak Aspirasi & Feedback Tim
- Form penyampaian masukan internal tim dengan checkbox opsi *"Kirim sebagai Anonim"*.
- Pada mode anonim, identitas pembuat disamarkan di antarmuka bagi seluruh anggota selain pimpinan tertinggi demi transparansi evaluasi tim.

---

## 8. Modul Administrasi Back-Office (Owner & Co-Owner)

### 8.1 Manajemen Anggota (`/admin/anggota`)
- Tambah Anggota Baru: Menetapkan nama lengkap, email, peran, divisi, dan password sementara (**tanpa pengiriman email keluar**, password disalin dan diberikan langsung secara internal).
- Reset Password Anggota: Memanggil endpoint reset, menampilkan modal konfirmasi berisi kata sandi sementara yang baru untuk disalin, dan otomatis mengaktifkan flag `mustChangePassword`.
- Nonaktifkan Anggota: Mengubah status menjadi `inactive`, yang seketika membatalkan sesi login dan mencabut seluruh posisi PIC yang dipegang anggota tersebut.

### 8.2 Tempat Sampah & Pemulihan Data (`/admin/recycle-bin`)
- Tab filter per entitas (Pekerjaan, Permintaan, Surat, Anggaran, Transaksi, Konten, Mitra, Inventaris, Pengiriman, Rapat, Pengumuman).
- **Aksi Pulihkan (Restore)**: Mengembalikan data ke status aktif (`deleted_at = NULL`).
- **Aksi Hapus Permanen (Hard Delete)**:
  - Wajib menampilkan modal dialog konfirmasi: *"Masukkan kata sandi akun Anda untuk mengonfirmasi penghapusan permanen."*
  - Payload dikirimkan ke backend: `DELETE /api/v1/recycle-bin/:table/:id { "password": "..." }` disertai header `Idempotency-Key`.
  - Backend memverifikasi ulang hash password via Argon2id sebelum menghapus fisik data dari database.

### 8.3 Penampil Audit Log (`/admin/audit`)
- Tabel rekam jejak aktivitas organisasi dengan filter aktor, jenis aksi (`create`, `update`, `delete`, `finance.viewed`), rentang waktu, dan entitas.

---

## 9. Struktur Direktori Teknis Repositori Frontend

```
SamudraKarsaWorkSpace/
├── public/                          ← Aset statis, favicon, logo tim
├── src/
│   ├── proxy.ts                     ← Lapis 1 Security: named export proxy() Next.js 16
│   ├── env.ts                       ← Validasi variabel lingkungan via @t3-oss/env-nextjs (TANPA JWT_SECRET)
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── masuk/page.tsx       ← Halaman login (Google & Password)
│   │   │   └── ganti-password/page.tsx ← Halaman ganti password wajib/mandiri
│   │   ├── (app)/
│   │   │   ├── layout.tsx           ← Lapis 2 Security: verifySession(), Shell Sidebar & Header
│   │   │   ├── beranda/page.tsx     ← Hub 1: Dashboard personal
│   │   │   ├── work-center/
│   │   │   │   ├── page.tsx         ← Hub 2: Papan kerja Kanban & Tabel
│   │   │   │   └── [id]/page.tsx    ← Fallback halaman penuh detail pekerjaan
│   │   │   ├── permintaan/
│   │   │   │   ├── page.tsx         ← Hub 3: Daftar request lintas divisi
│   │   │   │   └── [id]/page.tsx    ← Detail & rekonsiliasi request
│   │   │   ├── divisi/
│   │   │   │   └── [code]/page.tsx  ← Hub 4: Workspace divisi
│   │   │   ├── tim/page.tsx         ← Hub 5: Direktori anggota & pengumuman
│   │   │   ├── keuangan/
│   │   │   │   ├── page.tsx         ← Modul Keuangan: Kas & RAB
│   │   │   │   └── [id]/page.tsx    ← Rincian RAB
│   │   │   ├── persuratan/page.tsx  ← Modul Persuratan
│   │   │   ├── kemitraan/page.tsx   ← Modul Sponsorship
│   │   │   ├── inventaris/page.tsx  ← Modul Inventaris Posko
│   │   │   ├── logistik/page.tsx    ← Modul Pengiriman & Log Trip
│   │   │   ├── rapat/page.tsx       ← Modul Rapat & Notulensi
│   │   │   ├── kalender/page.tsx    ← Modul Kalender Agenda Bersama
│   │   │   ├── admin/
│   │   │   │   ├── anggota/page.tsx ← Kelola anggota tim
│   │   │   │   ├── recycle-bin/page.tsx ← Tempat sampah & hapus permanen
│   │   │   │   └── audit/page.tsx   ← Viewer log audit
│   │   │   └── profil/page.tsx      ← Profil diri & pengaturan
│   │   ├── api/                     ← Lapisan BFF Next.js (Route Handlers)
│   │   │   └── auth/
│   │   │       ├── login/route.ts   ← Forwarding login password & set cookie
│   │   │       ├── google/callback/route.ts ← Pertukaran auth code Google & set cookie
│   │   │       ├── refresh/route.ts ← Rotasi refresh token
│   │   │       └── logout/route.ts  ← Pencabutan sesi & pembersihan cookie
│   │   ├── globals.css              ← Tailwind v4 CSS Tokens & Theme Variables
│   │   └── layout.tsx               ← Root HTML layout, ThemeProvider, QueryProvider
│   ├── components/
│   │   ├── ui/                      ← Primitif Shadcn UI (button, card, dialog, drawer, table, dll.)
│   │   ├── layouts/                 ← Sidebar, Navbar, MobileBottomNav, UserDropdown
│   │   ├── feedback/                ← EmptyState, ErrorBoundaryState, LoadingSkeleton
│   │   └── shared/                  ← StatusBadge, PriorityBadge, DatePicker, FileUploader
│   ├── features/                    ← Modul fitur domain terisolasi
│   │   ├── work-center/             ← KanbanBoard, TaskTable, WorkItemDrawer, TransitionDialog
│   │   ├── requests/                ← RequestForm, SyncConflictBanner, ResolutionModal
│   │   ├── finance/                 ← BudgetSummaryCard, TransactionList, DuesPaymentTable
│   │   ├── inventory/               ← StockMovementModal, InventoryCard
│   │   ├── meetings/                ← MeetingNotulenForm, DecisionFollowUpButton
│   │   └── admin/                   ← ResetPasswordModal, HardDeletePasswordDialog
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts            ← Axios instance dengan interceptor RFC 7807 & auto-refresh
│   │   │   ├── server.ts            ← Server fetcher untuk Server Components
│   │   │   └── problem.ts           ← Parser RFC 7807 Problem Details
│   │   ├── session/
│   │   │   └── verify.ts            ← Server-side verifySession()
│   │   └── dictionaries/
│   │       ├── id.ts                ← Kamus tunggal Bahasa Indonesia lengkap
│   │       └── index.ts             ← Helper pemanggilan kamus terjemahan
│   ├── store/
│   │   └── ui-store.ts              ← Zustand UI Store (Sidebar, Theme, Active Filter)
│   └── providers/
│       ├── query-provider.tsx       ← TanStack Query Client Provider
│       └── theme-provider.tsx       ← next-themes Provider (Dark/Light Mode)
```

---

## 10. Manajemen State, Form & Performa

### 10.1 Pemisahan Tegas State Aplikasi
- **Server State (TanStack Query v5)**: Seluruh data yang bersumber dari API backend dikelola secara eksklusif oleh TanStack Query (caching, deduplication, invalidasi, dan pagination).
- **UI State (Zustand v5)**: Khusus untuk state antarmuka murni: sidebar collapse/expand, preferensi tampilan Kanban/Tabel, modal terbuka/tertutup, dan tab aktif. **Dilarang keras menyimpan data server atau token JWT di Zustand**.
- **Form State (`react-hook-form` + Zod)**: Seluruh formulir menggunakan resolver skema Zod yang diimpor langsung dari `@samudrakarsa/shared`.

### 10.2 Penanganan Cold Start Serverless Backend
- Backend berjalan pada arsitektur serverless (Vercel) yang memiliki potensi jeda *cold start* (1.5–3 detik) pada pemanggilan perdana.
- **Strategi Mitigasi Frontend**:
  1. Tampilkan komponen **Loading Skeleton** yang menyerupai bentuk asli kartu/tabel seketika saat navigasi dibuka (masking visual).
  2. Query notifikasi berkala setiap 30 detik secara otomatis menjaga instance serverless backend tetap hangat (*warm instance*).

---

## 11. Strategi Bahasa & Lokalisasi (i18n)

Sesuai **Keputusan 15**, aplikasi 100% menggunakan **Bahasa Indonesia**:
- Berkas kamus tunggal: `src/lib/dictionaries/id.ts`.
- Nilai enum database disimpan dalam bahasa Inggris teknis (`submitted`, `in_progress`, `on_hold`, `done`, `need_review`, `need_clarification`).
- Frontend memetakan seluruh enum Inggris ke label resmi bahasa Indonesia melalui kamus:
  - `submitted` ➔ *"Diajukan"*
  - `in_progress` ➔ *"Sedang Dikerjakan"*
  - `on_hold` ➔ *"Tertahan"*
  - `need_review` ➔ *"Menunggu Telaah"*
  - `need_clarification` ➔ *"Perlu Klarifikasi"*
  - `done` ➔ *"Selesai"*
- **Aturan Ketat:** Dilarang melakukan hardcode teks string Indonesia langsung di dalam JSX komponen; semua teks wajib dipanggil melalui kamus.

---

## 12. Rincian Pentahapan Kerja Frontend (Fase 1 s.d. Fase 8)

Pengerjaan frontend dilakukan secara bertahap mengikuti struktur 8 fase yang selaras dengan backend:

### 🚀 Fase 1: Pembersihan Scaffold & Penyiapan Kontrak
- [ ] Hapus `JWT_SECRET`, `ACCESS_TOKEN_TTL`, dan `REFRESH_TOKEN_TTL` dari `src/env.ts` (Keputusan 31).
- [ ] Hapus folder `src/app/[lang]/` dan ratakan struktur rute di bawah `src/app/` (Keputusan 32).
- [ ] Hapus `en.ts`, konsolidasikan kamus ke `src/lib/dictionaries/id.ts` (Keputusan 15).
- [ ] Ganti nama paket di `package.json` dari `my-next-template` menjadi `samudrakarsa-workspace`.
- [ ] Install dan hubungkan paket `@samudrakarsa/shared` via local dependency.
- [ ] Pasang konfigurasi Tailwind v4 dan sesuaikan tema Shadcn UI di `components.json`.

### 🔐 Fase 2: Arsitektur BFF & Cangkang Autentikasi
- [ ] Bangun endpoint BFF di `src/app/api/auth/**`:
  - `login/route.ts` (meneruskan login email/password & memasang cookie `httpOnly`).
  - `google/callback/route.ts` (menukar authorization code Google & mem-forward raw ID token).
  - `refresh/route.ts` (rotasi silent refresh token).
  - `logout/route.ts` (mencabut sesi di backend & menghapus cookie).
- [ ] Implementasikan `src/proxy.ts` (pemeriksaan cepat keberadaan cookie sesi & origin check).
- [ ] Buat `verifySession()` di `src/app/(app)/layout.tsx` untuk memvalidasi token ke `GET /api/v1/auth/session`.
- [ ] Buat halaman `/masuk` (form login responsif + tombol Google OAuth).
- [ ] Buat halaman `/ganti-password` yang dipaksa terbuka saat `mustChangePassword === true`.
- [ ] Bangun cangkang aplikasi (*App Shell*): Navbar, Sidebar dinamis berbasis role, dan layout responsif ponsel.
- [ ] Konfigurasi `apiClient` Axios dengan interceptor penanganan error RFC 7807 dan retry silent refresh otomatis saat status 401.

### 📋 Fase 3: Domain Inti (Work Center & Permintaan Lintas Divisi)
- [ ] Bangun Papan Kerja Utama (`/work-center`):
  - Tampilan Hibrida: Toggle beralih antara Papan Kanban dan Tabel Terstruktur.
  - Tab filter khusus *"Pekerjaan Tanpa PIC"* (`?withoutPic=true`).
  - Filter pencarian, filter divisi, dan paginasi cursor.
- [ ] Buat Slide-over Drawer detail pekerjaan:
  - Tampilkan atribut lengkap, PIC, checklist tugas, dan tautan halaman penuh `/work-center/[id]`.
  - Dropdown transisi status FSM yang dirender hanya dari array `availableTransitions`.
  - Modal dialog konfirmasi dinamis untuk isian wajib saat transisi ke `on_hold` (`holdReason`) dan `done` (`completionSummary`).
  - Penanganan Optimistic Locking: Kirim header `If-Match: "<version>"` pada setiap update dan tampilkan dialog 409 Conflict saat terjadi tabrakan versi.
- [ ] Bangun Modul Permintaan Lintas Divisi (`/permintaan`):
  - Formulir pengajuan request baru menggunakan skema Zod shared.
  - Tampilan indikator keterhubungan Work Item otomatis saat status request diajukan.
  - Banner peringatan konflik sinkronisasi (`sync_conflict_at`) dan modal resolusi status.

### 💼 Fase 4: Domain Pendukung (Keuangan, Persuratan, Kemitraan, Operasional)
- [ ] Modul Keuangan (`/keuangan`):
  - Proteksi menu: Tampil khusus untuk `owner`, `co_owner`, dan `sekbend`.
  - Proposal Anggaran (`RAB-YYYY-#####`): Visualisasi pagu rencana vs realisasi per item.
  - Buku Kas Transaksi & formulir pencatatan mutasi kas.
  - Halaman Iuran Anggota: Tabel tagihan iuran per anggota dan tombol verifikasi bukti transfer.
- [ ] Modul Persuratan (`/persuratan`):
  - Arsip surat keluar dengan registrasi penomoran resmi gapless `SRT-<JENIS>-YYYY-#####`.
- [ ] Modul Kemitraan (`/kemitraan`):
  - Pipeline sponsorship, log tindak lanjut follow-up, dan checklist pemenuhan benefit kontraprestasi.
- [ ] Modul Operasional & Logistik (`/inventaris` & `/logistik`):
  - Katalog barang posko (`INV-YYYY-#####`) dan pencatatan mutasi barang pinjam/keluar.
  - Manifest koli pengiriman kapal dan log trip kendaraan lapangan.
- [ ] Komponen Unggah Media Langsung ke Cloudflare R2:
  - Presigned PUT URL uploader dengan indikator kemajuan persentase unggah.
- [ ] Komponen Ekspor Laporan CSV asinkron via tautan Cloudflare R2.

### 🤝 Fase 5: Kolaborasi & Komunikasi Tim
- [ ] Modul Rapat & Notulensi (`/rapat`):
  - Formulir rapat, daftar hadir presensi, dan tombol tindak lanjut butir keputusan ke Work Item.
- [ ] Modul Kalender Agenda (`/kalender`):
  - Kalender visual bulanan/mingguan, tombol aksi RSVP kehadiran, dan pendaftaran peserta eksternal.
- [ ] Polling Notifikasi Otomatis:
  - TanStack Query polling interval 30 detik ke `GET /api/v1/notifications?since=...`.
  - Badge angka notifikasi belum dibaca di navbar dan dropdown notifikasi.
- [ ] Ruang Tim & Kotak Aspirasi (`/tim`):
  - Papan pengumuman resmi (dengan pin status).
  - Formulir penyampaian feedback anggota dengan opsi penyamaran anonim.

### ⚙️ Fase 6: Administrasi Back-Office (Owner & Co-Owner)
- [ ] Panel Kelola Anggota (`/admin/anggota`):
  - Pendaftaran anggota baru tanpa kirim email (password sementara dibuat dan disalin).
  - Aksi reset password dengan modal konfirmasi dan salin password sementara.
  - Aksi penonaktifkan anggota (status `inactive`).
- [ ] Modul Tempat Sampah (`/admin/recycle-bin`):
  - Tab 14 entitas yang mendukung soft-delete (`deleted_at IS NOT NULL`).
  - Tombol aksi Pulihkan (*Restore*).
  - Tombol aksi Hapus Permanen (*Hard Delete*) yang mewajibkan input konfirmasi kata sandi admin.
- [ ] Penampil Log Audit (`/admin/audit`):
  - Tabel inspeksi riwayat audit log dengan penyaring aktor, jenis aksi, dan entitas.

### 🛡️ Fase 7: Pengerasan UI/UX, Aksesibilitas & Responsivitas Ponsel
- [ ] Terapkan visualisasi *Loading Skeleton*, *Empty State*, dan *Error Boundary* di seluruh 100% halaman antarmuka.
- [ ] Uji responsivitas menyeluruh pada layar perangkat seluler (iPhone/Android) untuk kemudahan operasional di lokasi posko KKN.
- [ ] Audit aksesibilitas (a11y): Navigasi keyboard, label ARIA pada tombol ikon, kontras warna yang memenuhi standar WCAG AA pada Mode Terang dan Gelap.
- [ ] Audit pembersihan string: Pastikan tidak ada satu pun string teks Indonesia yang di-hardcode di dalam berkas komponen (seluruh teks wajib dipanggil dari dictionary).
- [ ] Verifikasi tidak adanya error 403 tak terduga (menu dan tombol tersembunyi secara konsisten sesuai peran).

### 📖 Fase 8: Peluncuran, Dokumentasi Pengguna & Serah Terima
- [ ] Susun panduan interaktif atau dokumentasi pengguna berbasis peran (*Role-based User Guide*): Ketua, Bendahara, Divisi Humas, Divisi Kreatif, Divisi Operasional, dan Anggota.
- [ ] Dokumentasi serah terima kode arsitektur (*Architecture Handover Documentation*) bagi pengembang generasi berikutnya.
- [ ] Verifikasi build produksi: `npm run build` dan validasi bundle size.

---

## 13. Definisi Selesai (Definition of Done)

Sebuah rute atau fitur antarmuka dinyatakan selesai (*Done*) jika memenuhi kriteria berikut:
1. **Zero-Token Exposure**: Tidak ada token JWT yang tersimpan di `localStorage`, `sessionStorage`, atau state memori client JavaScript.
2. **Kepatuhan Kamus Bahasa**: 100% teks menggunakan Bahasa Indonesia melalui `src/lib/dictionaries/id.ts`. Tidak ada string hardcoded.
3. **Kontrak RFC 7807**: Seluruh skenario error menampilkan umpan balik yang ramah, inline error pada form, serta menampilkan `X-Request-Id` bila terjadi error server.
4. **Optimistic Locking**: Setiap aksi `PATCH` mengirimkan header `If-Match: "<version>"` dan menangani status `409 Conflict` dengan dialog muat ulang yang jelas.
5. **Transisi Status FSM**: Tombol perubahan status hanya menampilkan pilihan yang sah dari array `availableTransitions`.
6. **State Handlers Lengkap**: Komponen memiliki tampilan visual saat data sedang dimuat (*Loading Skeleton*), saat data kosong (*Empty State*), dan saat terjadi kegagalan jaringan (*Error State*).
7. **Responsif**: Berfungsi sempurna dan nyaman digunakan pada layar ponsel (*mobile viewport*).
