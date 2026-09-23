import { z } from 'zod';

export const createDivisionSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, 'Kode divisi minimal 2 karakter.')
    .max(24, 'Kode divisi maksimal 24 karakter.')
    .toLowerCase()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Kode hanya boleh berisi huruf kecil, angka, dan tanda hubung.'),
  name: z
    .string()
    .trim()
    .min(1, 'Nama divisi wajib diisi.')
    .max(120, 'Nama divisi maksimal 120 karakter.'),
  icon: z
    .string()
    .trim()
    .max(64, 'Ikon maksimal 64 karakter.')
    .optional()
    .nullable(),
  description: z
    .string()
    .trim()
    .max(2000, 'Deskripsi maksimal 2000 karakter.')
    .optional()
    .nullable(),
  sortOrder: z.number().int().min(0).default(0),
});

export type CreateDivisionInput = z.infer<typeof createDivisionSchema>;
