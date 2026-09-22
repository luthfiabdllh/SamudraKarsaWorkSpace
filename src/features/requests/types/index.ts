import { z } from 'zod';

/**
 * 9 Status Resmi FSM Permintaan (sesuai backend request_status)
 */
export const REQUEST_STATUSES = [
  'draft',
  'submitted',
  'accepted',
  'in_progress',
  'need_review',
  'need_clarification',
  'on_hold',
  'done',
  'rejected',
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

/**
 * 4 Tingkat Prioritas Permintaan
 */
export const REQUEST_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];

/**
 * 14 Jenis Permintaan Lintas Divisi
 */
export const REQUEST_TYPES = [
  'correspondence',
  'budget_plan',
  'design',
  'video_editing',
  'publication',
  'documentation',
  'goods_procurement',
  'goods_loan',
  'equipment_loan',
  'vehicle_loan',
  'operational_assistance',
  'event_permit',
  'speaker_request',
  'other',
] as const;

export type RequestType = (typeof REQUEST_TYPES)[number];

/**
 * Skema data item permintaan dalam daftar / tabel
 */
export const requestItemSchema = z.object({
  id: z.string().uuid(),
  requestNumber: z.string(),
  title: z.string().min(1),
  type: z.enum(REQUEST_TYPES),
  status: z.enum(REQUEST_STATUSES),
  priority: z.enum(REQUEST_PRIORITIES),
  targetDivisionId: z.string().uuid(),
  targetDivisionName: z.string().nullable().optional(),
  requesterId: z.string().uuid(),
  requesterName: z.string().nullable().optional(),
  assignedPicId: z.string().uuid().nullable().optional(),
  assignedPicName: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  syncConflictAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
  archivedAt: z.string().nullable().optional(),
  version: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type RequestItem = z.infer<typeof requestItemSchema>;

/**
 * Skema data detail lengkap yang dikembalikan oleh GET /api/v1/requests/:id
 */
export interface RequestDetail extends RequestItem {
  description: string | null;
  requesterDivisionId?: string | null;
  linkedWorkItemId: string | null;
  extraFields: Record<string, unknown>;
  clarificationNote: string | null;
  resultSummary: string | null;
  holdReason: string | null;
  periodId: string;
  availableTransitions: RequestStatus[];
  transitionRequirements?: Record<string, string[]>;
}

/**
 * Parameter filter daftar permintaan
 */
export interface RequestFilterParams {
  targetDivisionId?: string;
  requesterId?: string;
  assignedPicId?: string;
  priority?: RequestPriority;
  status?: RequestStatus;
  type?: RequestType;
  withoutPic?: boolean;
  hasSyncConflict?: boolean;
  q?: string;
  limit?: number;
  offset?: number;
}
