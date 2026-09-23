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
    .max(100, 'Kata sandi maksimal 100 karakter')
    .optional(),
  nickname: z.string().trim().max(60).optional().nullable().or(z.literal('')),
  photoUrl: z.string().url('URL foto tidak valid').max(500).optional().nullable().or(z.literal('')),
  phone: z.string().trim().max(32).optional().nullable().or(z.literal('')),
  facultyMajor: z.string().trim().max(160).optional().nullable().or(z.literal('')),
  batchYear: z.string().trim().max(12).optional().nullable().or(z.literal('')),
  roles: z
    .array(z.string())
    .min(1, 'Setidaknya satu peran struktural harus dipilih'),
  status: z.enum(['active', 'inactive', 'invited', 'suspended']).default('active'),
  divisionId: z.string().uuid().optional().nullable().or(z.literal('')),
  clusterId: z.string().uuid().optional().nullable().or(z.literal('')),
  subunitId: z.string().uuid().optional().nullable().or(z.literal('')),
  teamRole: z.string().trim().max(120).optional().nullable().or(z.literal('')),
  isKormasit: z.boolean().default(false),
  isKormater: z.boolean().default(false),
  socialLinks: z.record(z.string(), z.string().nullable().optional()).optional().nullable(),
  skills: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  availabilityNote: z.string().trim().max(500).optional().nullable().or(z.literal('')),
  emergencyContactName: z.string().trim().max(160).optional().nullable().or(z.literal('')),
  emergencyContactPhone: z.string().trim().max(32).optional().nullable().or(z.literal('')),
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
  nickname: z.string().trim().max(60).optional().nullable().or(z.literal('')),
  photoUrl: z.string().url('URL foto tidak valid').max(500).optional().nullable().or(z.literal('')),
  phone: z.string().trim().max(32).optional().nullable().or(z.literal('')),
  facultyMajor: z.string().trim().max(160).optional().nullable().or(z.literal('')),
  batchYear: z.string().trim().max(12).optional().nullable().or(z.literal('')),
  roles: z
    .array(z.string())
    .min(1, 'Setidaknya satu peran harus dipilih')
    .optional(),
  divisionId: z.string().uuid().optional().nullable().or(z.literal('')),
  clusterId: z.string().uuid().optional().nullable().or(z.literal('')),
  subunitId: z.string().uuid().optional().nullable().or(z.literal('')),
  teamRole: z.string().trim().max(120).optional().nullable().or(z.literal('')),
  isKormasit: z.boolean().optional(),
  isKormater: z.boolean().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  socialLinks: z.record(z.string(), z.string().nullable().optional()).optional().nullable(),
  skills: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  availabilityNote: z.string().trim().max(500).optional().nullable().or(z.literal('')),
  emergencyContactName: z.string().trim().max(160).optional().nullable().or(z.literal('')),
  emergencyContactPhone: z.string().trim().max(32).optional().nullable().or(z.literal('')),
  version: z.number().int().optional(),
});

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

export const hardDeleteSchema = z.object({
  password: z.string().min(1, 'Kata sandi admin wajib diisi untuk verifikasi keamanan'),
});

export type HardDeleteInput = z.infer<typeof hardDeleteSchema>;
