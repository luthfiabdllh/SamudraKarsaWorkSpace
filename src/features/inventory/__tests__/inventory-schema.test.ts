import { describe, it, expect } from 'vitest';
import {
  createInventoryItemSchema,
  addMovementSchema,
  createShipmentSchema,
  transitionShipmentSchema,
  createTripSchema,
  transitionTripSchema,
} from '../schemas/inventory';

describe('Inventory & Logistics Schemas', () => {
  describe('createInventoryItemSchema', () => {
    it('validates a valid inventory item', () => {
      const valid = {
        name: 'Genset 2500W',
        category: 'Elektronik',
        unit: 'unit',
        initialStock: 2,
        storageLocation: 'Gudang Posko Utama',
        note: 'Kondisi baru, bensin terisi separuh',
      };
      const result = createInventoryItemSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('fails when name is empty', () => {
      const invalid = {
        name: '   ',
        initialStock: 1,
      };
      const result = createInventoryItemSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('addMovementSchema', () => {
    it('validates a positive movement quantity for inbound', () => {
      const valid = {
        movementType: 'inbound',
        quantity: 5,
        note: 'Beli tambahan dari toko bangunan',
      };
      const result = addMovementSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('validates a negative movement quantity for borrowed', () => {
      const valid = {
        movementType: 'borrowed',
        quantity: -2,
        note: 'Dipinjam warga desa',
      };
      const result = addMovementSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects zero quantity', () => {
      const invalid = {
        movementType: 'borrowed',
        quantity: 0,
      };
      const result = addMovementSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('createShipmentSchema', () => {
    it('validates a valid shipment with formatted cost and weight', () => {
      const valid = {
        packageName: 'Koli 01 - Berkas & Banner',
        expedition: 'Kapal Pelni',
        trackingNumber: 'PELNI-12345',
        origin: 'Kendari',
        destination: 'Wakatobi',
        weightKg: '25.5',
        cost: '150000',
      };
      const result = createShipmentSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects invalid weight format', () => {
      const invalid = {
        packageName: 'Paket A',
        weightKg: 'abc',
      };
      const result = createShipmentSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('transitionShipmentSchema', () => {
    it('validates a valid shipment transition', () => {
      const valid = { to: 'shipped' };
      const result = transitionShipmentSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects an invalid shipment transition', () => {
      const invalid = { to: 'invalid_status' };
      const result = transitionShipmentSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('createTripSchema', () => {
    it('validates a valid trip', () => {
      const valid = {
        tripKind: 'Survei Lapangan',
        title: 'Kunjungan ke Desa Binaan',
        passengerCount: 5,
        vehicleNote: 'Avanza Hitam DT 1234 AB',
      };
      const result = createTripSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects trip when title is missing', () => {
      const invalid = {
        tripKind: 'Operasional',
        title: '',
      };
      const result = createTripSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('transitionTripSchema', () => {
    it('validates valid trip transition', () => {
      const valid = { to: 'completed', note: 'Perjalanan lancar tanpa kendala' };
      const result = transitionTripSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });
});
