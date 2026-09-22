'use client';

import React from 'react';
import { Users, Megaphone, MessageSquarePlus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { id as dictionary } from '@/lib/dictionaries/id';

export type TeamTab = 'announcements' | 'feedback';

interface TeamHeaderProps {
  activeTab: TeamTab;
  onTabChange: (tab: TeamTab) => void;
  onOpenCreate: () => void;
}

export function TeamHeader({
  activeTab,
  onTabChange,
  onOpenCreate,
}: TeamHeaderProps) {
  const dict = dictionary.team;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Users className="h-7 w-7 text-primary shrink-0" aria-hidden="true" />
            {dict.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {dict.subtitle}
          </p>
        </div>

        <Button
          id="team-primary-action-btn"
          onClick={onOpenCreate}
          className="gap-2 shadow-sm shrink-0"
        >
          <Plus size={16} aria-hidden="true" />
          <span>
            {activeTab === 'announcements'
              ? dict.announcements.createButton
              : dict.feedback.submitButton}
          </span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/80 gap-6">
        <button
          type="button"
          onClick={() => onTabChange('announcements')}
          className={`pb-2.5 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'announcements'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Megaphone size={16} />
          {dict.tabs.announcements}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('feedback')}
          className={`pb-2.5 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'feedback'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquarePlus size={16} />
          {dict.tabs.feedback}
        </button>
      </div>
    </div>
  );
}
