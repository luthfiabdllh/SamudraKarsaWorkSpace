import type {
  ListInventoryParams,
  ListShipmentsParams,
  ListTripsParams,
} from '../types';

export const inventoryKeys = {
  all: ['inventory'] as const,
  items: () => [...inventoryKeys.all, 'items'] as const,
  itemList: (filters: ListInventoryParams = {}) =>
    [...inventoryKeys.items(), filters] as const,
  itemDetails: () => [...inventoryKeys.all, 'item-detail'] as const,
  itemDetail: (id: string) => [...inventoryKeys.itemDetails(), id] as const,

  shipments: () => ['logistics', 'shipments'] as const,
  shipmentList: (filters: ListShipmentsParams = {}) =>
    [...inventoryKeys.shipments(), filters] as const,
  shipmentDetail: (id: string) => [...inventoryKeys.shipments(), id] as const,

  trips: () => ['logistics', 'trips'] as const,
  tripList: (filters: ListTripsParams = {}) =>
    [...inventoryKeys.trips(), filters] as const,
  tripDetail: (id: string) => [...inventoryKeys.trips(), id] as const,
};
