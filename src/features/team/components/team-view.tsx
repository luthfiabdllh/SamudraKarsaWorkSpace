'use client';

import React, { useState } from 'react';
import { useAnnouncements, useFeedbackList } from '../api/use-team';
import { TeamHeader, type TeamTab } from './team-header';
import { AnnouncementFeed } from './announcement-feed';
import { FeedbackList } from './feedback-list';
import { CreateAnnouncementDialog } from './create-announcement-dialog';
import { CreateFeedbackDialog } from './create-feedback-dialog';

export function TeamView() {
  const [activeTab, setActiveTab] = useState<TeamTab>('announcements');

  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);
  const [isCreateFeedbackOpen, setIsCreateFeedbackOpen] = useState(false);

  const { data: announcements = [], isLoading: isLoadingAnnouncements } = useAnnouncements();
  const { data: feedback = [], isLoading: isLoadingFeedback } = useFeedbackList();

  const handleOpenCreate = () => {
    if (activeTab === 'announcements') {
      setIsCreateAnnouncementOpen(true);
    } else {
      setIsCreateFeedbackOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <TeamHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCreate={handleOpenCreate}
      />

      {activeTab === 'announcements' ? (
        <AnnouncementFeed
          announcements={announcements}
          isLoading={isLoadingAnnouncements}
        />
      ) : (
        <FeedbackList
          feedback={feedback}
          isLoading={isLoadingFeedback}
        />
      )}

      {/* Modals */}
      <CreateAnnouncementDialog
        isOpen={isCreateAnnouncementOpen}
        onClose={() => setIsCreateAnnouncementOpen(false)}
      />

      <CreateFeedbackDialog
        isOpen={isCreateFeedbackOpen}
        onClose={() => setIsCreateFeedbackOpen(false)}
      />
    </div>
  );
}
