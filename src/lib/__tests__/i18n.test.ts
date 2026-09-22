import { describe, it, expect } from 'vitest';
import { getDictionary, isValidLocale, locales, defaultLocale } from '@/lib/i18n';

describe('i18n utilities', () => {
  describe('isValidLocale()', () => {
    it('returns true for "id"', () => {
      expect(isValidLocale('id')).toBe(true);
    });

    it('returns false for unsupported locale', () => {
      expect(isValidLocale('en')).toBe(false);
      expect(isValidLocale('fr')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidLocale('')).toBe(false);
    });
  });

  describe('locales constant', () => {
    it('contains "id"', () => {
      expect(locales).toContain('id');
    });

    it('has exactly 1 locale (Indonesian)', () => {
      expect(locales).toHaveLength(1);
    });
  });

  describe('defaultLocale', () => {
    it('is "id"', () => {
      expect(defaultLocale).toBe('id');
    });
  });

  describe('getDictionary()', () => {
    it('returns Indonesian dictionary', async () => {
      const dict = await getDictionary();
      expect(dict.auth.login.title).toBe('Masuk ke Akun Anda');
      expect(dict.auth.login.submitButton).toBe('Masuk ke Sistem');
    });

    it('returned dictionary has all required keys', async () => {
      const dict = await getDictionary();
      expect(dict).toHaveProperty('common');
      expect(dict).toHaveProperty('auth');
      expect(dict).toHaveProperty('navigation');
      expect(dict).toHaveProperty('roles');
      expect(dict).toHaveProperty('priorities');
      expect(dict).toHaveProperty('statuses');
      expect(dict).toHaveProperty('workCenter');
      expect(dict).toHaveProperty('errors');
    });
  });
});
