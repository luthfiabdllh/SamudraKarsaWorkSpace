import { z } from 'zod';

export const WORK_ITEM_STATUSES = [
  'draft',
  'submitted',
  'in_review',
  'approved',
  'in_progress',
  'blocked',
  'completed',
  'cancelled',
] as const;

export type WorkItemStatus = (typeof WORK_ITEM_STATUSES)[number];

export const WORK_ITEM_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type WorkItemPriority = (typeof WORK_ITEM_PRIORITIES)[number];

export const workItemSchema = z.object({
  id: z.string().uuid(),
  ticketNumber: z.string(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  status: z.enum(WORK_ITEM_STATUSES),
  priority: z.enum(WORK_ITEM_PRIORITIES),
  divisionCode: z.string(),
  programId: z.string().uuid().nullable().optional(),
  picId: z.string().uuid().nullable().optional(),
  version: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable().optional(),
});

export type WorkItem = z.infer<typeof workItemSchema>;

export interface WorkCenterFilterParams {
  divisionCode?: string;
  priority?: WorkItemPriority;
  status?: WorkItemStatus;
  withoutPic?: boolean;
  search?: string;
}
