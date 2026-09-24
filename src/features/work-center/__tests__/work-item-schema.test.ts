import { describe, expect, it } from 'vitest';
import {
  createWorkItemFormSchema,
  transitionWorkItemSchema,
  setWorkItemPicSchema,
  updateWorkItemSchema,
} from '../schemas/work-item';
import { workCenterKeys } from '../api/query-keys';

describe('Work Center Schemas & Query Keys', () => {
  describe('createWorkItemFormSchema', () => {
    it('should validate valid work item data', () => {
      const valid = {
        title: 'Persiapan survei posko',
        type: 'task',
        priority: 'high',
        startDate: '2026-07-01',
        dueDate: '2026-07-05',
        description: 'Menyiapkan peta lokasi dan izin warga.',
        progressPercentage: 10,
      };

      const result = createWorkItemFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject title shorter than 3 characters', () => {
      const invalid = {
        title: 'AB',
        type: 'task',
        priority: 'medium',
      };

      const result = createWorkItemFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('minimal 3 karakter');
      }
    });

    it('should reject invalid date format', () => {
      const invalid = {
        title: 'Pembersihan alat',
        startDate: '01-07-2026', // wrong format, should be YYYY-MM-DD
      };

      const result = createWorkItemFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('transitionWorkItemSchema', () => {
    it('should validate transition to in_progress', () => {
      const valid = {
        to: 'in_progress',
        note: 'Mulai pengerjaan hari ini.',
      };

      const result = transitionWorkItemSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should validate transition to blocked with reason', () => {
      const valid = {
        to: 'blocked',
        holdReason: 'Cuaca buruk menghambat keberangkatan.',
      };

      const result = transitionWorkItemSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should validate transition to done with completionSummary', () => {
      const valid = {
        to: 'done',
        completionSummary: 'Semua peralatan posko telah diinventarisir.',
      };

      const result = transitionWorkItemSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const invalid = {
        to: 'unknown_status',
      };

      const result = transitionWorkItemSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('setWorkItemPicSchema', () => {
    it('should validate assigning a PIC with valid UUID', () => {
      const valid = {
        primaryPicId: '0191e4b8-2a00-7000-8000-000000000001',
        note: 'Ditugaskan oleh kadiv.',
      };

      const result = setWorkItemPicSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should validate unassigning a PIC with null', () => {
      const valid = {
        primaryPicId: null,
      };

      const result = setWorkItemPicSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject non-UUID string for primaryPicId', () => {
      const invalid = {
        primaryPicId: 'not-a-uuid',
      };

      const result = setWorkItemPicSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('updateWorkItemSchema', () => {
    it('should validate valid partial update data', () => {
      const valid = {
        title: 'Judul tugas yang diperbarui',
        priority: 'high',
        storyPoints: 5,
        progressPercentage: 45,
        startDate: '2026-08-01',
        dueDate: '2026-08-10',
        description: 'Rincian tugas telah disesuaikan dengan instruksi terkini.',
      };

      const result = updateWorkItemSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject title shorter than 3 characters on update', () => {
      const invalid = {
        title: 'AB',
      };

      const result = updateWorkItemSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('minimal 3 karakter');
      }
    });

    it('should reject invalid due date format on update', () => {
      const invalid = {
        dueDate: '10/08/2026',
      };

      const result = updateWorkItemSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('workCenterKeys', () => {
    it('should generate correct query keys', () => {
      expect(workCenterKeys.all).toEqual(['work-center']);
      expect(workCenterKeys.lists()).toEqual(['work-center', 'list']);
      expect(workCenterKeys.list({ priority: 'urgent' })).toEqual([
        'work-center',
        'list',
        { priority: 'urgent' },
      ]);
      expect(workCenterKeys.detail('123')).toEqual([
        'work-center',
        'detail',
        '123',
      ]);
      expect(workCenterKeys.withoutPic()).toEqual(['work-center', 'without-pic']);
    });
  });
});
