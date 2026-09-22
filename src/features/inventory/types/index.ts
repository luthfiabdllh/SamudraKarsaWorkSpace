export const INVENTORY_CONDITIONS = [
  'tersedia',
  'dipinjam',
  'rusak',
  'hilang',
  'pemeliharaan',
] as const;
export type InventoryCondition = (typeof INVENTORY_CONDITIONS)[number];

export const INVENTORY_MOVEMENT_TYPES = [
  'inbound',
  'outbound',
  'used',
  'borrowed',
  'returned',
  'relocated',
  'damaged_or_lost',
] as const;
export type InventoryMovementType = (typeof INVENTORY_MOVEMENT_TYPES)[number];

export const SHIPMENT_STATUSES = [
  'processing',
  'shipped',
  'delivered',
  'returned',
  'cancelled',
] as const;
export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const TRIP_STATUSES = [
  'planned',
  'ongoing',
  'completed',
  'cancelled',
] as const;
export type TripStatus = (typeof TRIP_STATUSES)[number];

export interface InventoryItem {
  id: string;
  itemCode?: string | null;
  name: string;
  category?: string | null;
  unit?: string | null;
  initialStock: number;
  currentStock: number;
  picId?: string | null;
  divisionId?: string | null;
  periodId?: string | null;
  storageLocation?: string | null;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  pic?: {
    id: string;
    fullName?: string | null;
    email: string;
  } | null;
}

export interface InventoryMovement {
  id: string;
  inventoryItemId: string;
  movementType: InventoryMovementType;
  quantity: number;
  movementDate: string;
  movedBy?: string | null;
  note?: string | null;
  createdAt: string;
  mover?: {
    id: string;
    fullName?: string | null;
    email: string;
  } | null;
}

export interface InventoryDetail extends InventoryItem {
  movements: InventoryMovement[];
}

export interface ShipmentItem {
  id: string;
  packageName: string;
  contentNote?: string | null;
  weightKg?: string | null;
  dimensionNote?: string | null;
  origin?: string | null;
  destination?: string | null;
  senderName?: string | null;
  recipientName?: string | null;
  expedition?: string | null;
  trackingNumber?: string | null;
  scheduledAt?: string | null;
  cost?: string | null;
  status: ShipmentStatus;
  packagingPhotoUrl?: string | null;
  handoverProofUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TripItem {
  id: string;
  tripKind: string;
  title: string;
  scheduledAt?: string | null;
  vehicleNote?: string | null;
  picId?: string | null;
  passengerCount?: number | null;
  note?: string | null;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
  pic?: {
    id: string;
    fullName?: string | null;
    email: string;
  } | null;
}

export interface ListInventoryParams {
  limit?: number;
  offset?: number;
  category?: string;
  periodId?: string;
  picId?: string;
}

export interface ListShipmentsParams {
  limit?: number;
  offset?: number;
  status?: ShipmentStatus;
}

export interface ListTripsParams {
  limit?: number;
  offset?: number;
  status?: TripStatus;
  picId?: string;
}
