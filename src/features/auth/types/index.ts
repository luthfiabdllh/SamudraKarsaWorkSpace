import * as z from 'zod';

export const ROLE_VALUES = [
  'owner',
  'co_owner',
  'division_head',
  'division_deputy',
  'member',
] as const;

export type Role = (typeof ROLE_VALUES)[number];

// ─── Schemas ────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Masukkan alamat email yang valid.'),
  password: z
    .string()
    .min(8, 'Kata sandi minimal 8 karakter.')
    .max(128, 'Kata sandi terlalu panjang.'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Kata sandi saat ini wajib diisi.'),
    newPassword: z
      .string()
      .min(12, 'Kata sandi baru minimal 12 karakter sesuai standar keamanan.')
      .max(128, 'Kata sandi terlalu panjang.'),
    confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi kata sandi baru tidak cocok.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Kata sandi baru tidak boleh sama dengan kata sandi lama.',
    path: ['newPassword'],
  });

export const actorSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().nullable(),
  roles: z.array(z.enum(ROLE_VALUES)),
  divisionCodes: z.array(z.string()),
  mustChangePassword: z.boolean(),
  mustChangePasswordExempt: z.array(z.string()).optional(),
});

export const authResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      user: actorSchema.optional(),
    })
    .optional(),
  error: z
    .object({
      code: z.number(),
      message: z.string(),
    })
    .optional(),
});

// ─── TypeScript Types ────────────────────────────────────────────────────────

export type LoginDTO = z.infer<typeof loginSchema>;
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;
export type Actor = z.infer<typeof actorSchema>;
export type User = Actor;
export type AuthResponse = z.infer<typeof authResponseSchema>;
