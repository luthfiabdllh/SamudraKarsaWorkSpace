import { describe, it, expect } from 'vitest';
import {
  createPartnerSchema,
  transitionPartnerSchema,
  addFollowupSchema,
  addBenefitSchema,
} from '../schemas/partner';

describe('Partner & Sponsorship Schemas', () => {
  describe('createPartnerSchema', () => {
    it('validates a valid partner registration', () => {
      const valid = {
        name: 'PT Bank Mandiri (Persero) Tbk',
        category: 'Perbankan & BUMN',
        industry: 'Finansial',
        contactPerson: 'Ibu Ratna (CSR Division)',
        contactInfo: 'ratna@bankmandiri.co.id',
        targetSupport: '50000000',
        agreedValue: '40000000',
        inKindSupport: '50 paket sembako posko',
      };
      const result = createPartnerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects partner when name is empty', () => {
      const invalid = {
        name: '  ',
      };
      const result = createPartnerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('transitionPartnerSchema', () => {
    it('validates valid pipeline statuses', () => {
      const valid = { to: 'contract_signed', note: 'MoU ditandatangani kedua belah pihak' };
      const result = transitionPartnerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects invalid pipeline status', () => {
      const invalid = { to: 'non_existent_status' };
      const result = transitionPartnerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('addFollowupSchema', () => {
    it('validates a valid followup note', () => {
      const valid = { followupNote: 'Telepon follow-up proposal dengan tim CSR, respon positif.' };
      const result = addFollowupSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects empty followup note', () => {
      const invalid = { followupNote: '   ' };
      const result = addFollowupSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('addBenefitSchema', () => {
    it('validates a valid sponsorship benefit', () => {
      const valid = {
        benefitDescription: 'Pemasangan logo ukuran besar di backdrop utama',
        deadline: '2026-10-15',
        proofUrl: 'https://storage.samudrakarsa.org/proof/banner.jpg',
      };
      const result = addBenefitSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects invalid proof url format', () => {
      const invalid = {
        benefitDescription: 'Logo di banner',
        proofUrl: 'not-a-valid-url',
      };
      const result = addBenefitSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
