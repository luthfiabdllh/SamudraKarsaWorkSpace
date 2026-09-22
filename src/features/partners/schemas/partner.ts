import { z } from 'zod';
import { PARTNER_STATUSES } from '../types';

export const createPartnerSchema = z.object({
  name: z.string().trim().min(1, 'Nama mitra wajib diisi'),
  category: z.string().trim().optional().nullable(),
  industry: z.string().trim().optional().nullable(),
  contactPerson: z.string().trim().optional().nullable(),
  contactInfo: z.string().trim().optional().nullable(),
  picId: z.string().uuid().optional().nullable(),
  relationChannel: z.string().trim().optional().nullable(),
  targetSupport: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Format target dukungan tidak valid')
    .optional()
    .nullable()
    .or(z.literal('')),
  agreedValue: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Format nilai disepakati tidak valid')
    .optional()
    .nullable()
    .or(z.literal('')),
  fundReceived: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Format dana masuk tidak valid')
    .optional()
    .or(z.literal('')),
  inKindSupport: z.string().trim().optional().nullable(),
  programId: z.string().uuid().optional().nullable(),
  periodId: z.string().uuid().optional().nullable(),
});

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>;

export const updatePartnerSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    category: z.string().trim().optional().nullable(),
    industry: z.string().trim().optional().nullable(),
    contactPerson: z.string().trim().optional().nullable(),
    contactInfo: z.string().trim().optional().nullable(),
    picId: z.string().uuid().optional().nullable(),
    relationChannel: z.string().trim().optional().nullable(),
    targetSupport: z.string().optional().nullable(),
    agreedValue: z.string().optional().nullable(),
    fundReceived: z.string().optional(),
    inKindSupport: z.string().trim().optional().nullable(),
    proposalUrl: z.string().url().optional().nullable().or(z.literal('')),
    coverLetterUrl: z.string().url().optional().nullable().or(z.literal('')),
    mouUrl: z.string().url().optional().nullable().or(z.literal('')),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'Setidaknya satu kolom harus diperbarui',
  });

export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>;

export const transitionPartnerSchema = z.object({
  to: z.enum(PARTNER_STATUSES, {
    message: 'Status tahapan kemitraan tidak valid',
  }),
  note: z.string().trim().optional().nullable(),
});

export type TransitionPartnerInput = z.infer<typeof transitionPartnerSchema>;

export const addFollowupSchema = z.object({
  followupNote: z.string().trim().min(1, 'Catatan tindak lanjut tidak boleh kosong'),
});

export type AddFollowupInput = z.infer<typeof addFollowupSchema>;

export const addBenefitSchema = z.object({
  benefitDescription: z.string().trim().min(1, 'Uraian benefit wajib diisi'),
  deadline: z.string().optional().nullable(),
  status: z.string().trim().default('pending'),
  proofUrl: z.string().url('Tautan bukti harus berupa URL yang valid').optional().nullable().or(z.literal('')),
});

export type AddBenefitInput = z.infer<typeof addBenefitSchema>;

export const updateBenefitSchema = addBenefitSchema.partial().refine(
  (d) => Object.keys(d).length > 0,
  { message: 'Setidaknya satu kolom harus diperbarui' }
);

export type UpdateBenefitInput = z.infer<typeof updateBenefitSchema>;
