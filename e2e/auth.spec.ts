import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3001';

test.describe('Authentication & Access Control', () => {
  test.describe('Halaman Masuk (/login)', () => {
    test('menampilkan formulir masuk dengan antarmuka Bahasa Indonesia', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Memastikan judul halaman dan elemen utama termuat
      await expect(page).toHaveTitle(/Masuk/i);
      await expect(page.locator('#login-email')).toBeVisible();
      await expect(page.locator('#login-password')).toBeVisible();
      await expect(page.locator('#login-submit')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Moa Bercerita');
    });

    test('menampilkan pesan validasi ketika formulir dikirim kosong', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      await page.locator('#login-submit').click();

      // Memeriksa pesan peringatan Zod Bahasa Indonesia
      await expect(page.locator('#login-email-error')).toBeVisible();
      await expect(page.locator('#login-email-error')).toContainText('alamat email yang valid');
      await expect(page.locator('#login-password-error')).toBeVisible();
      await expect(page.locator('#login-password-error')).toContainText('minimal 8 karakter');
    });

    test('menampilkan peringatan format email tidak valid', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      await page.locator('#login-email').fill('bukan-email-valid');
      await page.locator('#login-password').fill('Rahasia123!');
      await page.locator('#login-submit').click();

      await expect(page.locator('#login-email-error')).toBeVisible();
      await expect(page.locator('#login-email-error')).toContainText('alamat email yang valid');
    });

    test('menampilkan peringatan panjang kata sandi kurang dari 8 karakter', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      await page.locator('#login-email').fill('anggota@samudrakarsa.org');
      await page.locator('#login-password').fill('pendek');
      await page.locator('#login-submit').click();

      await expect(page.locator('#login-password-error')).toBeVisible();
      await expect(page.locator('#login-password-error')).toContainText('minimal 8 karakter');
    });
  });

  test.describe('Proteksi Rute Terproteksi (Unauthenticated)', () => {
    test('rute akar (/) dialihkan ke /login ketika belum autentikasi', async ({ page }) => {
      await page.context().clearCookies();
      await page.goto(`${BASE_URL}/`);

      await expect(page).toHaveURL(/\/login/);
    });

    test('rute /dashboard dialihkan ke /login ketika belum autentikasi', async ({ page }) => {
      await page.context().clearCookies();
      await page.goto(`${BASE_URL}/dashboard`);

      await expect(page).toHaveURL(/\/login/);
    });

    test('rute fungsional /work-center, /requests, /finance dialihkan ke /login', async ({ page }) => {
      await page.context().clearCookies();

      for (const path of ['/work-center', '/requests', '/finance', '/admin']) {
        await page.goto(`${BASE_URL}${path}`);
        await expect(page).toHaveURL(new RegExp(`/login.*from=.*${encodeURIComponent(path)}`));
      }
    });
  });

  test.describe('Proteksi CSRF (Cross-Site Request Forgery)', () => {
    test('menolak mutasi POST dengan Origin asing yang tidak terdaftar', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/v1/auth/login`, {
        headers: {
          Origin: 'http://malicious-attacker-site.com',
        },
        data: {
          email: 'attacker@evil.com',
          password: 'Password123!',
        },
      });

      expect(response.status()).toBe(403);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error.message).toContain('CSRF Guard');
    });
  });
});
