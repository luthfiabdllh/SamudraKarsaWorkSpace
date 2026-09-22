import { describe, expect, it } from 'vitest';
import {
  createRequestFormSchema,
  transitionRequestSchema,
  resolveSyncConflictSchema,
} from '../schemas/request';
import { requestItemSchema, REQUEST_STATUSES, REQUEST_TYPES } from '../types';
import { requestKeys } from '../api/query-keys';

describe('Requests Schemas, Types & Query Keys', () => {
  describe('createRequestFormSchema', () => {
    it('should validate valid request data', () => {
      const valid = {
        title: 'Permohonan Peminjaman Proyektor',
        type: 'equipment_loan',
        targetDivisionId: '0191e4b8-2a00-7000-8000-000000000001',
        priority: 'high',
        dueDate: '2026-07-15',
        description: 'Digunakan untuk sesi materi rapat kerja maritim.',
      };

      const result = createRequestFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject title shorter than 3 characters', () => {
      const invalid = {
        title: 'AB',
        type: 'other',
        targetDivisionId: '0191e4b8-2a00-7000-8000-000000000001',
      };

      const result = createRequestFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('minimal 3 karakter');
      }
    });

    it('should reject missing or invalid targetDivisionId', () => {
      const invalid = {
        title: 'Permohonan Publikasi',
        targetDivisionId: 'not-a-uuid',
      };

      const result = createRequestFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Divisi tujuan wajib dipilih');
      }
    });

    it('should reject invalid due date format', () => {
      const invalid = {
        title: 'Desain Banner Rapat',
        targetDivisionId: '0191e4b8-2a00-7000-8000-000000000001',
        dueDate: '15/07/2026',
      };

      const result = createRequestFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('transitionRequestSchema', () => {
    it('should validate transition for all valid 9 FSM statuses', () => {
      for (const status of REQUEST_STATUSES) {
        const result = transitionRequestSchema.safeParse({
          to: status,
          note: `Transisi ke ${status}`,
        });
        expect(result.success).toBe(true);
      }
    });

    it('should validate transition with required notes', () => {
      const valid = {
        to: 'need_clarification',
        clarificationNote: 'Mohon cantumkan ukuran banner dan format file.',
        holdReason: null,
        resultSummary: null,
      };

      const result = transitionRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status name', () => {
      const invalid = {
        to: 'invalid_status_xyz',
      };

      const result = transitionRequestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('resolveSyncConflictSchema', () => {
    it('should validate valid conflict resolution data', () => {
      const valid = {
        status: 'accepted',
        note: 'Disepakati oleh pemohon dan kadiv logistik bahwa pengajuan tetap dilanjutkan.',
      };

      const result = resolveSyncConflictSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject note shorter than 3 characters', () => {
      const invalid = {
        status: 'done',
        note: 'ok',
      };

      const result = resolveSyncConflictSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('minimal 3 karakter');
      }
    });

    it('should reject invalid status', () => {
      const invalid = {
        status: 'non_existent_status',
        note: 'Kesepakatan bersama.',
      };

      const result = resolveSyncConflictSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('requestItemSchema', () => {
    it('should parse valid request item', () => {
      const raw = {
        id: '0191e4b8-2a00-7000-8000-000000000001',
        requestNumber: 'REQ-2026-0001',
        title: 'Pengadaan Seragam Panitia',
        type: 'goods_procurement',
        status: 'submitted',
        priority: 'high',
        targetDivisionId: '0191e4b8-2a00-7000-8000-000000000002',
        targetDivisionName: 'Logistik',
        requesterId: '0191e4b8-2a00-7000-8000-000000000003',
        requesterName: 'Budi Santoso',
        assignedPicId: null,
        assignedPicName: null,
        dueDate: '2026-08-01',
        syncConflictAt: null,
        completedAt: null,
        archivedAt: null,
        version: 1,
        createdAt: '2026-07-01T10:00:00Z',
        updatedAt: '2026-07-01T10:00:00Z',
      };

      const parsed = requestItemSchema.parse(raw);
      expect(parsed.requestNumber).toBe('REQ-2026-0001');
      expect(parsed.status).toBe('submitted');
    });
  });

  describe('requestKeys', () => {
    it('should produce correct hierarchy of query keys', () => {
      expect(requestKeys.all).toEqual(['requests']);
      expect(requestKeys.lists()).toEqual(['requests', 'list']);
      expect(requestKeys.list({ status: 'submitted' })).toEqual([
        'requests',
        'list',
        { status: 'submitted' },
      ]);
      expect(requestKeys.details()).toEqual(['requests', 'detail']);
      expect(requestKeys.detail('req-123')).toEqual(['requests', 'detail', 'req-123']);
      expect(requestKeys.divisions()).toEqual(['organization', 'divisions']);
    });
  });

  describe('REQUEST_TYPES & REQUEST_STATUSES constants', () => {
    it('should have 14 official request types', () => {
      expect(REQUEST_TYPES.length).toBe(14);
      expect(REQUEST_TYPES).toContain('correspondence');
      expect(REQUEST_TYPES).toContain('budget_plan');
      expect(REQUEST_TYPES).toContain('design');
      expect(REQUEST_TYPES).toContain('goods_procurement');
    });

    it('should have 9 official FSM statuses', () => {
      expect(REQUEST_STATUSES.length).toBe(9);
      expect(REQUEST_STATUSES).toContain('draft');
      expect(REQUEST_STATUSES).toContain('submitted');
      expect(REQUEST_STATUSES).toContain('accepted');
      expect(REQUEST_STATUSES).toContain('in_progress');
      expect(REQUEST_STATUSES).toContain('need_review');
      expect(REQUEST_STATUSES).toContain('need_clarification');
      expect(REQUEST_STATUSES).toContain('on_hold');
      expect(REQUEST_STATUSES).toContain('done');
      expect(REQUEST_STATUSES).toContain('rejected');
    });
  });
});
