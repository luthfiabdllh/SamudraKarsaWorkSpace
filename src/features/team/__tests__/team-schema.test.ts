import { describe, it, expect } from 'vitest';
import {
  createAnnouncementSchema,
  createFeedbackSchema,
} from '../schemas/team';

describe('Team & Collaboration Schemas', () => {
  describe('createAnnouncementSchema', () => {
    it('validates a valid announcement', () => {
      const valid = {
        title: 'Arahan Keberangkatan Gelombang I',
        body: 'Seluruh peserta kumpul di dermaga pukul 06.00 WITA.',
        pinned: true,
      };
      const result = createAnnouncementSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects announcement with empty title', () => {
      const invalid = {
        title: '   ',
        body: 'Isi pengumuman',
      };
      const result = createAnnouncementSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects announcement with empty body', () => {
      const invalid = {
        title: 'Pengumuman Baru',
        body: '   ',
      };
      const result = createAnnouncementSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('createFeedbackSchema', () => {
    it('validates a valid feedback item with named identity', () => {
      const valid = {
        message: 'Mohon penambahan stok air galon di posko 2',
        visibility: 'named',
        category: 'Logistik',
      };
      const result = createFeedbackSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('validates a valid feedback item with anonymous identity', () => {
      const valid = {
        message: 'Kritik konstruktif mengenai pembagian jam piket masak',
        visibility: 'anonymous',
      };
      const result = createFeedbackSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects empty feedback message', () => {
      const invalid = {
        message: '   ',
      };
      const result = createFeedbackSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
