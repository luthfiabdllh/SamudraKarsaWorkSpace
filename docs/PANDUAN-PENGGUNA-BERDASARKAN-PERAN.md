# Panduan Pengguna Berdasarkan Peran (Role-Based User Guide)
## Samudra Karsa WorkSpace v2.0

Dokumen ini merupakan panduan operasional resmi untuk seluruh jajaran pengurus dan anggota organisasi dalam menggunakan platform **Samudra Karsa WorkSpace**. Antarmuka platform disajikan dalam 100% Bahasa Indonesia dengan rute navigasi terstandarisasi.

---

## 1. Ikhtisar Struktur Peran & Matriks Akses

| Modul / Fitur | Ketua (`owner`) | Pimpinan Inti (`co_owner`) | Kepala Divisi (`division_head`) | Wakil Kadiv (`division_deputy`) | Anggota (`member`) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Beranda (`/dashboard`)** | Baca & Pantau Semua | Baca & Pantau Semua | Baca Metrik Terkait | Baca Metrik Terkait | Baca Metrik Terkait |
| **Work Center (`/work-center`)** | Penuh (Buat, Klaim, Transisi) | Penuh | Penuh Divisi | Penuh Divisi | Klaim & Kerjakan |
| **Pengajuan (`/requests`)** | Persetujuan Akhir | Persetujuan Akhir | Ajukan & Review | Ajukan & Review | Ajukan Permintaan |
| **Keuangan (`/finance`)** | Otorisasi Penuh | Otorisasi Penuh | Akses Terbatas | Akses Terbatas | Bayar Iuran |
| **Persuratan (`/letters`)** | Tanda Tangan & Setujui | Tanda Tangan & Setujui | Registrasi & Arsip | Registrasi & Arsip | Baca Arsip Umum |
| **Inventaris (`/inventory`)** | Akses Penuh | Akses Penuh | Catat Mutasi & Manifes | Catat Mutasi & Manifes | Lihat Katalog |
| **Kemitraan (`/partners`)** | Evaluasi & Deal | Evaluasi & Deal | Follow-up & Benefit | Follow-up & Benefit | Lihat Sponsor |
| **Rapat (`/meetings`)** | Kelola & Putuskan | Kelola & Putuskan | Jadwalkan & Notulensi | Jadwalkan & Notulensi | Presensi & Baca Hasil |
| **Kalender (`/calendar`)** | Kelola Agenda | Kelola Agenda | Buat Agenda Divisi | Buat Agenda Divisi | RSVP Kehadiran |
| **Ruang Tim (`/team`)** | Pin Pengumuman | Pin Pengumuman | Pengumuman Divisi | Pengumuman Divisi | Kirim Aspirasi |
| **Administrasi (`/admin`)** | Kelola Akun & Hard Delete | Kelola Akun & Pulihkan | Tidak Memiliki Akses | Tidak Memiliki Akses | Tidak Memiliki Akses |

---

## 2. Panduan untuk Ketua (`owner`) & Pimpinan Inti (`co_owner`)

### A. Pengawasan dan Persetujuan Anggaran (Keuangan - `/finance`)
1. **Verifikasi Rencana Anggaran Biaya (RAB)**:
   - Buka tab **RAB Anggaran**.
   - Buka rincian proposal untuk memeriksa pos anggaran dan rincian belanja.
   - Gunakan tombol FSM untuk menyetujui (`Setujui Anggaran`) atau menolak dengan catatan.
2. **Persetujuan Pencairan Kas**:
   - Buka tab **Mutasi Kas**.
   - Verifikasi bukti kuitansi atau transfer sebelum mengeklik **Verifikasi Kas Keluar**.
3. **Pemantauan Iuran Kas Anggota**:
   - Buka tab **Iuran Kas** untuk memantau anggota yang menunggak atau telah lunas.

### B. Pusat Kendali Administrasi & Anggota (`/admin`)
1. **Manajemen Akun Anggota**:
   - **Tambah Anggota**: Masukkan email, nama lengkap, divisi, dan peran. Sistem akan membuat akun dengan status aktif.
   - **Edit Peran & Divisi**: Buka modal edit untuk mempromosikan anggota menjadi Kadiv atau Pimpinan Inti.
   - **Reset Kata Sandi Sementara**: Klik tombol kunci pada anggota, salin kata sandi sementara sekali pakai, dan serahkan kepada yang bersangkutan. Pengguna diwajibkan mengganti kata sandi pada saat masuk pertama kali.
   - **Nonaktifkan Akun**: Nonaktifkan akun anggota yang sedang cuti atau telah demisioner tanpa menghapus riwayat datanya.
