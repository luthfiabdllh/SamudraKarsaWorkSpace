import { id, type Dictionary } from './dictionaries/id';

export type { Dictionary };

export type Locale = 'id';
export const defaultLocale: Locale = 'id';
export const locales: Locale[] = ['id'];

/**
 * Mengambil kamus bahasa aplikasi (Bahasa Indonesia).
 * Sesuai Keputusan 15 & 32: Bahasa tunggal Indonesia di antarmuka.
 */
export function getDictionary(): Dictionary {
  return id;
}

/**
 * Validasi lokal bahasa (selalu 'id').
 */
export function isValidLocale(locale: string): locale is Locale {
  return locale === 'id';
}
