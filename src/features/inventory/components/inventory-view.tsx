'use client';

import React, { useState } from 'react';
import {
  useInventoryItems,
  useShipments,
  useTrips,
  useTransitionShipment,
  useTransitionTrip,
} from '../api/use-inventory';
import { InventoryHeader, type InventoryTab } from './inventory-header';
import { InventoryTable } from './inventory-table';
import { InventoryDrawer } from './inventory-drawer';
import { MovementTable } from './movement-table';
import { ShipmentTable } from './shipment-table';
import { TripTable } from './trip-table';
import { CreateInventoryDialog } from './create-inventory-dialog';
import { AddMovementDialog } from './add-movement-dialog';
import { CreateShipmentDialog } from './create-shipment-dialog';
import { CreateTripDialog } from './create-trip-dialog';
import type { InventoryItem, ShipmentStatus, TripStatus } from '../types';

export function InventoryView() {
  const [activeTab, setActiveTab] = useState<InventoryTab>('catalog');
  const [search, setSearch] = useState('');

  // Selected item for drawer
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Dialog states
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
  const [isAddMovementOpen, setIsAddMovementOpen] = useState(false);
  const [movementTargetItem, setMovementTargetItem] = useState<InventoryItem | null>(null);
  const [isCreateShipmentOpen, setIsCreateShipmentOpen] = useState(false);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);

  // Queries
  const { data: inventoryItems = [], isLoading: isLoadingItems } = useInventoryItems();
  const { data: shipments = [], isLoading: isLoadingShipments } = useShipments();
  const { data: trips = [], isLoading: isLoadingTrips } = useTrips();

  // Mutations
  const transitionShipmentMutation = useTransitionShipment();
  const transitionTripMutation = useTransitionTrip();

  // Calculate metrics
  const totalItems = inventoryItems.length;
  const lowStockCount = inventoryItems.filter((i) => i.currentStock <= 2).length;
  const borrowedCount = inventoryItems.filter((i) => i.currentStock < i.initialStock).length;
  const activeShipmentsCount = shipments.filter(
    (s) => s.status === 'processing' || s.status === 'shipped'
  ).length;

  // Handle header primary action click
  const handlePrimaryAction = () => {
    switch (activeTab) {
      case 'catalog':
        setIsCreateItemOpen(true);
        break;
      case 'movements':
        if (inventoryItems.length > 0) {
          setMovementTargetItem(inventoryItems[0]);
          setIsAddMovementOpen(true);
        } else {
          setIsCreateItemOpen(true);
        }
        break;
      case 'logistics':
        setIsCreateShipmentOpen(true);
        break;
    }
  };

  const handleOpenAddMovement = (item: InventoryItem) => {
    setMovementTargetItem(item);
    setIsAddMovementOpen(true);
  };

  const handleTransitionShipment = (id: string, to: ShipmentStatus) => {
    transitionShipmentMutation.mutate({ id, payload: { to } });
  };

  const handleTransitionTrip = (id: string, to: TripStatus) => {
    transitionTripMutation.mutate({ id, payload: { to } });
  };

  return (
    <div className="space-y-6">
      <InventoryHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalItems={totalItems}
        lowStockCount={lowStockCount}
        borrowedCount={borrowedCount}
        activeShipmentsCount={activeShipmentsCount}
        onOpenCreate={handlePrimaryAction}
      />

      {/* Tab: Catalog Posko */}
      {activeTab === 'catalog' && (
        <InventoryTable
          items={inventoryItems}
          isLoading={isLoadingItems}
          onSelectItem={setSelectedItem}
          search={search}
          onSearchChange={setSearch}
        />
      )}

      {/* Tab: Riwayat Mutasi */}
      {activeTab === 'movements' && (
        <MovementTable
          movements={[]}
          isLoading={isLoadingItems}
        />
      )}

      {/* Tab: Logistik & Ekspedisi */}
      {activeTab === 'logistics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">
              Manifes Koli & Pengiriman
            </h3>
            <button
              type="button"
              onClick={() => setIsCreateShipmentOpen(true)}
              className="text-xs text-primary font-medium hover:underline"
            >
              + Tambah Pengiriman
            </button>
          </div>

          <ShipmentTable
            shipments={shipments}
            isLoading={isLoadingShipments}
            onTransition={handleTransitionShipment}
            isTransitioning={transitionShipmentMutation.isPending}
          />

          <div className="flex items-center justify-between pt-4">
            <h3 className="text-base font-semibold text-foreground">
              Jadwal Perjalanan & Kendaraan
            </h3>
            <button
              type="button"
              onClick={() => setIsCreateTripOpen(true)}
              className="text-xs text-primary font-medium hover:underline"
            >
              + Jadwalkan Perjalanan
            </button>
          </div>

          <TripTable
            trips={trips}
            isLoading={isLoadingTrips}
            onTransition={handleTransitionTrip}
            isTransitioning={transitionTripMutation.isPending}
          />
        </div>
      )}

      {/* Slide-over Drawer for Item Details */}
      <InventoryDrawer
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        onOpenAddMovement={handleOpenAddMovement}
      />

      {/* Modals */}
      <CreateInventoryDialog
        isOpen={isCreateItemOpen}
        onClose={() => setIsCreateItemOpen(false)}
      />

      <AddMovementDialog
        item={movementTargetItem}
        isOpen={isAddMovementOpen}
        onClose={() => {
          setIsAddMovementOpen(false);
          setMovementTargetItem(null);
        }}
      />

      <CreateShipmentDialog
        isOpen={isCreateShipmentOpen}
        onClose={() => setIsCreateShipmentOpen(false)}
      />

      <CreateTripDialog
        isOpen={isCreateTripOpen}
        onClose={() => setIsCreateTripOpen(false)}
      />
    </div>
  );
}
