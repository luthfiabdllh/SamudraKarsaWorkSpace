import type { Dictionary } from './en';

export const id: Dictionary = {
  common: {
    loading: 'Memuat...',
    error: 'Terjadi kesalahan',
    retry: 'Coba lagi',
    save: 'Simpan',
    cancel: 'Batal',
    confirm: 'Konfirmasi',
    delete: 'Hapus',
    edit: 'Ubah',
    back: 'Kembali',
    close: 'Tutup',
    search: 'Cari',
    noResults: 'Tidak ada hasil ditemukan',
  },
  auth: {
    login: {
      title: 'Selamat datang kembali',
      subtitle: 'Masuk ke akun Anda untuk melanjutkan',
      emailLabel: 'Alamat email',
      emailPlaceholder: 'anda@contoh.com',
      passwordLabel: 'Kata sandi',
      passwordPlaceholder: '••••••••',
      submitButton: 'Masuk',
      submittingButton: 'Sedang masuk...',
      forgotPassword: 'Lupa kata sandi?',
      noAccount: 'Belum punya akun?',
      signUp: 'Daftar',
      errors: {
        invalidCredentials: 'Email atau kata sandi tidak valid.',
        tooManyAttempts: 'Terlalu banyak percobaan. Silakan coba lagi nanti.',
        serverError: 'Terjadi kesalahan. Silakan coba lagi.',
        emailRequired: 'Email wajib diisi.',
        emailInvalid: 'Masukkan alamat email yang valid.',
        passwordRequired: 'Kata sandi wajib diisi.',
        passwordMinLength: 'Kata sandi minimal 8 karakter.',
      },
    },
    logout: {
      button: 'Keluar',
      success: 'Anda telah keluar.',
    },
  },
  dashboard: {
    title: 'Dasbor',
    welcome: 'Selamat datang kembali, {name}!',
    navigation: {
      dashboard: 'Dasbor',
      profile: 'Profil',
      settings: 'Pengaturan',
    },
  },
  errors: {
    notFound: {
      title: 'Halaman tidak ditemukan',
      description: 'Halaman yang Anda cari tidak ada.',
      backHome: 'Kembali ke beranda',
    },
    serverError: {
      title: 'Terjadi kesalahan',
      description: 'Kesalahan tak terduga terjadi. Silakan coba lagi.',
      retry: 'Coba lagi',
    },
  },
};
