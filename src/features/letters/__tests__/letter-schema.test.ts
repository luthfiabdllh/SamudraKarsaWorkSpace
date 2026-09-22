import { describe, expect, it } from 'vitest';
import {
  createLetterSchema,
  transitionLetterSchema,
} from '../schemas/letter';
import {
  letterItemSchema,
  LETTER_STATUSES,
  LETTER_DIRECTIONS,
} from '../types';
import { letterKeys } from '../api/query-keys';

describe('Letters Schemas, Types & Query Keys', () => {
  describe('createLetterSchema', () => {
    it('should validate valid letter registration data', () => {
      const valid = {
        letterKind: 'UND',
        direction: 'outbound',
        subject: 'Undangan Rapat Koordinasi Maritim',
        institution: 'Dinas Kelautan dan Perikanan',
        senderRecipient: 'Kepala Dinas',
        signerName: 'Ketua Umum',
        letterDate: '2026-07-10',
        dueDate: '2026-07-20',
        note: 'Mohon konfirmasi kehadiran sebelum H-3.',
      };

      const result = createLetterSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject subject shorter than 3 characters', () => {
      const invalid = {
        letterKind: 'UND',
        subject: 'AB',
      };

      const result = createLetterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('minimal 3 karakter');
      }
    });

    it('should reject invalid date format', () => {
      const invalid = {
        letterKind: 'ST',
        subject: 'Surat Tugas Lapangan',
        letterDate: '10/07/2026',
      };

      const result = createLetterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('transitionLetterSchema', () => {
    it('should validate all 9 official letter FSM statuses', () => {
      for (const status of LETTER_STATUSES) {
        const result = transitionLetterSchema.safeParse({
          to: status,
          note: `Transisi berkas surat ke tahap ${status}`,
        });
        expect(result.success).toBe(true);
      }
    });

    it('should reject invalid letter status', () => {
      const invalid = {
        to: 'unknown_letter_status',
      };

      const result = transitionLetterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('letterItemSchema', () => {
    it('should parse valid letter item', () => {
      const raw = {
        id: '0191e4b8-2a00-7000-8000-000000000001',
        letterNumber: 'SRT-UND-2026-00001',
        letterKind: 'UND',
        direction: 'outbound',
        subject: 'Undangan Evaluasi Tengah Periode',
        senderRecipient: 'Para Kepala Divisi',
        institution: 'Internal Organisasi',
        letterDate: '2026-07-15',
        dueDate: null,
        picId: '0191e4b8-2a00-7000-8000-000000000002',
        picName: 'Sekretaris Utama',
        signerName: 'Ketua Umum',
        note: null,
        status: 'awaiting_signature',
        version: 1,
        createdAt: '2026-07-01T10:00:00Z',
        updatedAt: '2026-07-01T10:00:00Z',
      };

      const parsed = letterItemSchema.parse(raw);
      expect(parsed.letterNumber).toBe('SRT-UND-2026-00001');
      expect(parsed.status).toBe('awaiting_signature');
    });
  });

  describe('letterKeys', () => {
    it('should generate consistent query keys hierarchy', () => {
      expect(letterKeys.all).toEqual(['letters']);
      expect(letterKeys.lists()).toEqual(['letters', 'list']);
      expect(letterKeys.list()).toEqual(['letters', 'list', {}]);
      expect(letterKeys.list({ direction: 'inbound' })).toEqual([
        'letters',
        'list',
        { direction: 'inbound' },
      ]);
      expect(letterKeys.details()).toEqual(['letters', 'detail']);
      expect(letterKeys.detail('let-123')).toEqual(['letters', 'detail', 'let-123']);
    });
  });

  describe('constants', () => {
    it('should have 9 statuses and 2 directions', () => {
      expect(LETTER_STATUSES.length).toBe(9);
      expect(LETTER_STATUSES).toContain('submitted');
      expect(LETTER_STATUSES).toContain('needs_completion');
      expect(LETTER_STATUSES).toContain('verified');
      expect(LETTER_STATUSES).toContain('drafting');
      expect(LETTER_STATUSES).toContain('review');
      expect(LETTER_STATUSES).toContain('awaiting_signature');
      expect(LETTER_STATUSES).toContain('ready_to_send');
      expect(LETTER_STATUSES).toContain('sent');
      expect(LETTER_STATUSES).toContain('done');
      expect(LETTER_DIRECTIONS).toEqual(['inbound', 'outbound']);
    });
  });
});
