'use client';

import React from 'react';
import { Users, Trash2, ShieldAlert, Activity } from 'lucide-react';
import { id as dictionary } from '@/lib/dictionaries/id';
import type { AdminTab } from '../types';

interface AdminHeaderProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  metrics: {
    activeMembers: number;
    inactiveMembers: number;
    recycledItems: number;
    auditEntriesCount: number;
  };
}

export function AdminHeader({
  currentTab,
  onTabChange,
  metrics,
}: AdminHeaderProps) {
  const dict = dictionary.admin;

  const tabs: { key: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'members', label: dict.tabs.members, icon: Users },
    { key: 'recycle-bin', label: dict.tabs.recycleBin, icon: Trash2 },
    { key: 'audit', label: dict.tabs.audit, icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {dict.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {dict.subtitle}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              {dict.metrics.activeMembers}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {metrics.activeMembers}
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              {dict.metrics.inactiveMembers}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {metrics.inactiveMembers}
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              {dict.metrics.recycledItems}
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {metrics.recycledItems}
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Trash2 className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              {dict.metrics.auditEntriesToday}
            </p>
            <p className="text-2xl font-bold text-primary">
              {metrics.auditEntriesCount}
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Activity className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-border/70 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                isActive
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
