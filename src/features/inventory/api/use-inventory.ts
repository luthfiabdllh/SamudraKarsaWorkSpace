import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { inventoryKeys } from './query-keys';
import type {
  InventoryItem,
  InventoryDetail,
  ShipmentItem,
  TripItem,
  ListInventoryParams,
  ListShipmentsParams,
  ListTripsParams,
} from '../types';
import type {
  CreateInventoryItemInput,
  AddMovementInput,
  CreateShipmentInput,
  TransitionShipmentInput,
  CreateTripInput,
  TransitionTripInput,
} from '../schemas/inventory';

export function useInventoryItems(params: ListInventoryParams = {}) {
  return useQuery({
    queryKey: inventoryKeys.itemList(params),
    queryFn: async (): Promise<InventoryItem[]> => {
      const sp = new URLSearchParams();
      if (params.limit) sp.set('limit', String(params.limit));
      if (params.offset) sp.set('offset', String(params.offset));
      if (params.category) sp.set('category', params.category);
      if (params.periodId) sp.set('periodId', params.periodId);
      if (params.picId) sp.set('picId', params.picId);

      const qs = sp.toString() ? `?${sp.toString()}` : '';
      const res = await fetch(`/api/v1/inventory${qs}`);
      if (!res.ok) {
        throw new Error('Gagal memuat katalog barang inventaris.');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useInventoryDetail(id: string | null) {
  return useQuery({
    queryKey: inventoryKeys.itemDetail(id || ''),
    queryFn: async (): Promise<InventoryDetail> => {
      if (!id) throw new Error('ID barang diperlukan.');
      const res = await fetch(`/api/v1/inventory/${id}`);
      if (!res.ok) {
        throw new Error('Gagal memuat detail barang inventaris.');
      }
      return res.json();
    },
    enabled: Boolean(id),
  });
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateInventoryItemInput): Promise<InventoryItem> => {
      const res = await fetch('/api/v1/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal mendaftarkan barang inventaris.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Barang inventaris posko berhasil didaftarkan.');
      queryClient.invalidateQueries({ queryKey: inventoryKeys.items() });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useAddMovement(inventoryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddMovementInput) => {
      const res = await fetch(`/api/v1/inventory/${inventoryId}/movements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal mencatat mutasi stok.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Mutasi stok barang berhasil dicatat.');
      queryClient.invalidateQueries({ queryKey: inventoryKeys.items() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.itemDetail(inventoryId) });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useShipments(params: ListShipmentsParams = {}) {
  return useQuery({
    queryKey: inventoryKeys.shipmentList(params),
    queryFn: async (): Promise<ShipmentItem[]> => {
      const sp = new URLSearchParams();
      if (params.limit) sp.set('limit', String(params.limit));
      if (params.offset) sp.set('offset', String(params.offset));
      if (params.status) sp.set('status', params.status);

      const qs = sp.toString() ? `?${sp.toString()}` : '';
      const res = await fetch(`/api/v1/logistics/shipments${qs}`);
      if (!res.ok) {
        throw new Error('Gagal memuat manifes pengiriman logistik.');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateShipmentInput): Promise<ShipmentItem> => {
      const res = await fetch('/api/v1/logistics/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal mendaftarkan manifes pengiriman.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Manifes pengiriman logistik berhasil didaftarkan.');
      queryClient.invalidateQueries({ queryKey: inventoryKeys.shipments() });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useTransitionShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: TransitionShipmentInput }) => {
      const res = await fetch(`/api/v1/logistics/shipments/${id}/transitions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal memperbarui status pengiriman.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Status pengiriman berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: inventoryKeys.shipments() });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useTrips(params: ListTripsParams = {}) {
  return useQuery({
    queryKey: inventoryKeys.tripList(params),
    queryFn: async (): Promise<TripItem[]> => {
      const sp = new URLSearchParams();
      if (params.limit) sp.set('limit', String(params.limit));
      if (params.offset) sp.set('offset', String(params.offset));
      if (params.status) sp.set('status', params.status);
      if (params.picId) sp.set('picId', params.picId);

      const qs = sp.toString() ? `?${sp.toString()}` : '';
      const res = await fetch(`/api/v1/logistics/trips${qs}`);
      if (!res.ok) {
        throw new Error('Gagal memuat jadwal perjalanan kendaraan.');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTripInput): Promise<TripItem> => {
      const res = await fetch('/api/v1/logistics/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal menjadwalkan perjalanan.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Jadwal perjalanan kendaraan berhasil dicatat.');
      queryClient.invalidateQueries({ queryKey: inventoryKeys.trips() });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useTransitionTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: TransitionTripInput }) => {
      const res = await fetch(`/api/v1/logistics/trips/${id}/transitions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal memperbarui status perjalanan.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Status perjalanan kendaraan berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: inventoryKeys.trips() });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
