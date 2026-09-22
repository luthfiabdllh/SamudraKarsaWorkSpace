import { z } from 'zod';

export const createMemberSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  email: z
    .string()
    .trim()
    .email('Format alamat email tidak valid')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Kata sandi minimal 8 karakter')
    .max(100, 'Kata sandi maksimal 100 karakter'),
  roles: z
    .array(z.string())
    .min(1, 'Setidaknya satu peran struktural harus dipilih'),
  divisionId: z.string().uuid().optional().nullable().or(z.literal('')),
  periodId: z.string().uuid().optional().nullable().or(z.literal('')),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;

export const updateMemberSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .optional(),
  roles: z
    .array(z.string())
    .min(1, 'Setidaknya satu peran harus dipilih')
    .optional(),
  divisionId: z.string().uuid().optional().nullable().or(z.literal('')),
  status: z.enum(['active', 'inactive']).optional(),
});

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

export const hardDeleteSchema = z.object({
  password: z.string().min(1, 'Kata sandi admin wajib diisi untuk verifikasi keamanan'),
});

export type HardDeleteInput = z.infer<typeof hardDeleteSchema>;
