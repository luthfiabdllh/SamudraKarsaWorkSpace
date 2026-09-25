import { z } from 'zod';

/**
 * Nilai status resmi FSM Pekerjaan (PM Software framework: backlog, todo, in_progress, in_review, blocked, done, canceled).
 */
export const WORK_ITEM_STATUSES = [
  'backlog',
  'todo',
  'in_progress',
  'in_review',
  'blocked',
  'done',
  'canceled',
] as const;

export type WorkItemStatus = (typeof WORK_ITEM_STATUSES)[number];

/**
 * 4 Tingkat Prioritas Pekerjaan
 */
export const WORK_ITEM_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type WorkItemPriority = (typeof WORK_ITEM_PRIORITIES)[number];

/**
 * Tipe Pekerjaan Sesuai Enum Backend (termasuk Story untuk Agile decomposition)
 */
export const WORK_ITEM_TYPES = [
  'task',
  'story',
  'request',
  'meeting_follow_up',
  'program_need',
  'division_need',
  'milestone',
  'evaluation_follow_up',
  'subunit_need',
] as const;

export type WorkItemType = (typeof WORK_ITEM_TYPES)[number];

/**
 * Skema data ringkas untuk item dalam daftar / papan Kanban
 */
export const workItemSchema = z.object({
  id: z.string().uuid(),
  workNumber: z.string(),
  title: z.string().min(1),
  type: z.enum(WORK_ITEM_TYPES),
  status: z.enum(WORK_ITEM_STATUSES),
  priority: z.enum(WORK_ITEM_PRIORITIES),
  divisionId: z.string().uuid().nullable().optional(),
  divisionName: z.string().nullable().optional(),
  primaryPicId: z.string().uuid().nullable().optional(),
  primaryPicName: z.string().nullable().optional(),
  parentId: z.string().uuid().nullable().optional(),
  parentTitle: z.string().nullable().optional(),
  storyPoints: z.number().int().nonnegative().default(0),
  sourceRequestId: z.string().uuid().nullable().optional(),
  startDate: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  progressPercentage: z.number().int().min(0).max(100).default(0),
  completedAt: z.string().nullable().optional(),
  archivedAt: z.string().nullable().optional(),
  version: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type WorkItem = z.infer<typeof workItemSchema>;

/**
 * Skema data detail lengkap yang dikembalikan oleh GET /api/v1/work-items/:id
 */
export interface WorkItemAssignee {
  id: string;
  fullName: string | null;
  email?: string;
  divisionRole?: string | null;
}

export interface WorkItemStatusHistory {
  id: string;
  fromStatus: WorkItemStatus | null;
  toStatus: WorkItemStatus;
  changedBy: string | null;
  changedByName?: string | null;
  note: string | null;
  changedAt: string;
}

export interface WorkItemDetail extends WorkItem {
  createdBy?: string | null;
  description: string | null;
  clusterId?: string | null;
  subunitId?: string | null;
  programId?: string | null;
  periodId: string;
  moduleStatus?: string | null;
  blockerReason?: string | null;
  assistanceNeeded?: string | null;
  holdReason?: string | null;
  completionSummary?: string | null;
  parentId?: string | null;
  parentTitle?: string | null;
  storyPoints: number;
  sourceRequestId?: string | null;
  isRecurring: boolean;
  recurrenceRule?: string | null;
  availableTransitions: WorkItemStatus[];
  transitionRequirements?: Record<string, string[]>;
  assignees?: WorkItemAssignee[];
  children?: WorkItem[];
  statusHistory?: WorkItemStatusHistory[];
}

/**
 * Parameter filter daftar pekerjaan
 */
export interface WorkCenterFilterParams {
  divisionId?: string;
  divisionCode?: string;
  priority?: WorkItemPriority;
  status?: WorkItemStatus;
  type?: WorkItemType;
  parentId?: string;
  sourceRequestId?: string;
  withoutPic?: boolean;
  picId?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

