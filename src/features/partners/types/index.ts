import { z } from 'zod';

export const PARTNER_TIERS = ['platinum', 'gold', 'silver', 'bronze', 'media'] as const;
export type PartnerTier = (typeof PARTNER_TIERS)[number];

export const partnerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  tier: z.enum(PARTNER_TIERS),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  status: z.string(),
  createdAt: z.string().datetime(),
});

export type Partner = z.infer<typeof partnerSchema>;
