import type { Dictionary } from './dictionaries/en';

export type Locale = 'en' | 'id';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'id'];

/**
 * Dynamically imports the dictionary for the given locale.
 * Called from Server Components — safe to use `import()` here.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const dictionaries = {
    en: () => import('./dictionaries/en').then((m) => m.en),
    id: () => import('./dictionaries/id').then((m) => m.id),
  } satisfies Record<Locale, () => Promise<Dictionary>>;

  const loader = dictionaries[locale] ?? dictionaries[defaultLocale];
  return loader();
}

/**
 * Validates that a given string is a supported locale.
 */
export function isValidLocale(locale: string): locale is Locale {
  return (locales as string[]).includes(locale);
}
