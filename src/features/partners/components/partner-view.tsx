'use client';

import React, { useState } from 'react';
import { usePartners } from '../api/use-partners';
import { PartnerHeader } from './partner-header';
import { PartnerTable } from './partner-table';
import { PartnerDrawer } from './partner-drawer';
import { CreatePartnerDialog } from './create-partner-dialog';
import { AddBenefitDialog } from './add-benefit-dialog';
import type { PartnerItem } from '../types';

export function PartnerView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected partner for drawer
  const [selectedPartner, setSelectedPartner] = useState<PartnerItem | null>(null);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddBenefitOpen, setIsAddBenefitOpen] = useState(false);
  const [benefitTargetPartner, setBenefitTargetPartner] = useState<PartnerItem | null>(null);

  // Query
  const { data: partners = [], isLoading } = usePartners();

  // Metrics
  const totalPartners = partners.length;
  const totalTarget = partners.reduce(
    (sum, p) => sum + (p.targetSupport ? Number(p.targetSupport) : 0),
    0
  );
  const totalReceived = partners.reduce(
    (sum, p) => sum + (p.fundReceived ? Number(p.fundReceived) : 0),
    0
  );
  const activeProspects = partners.filter(
    (p) =>
      p.status === 'prospect' ||
      p.status === 'initial_contact' ||
      p.status === 'follow_up' ||
      p.status === 'negotiation'
  ).length;

  const handleOpenAddBenefit = (partner: PartnerItem) => {
    setBenefitTargetPartner(partner);
    setIsAddBenefitOpen(true);
  };

  return (
    <div className="space-y-6">
      <PartnerHeader
        totalPartners={totalPartners}
        totalTarget={totalTarget}
        totalReceived={totalReceived}
        activeProspects={activeProspects}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      <PartnerTable
        partners={partners}
        isLoading={isLoading}
        onSelectPartner={setSelectedPartner}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Slide-over Drawer for Partner Details */}
      <PartnerDrawer
        partner={selectedPartner}
        isOpen={Boolean(selectedPartner)}
        onClose={() => setSelectedPartner(null)}
        onOpenAddBenefit={handleOpenAddBenefit}
      />

      {/* Modals */}
      <CreatePartnerDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <AddBenefitDialog
        partner={benefitTargetPartner}
        isOpen={isAddBenefitOpen}
        onClose={() => {
          setIsAddBenefitOpen(false);
          setBenefitTargetPartner(null);
        }}
      />
    </div>
  );
}
