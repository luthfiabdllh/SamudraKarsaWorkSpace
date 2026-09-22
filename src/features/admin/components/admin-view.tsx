'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { id as dictionary } from '@/lib/dictionaries/id';
import { AdminHeader } from './admin-header';
import { MembersTab } from './members-tab';
import { RecycleBinTab } from './recycle-bin-tab';
import { AuditLogsTab } from './audit-logs-tab';
import { useAdminMembers, useRecycleBinItems, useAuditLogs } from '../api/use-admin';
import type { AdminTab } from '../types';

interface AdminViewProps {
  userRoles?: readonly string[];
}

export function AdminView({ userRoles = [] }: AdminViewProps) {
  // Authorization: Only owner or co_owner can access the Back-Office administration
  const isAuthorized = useMemo(() => {
    return userRoles.some((r) => ['owner', 'co_owner'].includes(r));
  }, [userRoles]);

  const [currentTab, setCurrentTab] = useState<AdminTab>('members');

  // Queries for live metrics
  const { data: members = [] } = useAdminMembers();
  const { data: recycleItems = [] } = useRecycleBinItems('work_items');
  const { data: auditLogs = [] } = useAuditLogs();

  const metrics = useMemo(() => {
    const active = members.filter((m) => m.status === 'active').length;
    const inactive = members.filter((m) => m.status === 'inactive').length;
    return {
      activeMembers: active,
      inactiveMembers: inactive,
      recycledItems: recycleItems.length,
      auditEntriesCount: auditLogs.length,
    };
  }, [members, recycleItems, auditLogs]);

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 max-w-md shadow-xs space-y-4">
          <div className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              {dictionary.errors.forbidden.title}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {dictionary.errors.forbidden.description}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span>{dictionary.errors.forbidden.backHome}</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <AdminHeader
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        metrics={metrics}
      />

      {currentTab === 'members' && <MembersTab />}
      {currentTab === 'recycle-bin' && <RecycleBinTab />}
      {currentTab === 'audit' && <AuditLogsTab />}
    </div>
  );
}
