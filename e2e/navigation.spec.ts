import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3001';

test.describe('Navigation, Responsiveness & Accessibility', () => {
  test.describe('Halaman 404 Tidak Ditemukan', () => {
    test('menampilkan halaman 404 kustom untuk rute yang tidak terdaftar saat berautentikasi', async ({ page, context }) => {
      await context.addCookies([
        {
          name: 'access_token',
          value: 'mock-auth-session-cookie',
          domain: 'localhost',
          path: '/',
        },
      ]);
      await page.goto(`${BASE_URL}/halaman-tidak-ada-xyz-123`);

      await expect(page.locator('text=404')).toBeVisible();
      await expect(page.locator('text=Halaman Tidak Ditemukan')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Kembali ke Beranda' })).toBeVisible();
    });
  });

  test.describe('Pengalihan Rute Lengkap Seluruh Modul', () => {
    const modules = [
      '/dashboard',
      '/work-center',
      '/requests',
      '/divisions',
      '/team',
      '/finance',
      '/letters',
      '/partners',
      '/inventory',
      '/meetings',
      '/calendar',
      '/admin',
    ];

    for (const mod of modules) {
      test(`rute ${mod} terlindungi dan mengalihkan pengguna anonim ke /login`, async ({ page }) => {
        await page.context().clearCookies();
        await page.goto(`${BASE_URL}${mod}`);

        await expect(page).toHaveURL(/\/login/);
      });
    }
  });

  test.describe('Responsivitas Tampilan Ponsel (Mobile Viewport)', () => {
    test('halaman masuk pas sempurna di layar ponsel tanpa scroll horizontal', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/login`);

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
      await expect(page.locator('#login-submit')).toBeVisible();
    });
  });

  test.describe('Aksesibilitas Formulir Masuk', () => {
    test('seluruh elemen formulir memiliki label aksesibel dan peran ARIA yang tepat', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Memastikan label dan input terhubung
      const emailInput = page.getByLabel('Alamat Email');
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toHaveAttribute('type', 'email');

      const passwordInput = page.getByLabel('Kata Sandi');
      await expect(passwordInput).toBeVisible();
      await expect(passwordInput).toHaveAttribute('type', 'password');

      // Tombol submit memiliki label aksesibel
      const submitBtn = page.locator('#login-submit');
      await expect(submitBtn).toBeVisible();
      await expect(submitBtn).toBeEnabled();

      // Heading hierarki H1 tepat 1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });
  });
});
