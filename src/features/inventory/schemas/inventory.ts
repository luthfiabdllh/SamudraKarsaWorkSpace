import { z } from 'zod';
import {
  INVENTORY_MOVEMENT_TYPES,
  SHIPMENT_STATUSES,
  TRIP_STATUSES,
} from '../types';

export const createInventoryItemSchema = z.object({
  name: z.string().trim().min(1, 'Nama barang wajib diisi'),
  category: z.string().trim().optional().nullable(),
  unit: z.string().trim().optional().nullable(),
  initialStock: z.number().int().min(0, 'Stok awal tidak boleh negatif'),
  picId: z.string().uuid().optional().nullable(),
  divisionId: z.string().uuid().optional().nullable(),
  periodId: z.string().uuid().optional().nullable(),
  storageLocation: z.string().trim().optional().nullable(),
  note: z.string().trim().optional().nullable(),
});

export type CreateInventoryItemInput = z.infer<typeof createInventoryItemSchema>;

export const updateInventoryItemSchema = createInventoryItemSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Setidaknya satu kolom harus diperbarui',
  });

export type UpdateInventoryItemInput = z.infer<typeof updateInventoryItemSchema>;

export const addMovementSchema = z.object({
  movementType: z.enum(INVENTORY_MOVEMENT_TYPES, {
    message: 'Jenis mutasi tidak valid',
  }),
  quantity: z
    .number()
    .int()
    .refine((q) => q !== 0, {
      message: 'Jumlah tidak boleh nol. Gunakan angka positif untuk masuk, negatif untuk keluar.',
    }),
  movementDate: z.string().datetime().optional(),
  movedBy: z.string().uuid().optional().nullable(),
  note: z.string().trim().optional().nullable(),
});

export type AddMovementInput = z.infer<typeof addMovementSchema>;

export const createShipmentSchema = z.object({
  packageName: z.string().trim().min(1, 'Nama paket/koli wajib diisi'),
  contentNote: z.string().trim().optional().nullable(),
  weightKg: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Format berat tidak valid (contoh: 12.5)')
    .optional()
    .nullable()
    .or(z.literal('')),
  dimensionNote: z.string().trim().optional().nullable(),
  origin: z.string().trim().optional().nullable(),
  destination: z.string().trim().optional().nullable(),
  senderName: z.string().trim().optional().nullable(),
  recipientName: z.string().trim().optional().nullable(),
  expedition: z.string().trim().optional().nullable(),
  trackingNumber: z.string().trim().optional().nullable(),
  scheduledAt: z.string().optional().nullable(),
  cost: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Format biaya tidak valid (hanya angka)')
    .optional()
    .nullable()
    .or(z.literal('')),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;

export const transitionShipmentSchema = z.object({
  to: z.enum(SHIPMENT_STATUSES, {
    message: 'Status tujuan pengiriman tidak valid',
  }),
});

export type TransitionShipmentInput = z.infer<typeof transitionShipmentSchema>;

export const createTripSchema = z.object({
  tripKind: z.string().trim().min(1, 'Jenis perjalanan wajib diisi'),
  title: z.string().trim().min(1, 'Judul perjalanan wajib diisi'),
  scheduledAt: z.string().optional().nullable(),
  vehicleNote: z.string().trim().optional().nullable(),
  picId: z.string().uuid().optional().nullable(),
  passengerCount: z.number().int().min(1).optional().nullable(),
  note: z.string().trim().optional().nullable(),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;

export const transitionTripSchema = z.object({
  to: z.enum(TRIP_STATUSES, {
    message: 'Status tujuan trip tidak valid',
  }),
  note: z.string().trim().optional().nullable(),
});

export type TransitionTripInput = z.infer<typeof transitionTripSchema>;
