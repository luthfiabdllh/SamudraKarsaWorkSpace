import { describe, it, expect } from 'vitest';
import {
  createCalendarEventSchema,
  updateRsvpSchema,
} from '../schemas/calendar';

describe('Calendar Event Schemas', () => {
  describe('createCalendarEventSchema', () => {
    it('validates a valid calendar event', () => {
      const valid = {
        title: 'Audiensi dengan Kepala Desa Wakatobi',
        eventType: 'audience',
        startAt: '2026-10-05T08:00:00.000Z',
        endAt: '2026-10-05T10:00:00.000Z',
        location: 'Kantor Balai Desa',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        agenda: 'Penyampaian rencana program KKN dan jadwal kerja bakti',
      };
      const result = createCalendarEventSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects event with empty title', () => {
      const invalid = {
        title: '   ',
        startAt: '2026-10-05T08:00:00.000Z',
        endAt: '2026-10-05T10:00:00.000Z',
      };
      const result = createCalendarEventSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects invalid meeting link format', () => {
      const invalid = {
        title: 'Rapat Daring',
        startAt: '2026-10-05T08:00:00.000Z',
        endAt: '2026-10-05T10:00:00.000Z',
        meetingLink: 'not-a-valid-url',
      };
      const result = createCalendarEventSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('updateRsvpSchema', () => {
    it('validates a valid RSVP response', () => {
      const valid = {
        status: 'attending',
        note: 'Akan hadir tepat waktu membawa berkas',
      };
      const result = updateRsvpSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects invalid RSVP status', () => {
      const invalid = {
        status: 'unknown_status',
      };
      const result = updateRsvpSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
