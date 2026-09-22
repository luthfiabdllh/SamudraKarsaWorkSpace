import { z } from 'zod';

export const INVENTORY_CONDITIONS = [
  'tersedia',
  'dipinjam',
  'rusak',
  'hilang',
  'pemeliharaan',
] as const;

export type InventoryCondition = (typeof INVENTORY_CONDITIONS)[number];

export const inventoryItemSchema = z.object({
  id: z.string().uuid(),
  itemCode: z.string(),
  name: z.string().min(1),
  condition: z.enum(INVENTORY_CONDITIONS),
  location: z.string(),
  quantity: z.number().int().nonnegative(),
  divisionCode: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;
