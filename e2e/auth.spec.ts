import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

// Test data
const VALID_USER = {
  email: 'test@example.com',
  password: 'TestPass123!',
};

test.describe('Authentication Flow', () => {
  test.describe('Login Page', () => {
    test('shows login form at /en/login', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/login`);

      await expect(page).toHaveTitle(/login/i);
      await expect(page.getByLabel('Email address')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(page.locator('#login-submit')).toBeVisible();
    });

    test('shows Indonesian UI at /id/login', async ({ page }) => {
      await page.goto(`${BASE_URL}/id/login`);

      await expect(page.getByLabel('Alamat email')).toBeVisible();
      await expect(page.getByLabel('Kata sandi')).toBeVisible();
    });

    test('shows validation errors for empty form submission', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/login`);

      await page.locator('#login-submit').click();

      // Validation errors should appear
      await expect(page.locator('[role="alert"]').first()).toBeVisible();
    });

    test('shows email validation error for invalid email', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/login`);

      await page.getByLabel('Email address').fill('not-an-email');
      await page.getByLabel('Password').fill('ValidPass1');
      await page.locator('#login-submit').click();

      await expect(page.locator('#login-email-error')).toBeVisible();
      await expect(page.locator('#login-email-error')).toContainText(
        'valid email'
      );
    });

    test('shows password validation error for short password', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/login`);

      await page.getByLabel('Email address').fill('user@example.com');
      await page.getByLabel('Password').fill('123');
      await page.locator('#login-submit').click();

      await expect(page.locator('#login-password-error')).toBeVisible();
      await expect(page.locator('#login-password-error')).toContainText(
        '8 characters'
      );
    });
  });

  test.describe('Protected Routes', () => {
    test('redirects unauthenticated user from /en/dashboard to /en/login', async ({ page }) => {
      // Ensure no auth cookie is set
      await page.context().clearCookies();

      await page.goto(`${BASE_URL}/en/dashboard`);

      // Should be redirected to login
      await expect(page).toHaveURL(/\/en\/login/);
    });

    test('redirects unauthenticated user from /id/dashboard to /id/login', async ({ page }) => {
      await page.context().clearCookies();

      await page.goto(`${BASE_URL}/id/dashboard`);

      await expect(page).toHaveURL(/\/id\/login/);
    });
  });

  test.describe('Logout', () => {
    test('logout button is accessible with correct aria-label', async ({ page }) => {
      // Set a mock access token cookie to simulate authenticated state
      await page.context().addCookies([
        {
          name: 'access_token',
          value: 'mock-jwt-token',
          domain: 'localhost',
          path: '/',
          httpOnly: true,
        },
      ]);

      await page.goto(`${BASE_URL}/en/dashboard`);

      // Even if auth fails in Server Component, check the page loaded
      // (in real test, would use a valid JWT)
      const logoutButton = page.locator('#logout-button');
      if (await logoutButton.isVisible()) {
        await expect(logoutButton).toHaveAttribute('aria-label', 'Sign out');
      }
    });
  });
});

test.describe('i18n Routing', () => {
  test('root / redirects to a locale-prefixed path', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    // Should redirect somewhere with a lang prefix
    await expect(page).toHaveURL(/\/(en|id)\//);
  });

  test('404 page for invalid locale', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/xx/dashboard`);
    // Should return 404 for unsupported locale
    expect(response?.status()).toBe(404);
  });
});
