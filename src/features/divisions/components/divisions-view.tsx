'use client';

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import {
  useDivisionsList,
  useClustersList,
  useSubunitsList,
  useDivisionMembers,
} from '../api/use-divisions';
import { useCurrentUser } from '@/features/auth/api/use-queries';
import { DivisionsHeader, type DivisionsTab } from './divisions-header';
import { DivisionCard } from './division-card';
import { DivisionDrawer } from './division-drawer';
import { ClustersTab } from './clusters-tab';
import { SubunitsTab } from './subunits-tab';
import { CreateDivisionDialog } from './create-division-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import type { Division } from '../types';
import { id as dictionary } from '@/lib/dictionaries/id';

export function DivisionsView() {
  const dict = dictionary.divisions;

  const [activeTab, setActiveTab] = useState<DivisionsTab>('divisions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: user } = useCurrentUser();
  const { data: divisions = [], isLoading: isLoadingDivisions } = useDivisionsList();
  const { data: clusters = [], isLoading: isLoadingClusters } = useClustersList();
  const { data: subunits = [], isLoading: isLoadingSubunits } = useSubunitsList();
  const { data: members = [] } = useDivisionMembers();

  const canCreate = Boolean(
    user?.roles?.some((role) => role === 'owner' || role === 'co_owner')
  );

  const handleSelectDivision = (division: Division) => {
    setSelectedDivision(division);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDivision(null);
  };

  const filteredDivisions = divisions.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <DivisionsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        canCreate={canCreate}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      {/* Tab: Divisions */}
      {activeTab === 'divisions' && (
        <div className="space-y-4">
          {isLoadingDivisions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-56 rounded-xl bg-muted/40 animate-pulse border border-border/50"
                />
              ))}
            </div>
          ) : filteredDivisions.length === 0 ? (
            <EmptyState
              icon={Layers}
              title={dict.emptyTitle}
              description={dict.emptyDescription}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDivisions.map((division) => (
                <DivisionCard
                  key={division.id}
                  division={division}
                  members={members}
                  onSelect={handleSelectDivision}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Clusters */}
      {activeTab === 'clusters' && (
        <ClustersTab
          clusters={clusters}
          members={members}
          searchQuery={searchQuery}
          isLoading={isLoadingClusters}
        />
      )}

      {/* Tab: Subunits */}
      {activeTab === 'subunits' && (
        <SubunitsTab
          subunits={subunits}
          members={members}
          searchQuery={searchQuery}
          isLoading={isLoadingSubunits}
        />
      )}

      {/* Division Profile Sheet / Drawer */}
      <DivisionDrawer
        division={selectedDivision}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        members={members}
      />

      {/* Create Division Modal */}
      <CreateDivisionDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        nextSortOrder={(divisions.length + 1) * 10}
      />
    </div>
  );
}
