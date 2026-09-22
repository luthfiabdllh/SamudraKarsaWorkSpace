import { describe, it, expect } from 'vitest';
import {
  createMeetingSchema,
  createMeetingDecisionSchema,
} from '../schemas/meeting';

describe('Meeting & Decision Schemas', () => {
  describe('createMeetingSchema', () => {
    it('validates a valid meeting', () => {
      const valid = {
        title: 'Rapat Pleno Persiapan Keberangkatan',
        meetingType: 'general_meeting',
        heldAt: '2026-10-01T09:00:00.000Z',
        locationOrMedia: 'Aula Barat Lt. 3',
        agenda: 'Pemaparan divisi dan cek perlengkapan posko',
      };
      const result = createMeetingSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects meeting when title is empty', () => {
      const invalid = {
        title: '   ',
        meetingType: 'coordination_meeting',
        heldAt: '2026-10-01T09:00:00.000Z',
      };
      const result = createMeetingSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects invalid meeting type', () => {
      const invalid = {
        title: 'Rapat Koordinasi',
        meetingType: 'invalid_type',
        heldAt: '2026-10-01T09:00:00.000Z',
      };
      const result = createMeetingSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('createMeetingDecisionSchema', () => {
    it('validates a valid meeting decision', () => {
      const valid = {
        decisionText: 'Divisi Logistik wajib mengonfirmasi kapal cadangan',
        dueDate: '2026-10-05',
        priority: 'high',
      };
      const result = createMeetingDecisionSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects empty decision text', () => {
      const invalid = {
        decisionText: '   ',
      };
      const result = createMeetingDecisionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
