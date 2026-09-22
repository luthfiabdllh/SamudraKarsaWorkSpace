'use client';

import React, { useState } from 'react';
import { useMeetings } from '../api/use-meetings';
import { MeetingHeader } from './meeting-header';
import { MeetingTable } from './meeting-table';
import { MeetingDrawer } from './meeting-drawer';
import { CreateMeetingDialog } from './create-meeting-dialog';
import { CreateDecisionDialog } from './create-decision-dialog';
import type { MeetingItem } from '../types';

export function MeetingView() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Selected meeting for drawer
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingItem | null>(null);

  // Dialog states
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);
  const [isAddDecisionOpen, setIsAddDecisionOpen] = useState(false);
  const [decisionTargetMeeting, setDecisionTargetMeeting] = useState<MeetingItem | null>(null);

  // Query
  const { data: meetings = [], isLoading } = useMeetings();

  const handleOpenAddDecision = (meeting: MeetingItem) => {
    setDecisionTargetMeeting(meeting);
    setIsAddDecisionOpen(true);
  };

  return (
    <div className="space-y-6">
      <MeetingHeader onOpenCreate={() => setIsCreateMeetingOpen(true)} />

      <MeetingTable
        meetings={meetings}
        isLoading={isLoading}
        onSelectMeeting={setSelectedMeeting}
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      {/* Slide-over Drawer for Meeting Details & Notulensi */}
      <MeetingDrawer
        meeting={selectedMeeting}
        isOpen={Boolean(selectedMeeting)}
        onClose={() => setSelectedMeeting(null)}
        onOpenAddDecision={handleOpenAddDecision}
      />

      {/* Modals */}
      <CreateMeetingDialog
        isOpen={isCreateMeetingOpen}
        onClose={() => setIsCreateMeetingOpen(false)}
      />

      <CreateDecisionDialog
        meeting={decisionTargetMeeting}
        isOpen={isAddDecisionOpen}
        onClose={() => {
          setIsAddDecisionOpen(false);
          setDecisionTargetMeeting(null);
        }}
      />
    </div>
  );
}
