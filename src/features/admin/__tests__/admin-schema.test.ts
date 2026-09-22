import { describe, it, expect } from 'vitest';
import {
  createMemberSchema,
  updateMemberSchema,
  hardDeleteSchema,
} from '../schemas/admin';

describe('Admin & Member Schemas', () => {
  describe('createMemberSchema', () => {
    it('validates a valid member registration payload', () => {
      const valid = {
        fullName: 'Budi Santoso',
        email: 'budi@samudrakarsa.org',
        password: 'PasswordKuat2026!',
        roles: ['member'],
        divisionId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      };
      const result = createMemberSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects member with too short full name', () => {
      const invalid = {
        fullName: 'A',
        email: 'budi@samudrakarsa.org',
        password: 'PasswordKuat2026!',
        roles: ['member'],
      };
      const result = createMemberSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects member with invalid email', () => {
      const invalid = {
        fullName: 'Budi Santoso',
        email: 'not-an-email',
        password: 'PasswordKuat2026!',
        roles: ['member'],
      };
      const result = createMemberSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects member with too short password', () => {
      const invalid = {
        fullName: 'Budi Santoso',
        email: 'budi@samudrakarsa.org',
        password: '123',
        roles: ['member'],
      };
      const result = createMemberSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects member with empty roles array', () => {
      const invalid = {
        fullName: 'Budi Santoso',
        email: 'budi@samudrakarsa.org',
        password: 'PasswordKuat2026!',
        roles: [],
      };
      const result = createMemberSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('updateMemberSchema', () => {
    it('validates a valid member update payload', () => {
      const valid = {
        fullName: 'Budi Santoso, S.Kel',
        roles: ['division_head'],
        status: 'active' as const,
      };
      const result = updateMemberSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('validates deactivating a member', () => {
      const valid = {
        status: 'inactive' as const,
      };
      const result = updateMemberSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects invalid status', () => {
      const invalid = {
        status: 'suspended',
      };
      const result = updateMemberSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('hardDeleteSchema', () => {
    it('validates hard delete with provided admin password', () => {
      const valid = {
        password: 'AdminSuperSecretPassword!',
      };
      const result = hardDeleteSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects hard delete when password is empty', () => {
      const invalid = {
        password: '',
      };
      const result = hardDeleteSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
