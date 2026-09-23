import { describe, it, expect } from 'vitest';
import { createDivisionSchema } from '../schemas/division';

describe('Divisions Schemas', () => {
  describe('createDivisionSchema', () => {
    it('validates a valid division input', () => {
      const valid = {
        name: 'Logistik & Perlengkapan',
        code: 'logistik',
        icon: '📦',
        description: 'Pengelolaan aset dan kebutuhan logistik operasional',
        sortOrder: 70,
      };
      const result = createDivisionSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe('logistik');
        expect(result.data.sortOrder).toBe(70);
      }
    });

    it('transforms code to lowercase', () => {
      const input = {
        name: 'Humas & Publikasi',
        code: 'HUMPUB-REG',
        icon: '📢',
      };
      const result = createDivisionSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe('humpub-reg');
      }
    });

    it('rejects invalid code with special characters or spaces', () => {
      const invalid = {
        name: 'Divisi Khusus',
        code: 'divisi khusus!',
      };
      const result = createDivisionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects code shorter than 2 characters', () => {
      const invalid = {
        name: 'Divisi X',
        code: 'a',
      };
      const result = createDivisionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects empty name', () => {
      const invalid = {
        name: '   ',
        code: 'valid-code',
      };
      const result = createDivisionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
