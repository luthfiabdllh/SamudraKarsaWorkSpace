import { z } from 'zod';

export const auditLogSchema = z.object({
  id: z.string().uuid(),
  action: z.string(),
  actorId: z.string().uuid().nullable().optional(),
  entityType: z.string().nullable().optional(),
  entityId: z.string().nullable().optional(),
  details: z.record(z.string(), z.unknown()).nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;