2. **Tempat Sampah (Recycle Bin - 14 Tabel)**:
   - Pantau data yang terhapus lunak (*soft-deleted*) dari 14 entitas (tugas, pengajuan, surat, posko, dll).
   - **Pulihkan (*Restore*)**: Mengembalikan data kembali ke status aktif tanpa kehilangan relasi.
   - **Hapus Permanen (*Hard Delete*)**: Tindakan berbahaya yang memerlukan autentikasi ulang kata sandi admin dan konfirmasi eksplisit. Data akan dihapus tuntas dari basis data PostgreSQL.
3. **Audit Log Viewer**:
   - Periksa jejak audit seluruh aktivitas sistem (siapa melakukan apa, kapan, dan dari alamat IP mana).
   - Klik **Rincian Metadata** untuk melihat payload JSON sebelum dan sesudah mutasi.

---

## 3. Panduan untuk Kepala Divisi (`division_head`) & Wakil (`division_deputy`)

### A. Work Center & Manajemen Tugas (`/work-center`)
1. **Membuat Pekerjaan Baru**:
   - Klik **Buat Pekerjaan**. Tentukan judul, divisi pelaksana, prioritas, dan tenggat waktu.
2. **Klaim & Penugasan PIC**:
   - Gunakan tab filter **Pekerjaan Tanpa PIC** untuk mengidentifikasi tugas yang belum ada penanggung jawab.
   - Klik **Klaim PIC** untuk mengambil alih tugas atau tugaskan anggota divisi Anda.
3. **Transisi Status FSM (Alur Kerja)**:
   - Pindahkan kartu di papan Kanban atau melalui Drawer Detail.
   - Jika menahan tugas ke status `Ditahan (ON_HOLD)`, isi alasan penahanan.
   - Jika menyelesaikan tugas ke `Selesai (COMPLETED)`, masukkan ringkasan hasil pekerjaan.
4. **Penanganan Konflik Sinkronisasi (Optimistic Locking)**:
   - Jika rekan kerja lain mengubah tugas secara bersamaan, dialog *409 Conflict* akan muncul secara otomatis.
   - Klik **Muat Ulang Data Terbaru** untuk menyinkronkan perubahan sebelum menyimpan kembali.

### B. Pengajuan Operasional Lintas Divisi (`/requests`)
1. **Mengajukan Kebutuhan Operasional**:
   - Pilih salah satu dari 14 jenis pengajuan (misal: *Peminjaman Logistik*, *Pencairan Dana Posko*, *Dukungan Media*).
   - Tentukan divisi tujuan dan tingkat urgensi (Rendah, Sedang, Tinggi, Mendesak).
2. **Menindaklanjuti Pengajuan Divisi**:
   - Buka drawer detail pengajuan untuk melihat keterkaitan dengan tugas Work Center (`linkedWorkItemId`).
   - Lakukan transisi status alur (Disetujui, Diproses, Selesai, Ditolak).

### C. Persuratan & Inventaris Posko
- **Persuratan (`/letters`)**: Registrasikan surat masuk/keluar, lampirkan URL dokumen, dan pantau status FSM pengarsipan.
- **Inventaris (`/inventory`)**: Catat perpindahan barang antargudang/posko, terbitkan manifes koli untuk ekspedisi, dan perbarui log perjalanan kurir/armada posko.

---

## 4. Panduan untuk Anggota Organisasi (`member`)

1. **Masuk ke Sistem (`/login`)**:
   - Gunakan email resmi organisasi dan kata sandi yang diberikan administrator.
   - Jika kata sandi sementara digunakan, sistem akan langsung mengarahkan Anda ke formulir penggantian kata sandi (`/change-password`).
2. **Mengerjakan Tugas Harian (`/work-center`)**:
   - Pantau tugas yang ditugaskan kepada Anda.
   - Perbarui progres pekerjaan secara berkala hingga selesai.
3. **Rapat & Notulensi (`/meetings`)**:
   - Periksa jadwal rapat koordinasi mingguan atau divisi.
   - Konfirmasi presensi kehadiran dan baca notulensi hasil kesepakatan rapat.
4. **Kalender & Kegiatan Posko (`/calendar`)**:
   - Lihat agenda bakti sosial, pelayaran, atau pengabdian masyarakat.
   - Kirim respons RSVP (Hadir, Izin, Berhalangan) langsung dari kartu kegiatan.
5. **Ruang Aspirasi & Evaluasi (`/team`)**:
   - Baca pengumuman resmi yang disematkan oleh pengurus.
   - Kirimkan kritik, saran, atau masukan melalui form evaluasi dengan opsi pengirim anonim untuk menjaga kerahasiaan identitas.
6. **Iuran Kas Organisasi (`/finance`)**:
   - Periksa status pembayaran iuran bulanan Anda.
   - Konfirmasi setoran iuran tunai atau transfer kepada bendahara divisi.
