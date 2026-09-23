'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  KeyRound,
  Edit2,
  UserX,
  UserCheck,
  Shield,
  Building,
  GraduationCap,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { id as dictionary } from '@/lib/dictionaries/id';
import { useAdminMembers, useUpdateMember } from '../api/use-admin';
import { useDivisions } from '@/features/requests/api/use-requests';
import { useClustersList, useSubunitsList } from '@/features/divisions';
import { CreateMemberDialog } from './create-member-dialog';
import { EditMemberDialog } from './edit-member-dialog';
import { ResetPasswordDialog } from './reset-password-dialog';
import type { AdminMemberItem } from '../types';

export function MembersTab() {
  const dict = dictionary.admin.members;
  const roleLabels = dictionary.roles;
  const statusLabels = dictionary.statuses.members;

  const { data: members = [], isLoading } = useAdminMembers();
  const { data: divisions = [] } = useDivisions();
  const { data: clusters = [] } = useClustersList();
  const { data: subunits = [] } = useSubunitsList();

  const divisionMap = useMemo(() => new Map(divisions.map((d) => [d.id, d.name])), [divisions]);
  const clusterMap = useMemo(() => new Map(clusters.map((c) => [c.id, c.name])), [clusters]);
  const subunitMap = useMemo(() => new Map(subunits.map((s) => [s.id, s.name])), [subunits]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  const [subunitFilter, setSubunitFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState<AdminMemberItem | null>(null);
  const [selectedMemberForReset, setSelectedMemberForReset] = useState<AdminMemberItem | null>(null);

  const updateMutation = useUpdateMember('');

  // Toggle active/inactive
  const handleToggleStatus = async (member: AdminMemberItem) => {
    const nextStatus = member.status === 'active' ? 'inactive' : 'active';
    const confirmMsg =
      nextStatus === 'inactive'
        ? `Apakah Anda yakin ingin menonaktifkan akun ${member.fullName}?`
        : `Aktifkan kembali akun ${member.fullName}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await updateMutation.mutateAsync({ status: nextStatus });
    } catch {
      // handled in mutation
    }
  };

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        !search ||
        m.fullName.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase());

      const matchRole = !roleFilter || m.roles.includes(roleFilter);
      const matchDivision = !divisionFilter || m.divisionId === divisionFilter;
      const matchCluster = !clusterFilter || m.clusterId === clusterFilter;
      const matchSubunit = !subunitFilter || m.subunitId === subunitFilter;
      const matchStatus = !statusFilter || m.status === statusFilter;

      return matchSearch && matchRole && matchDivision && matchCluster && matchSubunit && matchStatus;
    });
  }, [members, search, roleFilter, divisionFilter, clusterFilter, subunitFilter, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Action & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-50 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={dict.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">{dict.filterRole}</option>
            <option value="owner">{roleLabels.owner}</option>
            <option value="co_owner">{roleLabels.co_owner}</option>
            <option value="division_head">{roleLabels.division_head}</option>
            <option value="division_deputy">{roleLabels.division_deputy}</option>
            <option value="member">{roleLabels.member}</option>
          </select>

          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">{dict.filterDivision}</option>
            {divisions.map((div) => (
              <option key={div.id} value={div.id}>
                {div.name}
              </option>
            ))}
          </select>

          <select
            value={clusterFilter}
            onChange={(e) => setClusterFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">{dict.filterCluster}</option>
            {clusters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={subunitFilter}
            onChange={(e) => setSubunitFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">{dict.filterSubunit}</option>
            {subunits.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">{dict.filterStatus}</option>
            <option value="active">{statusLabels.active}</option>
            <option value="inactive">{statusLabels.inactive}</option>
          </select>
        </div>

        <Button
          id="btn-add-member"
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 shrink-0 h-9 text-xs"
        >
          <UserPlus className="h-4 w-4" />
          <span>{dict.createMember}</span>
        </Button>
      </div>

      {/* Table Data */}
      <div className="rounded-xl border border-border bg-card/60 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="px-4 py-3">{dict.table.name}</th>
                <th className="px-4 py-3">{dict.table.roles}</th>
                <th className="px-4 py-3">{dict.table.division}</th>
                <th className="px-4 py-3">{dict.table.cluster}</th>
                <th className="px-4 py-3">{dict.table.subunit}</th>
                <th className="px-4 py-3">{dict.table.status}</th>
                <th className="px-4 py-3 text-right">{dict.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Memuat data anggota...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {dict.emptyTitle}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {dict.emptyDescription}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => {
                  const divName = m.divisionName || (m.divisionId ? divisionMap.get(m.divisionId) : null);
                  const clustName = m.clusterName || (m.clusterId ? clusterMap.get(m.clusterId) : null);
                  const subName = m.subunitName || (m.subunitId ? subunitMap.get(m.subunitId) : null);

                  return (
                    <tr key={m.id} className="hover:bg-muted/40 transition-colors">
                      {/* Name & Email */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">{m.fullName}</span>
                          {m.nickname && (
                            <span className="text-xs text-muted-foreground font-normal">
                              ({m.nickname})
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {m.email} {m.phone && <span>&bull; {m.phone}</span>}
                        </div>
                        {(m.facultyMajor || m.batchYear) && (
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {[m.facultyMajor, m.batchYear ? `'${m.batchYear.slice(-2)}` : null]
                              .filter(Boolean)
                              .join(' ')}
                          </div>
                        )}
                        {m.teamRole && (
                          <div className="text-[10px] text-primary/80 italic mt-0.5">
                            {m.teamRole}
                          </div>
                        )}
                      </td>

                      {/* Primary Role */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {m.roles.map((r) => (
                            <Badge
                              key={r}
                              variant={r === 'owner' ? 'default' : 'secondary'}
                              className="text-[10px] font-medium py-0"
                            >
                              <Shield className="h-2.5 w-2.5 mr-1" />
                              {roleLabels[r as keyof typeof roleLabels] || r}
                            </Badge>
                          ))}
                        </div>
                      </td>

                      {/* Division */}
                      <td className="px-4 py-3 text-muted-foreground">
                        {divName ? (
                          <div className="flex items-center gap-1 font-medium text-foreground">
                            <Building className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span>{divName}</span>
                          </div>
                        ) : (
                          <span className="italic text-muted-foreground/60">BPH / Global</span>
                        )}
                      </td>

                      {/* Cluster & Kormater Badge */}
                      <td className="px-4 py-3 text-muted-foreground">
                        <div className="space-y-1">
                          {clustName ? (
                            <div className="flex items-center gap-1 font-medium text-foreground">
                              <GraduationCap className="h-3 w-3 text-primary shrink-0" />
                              <span>{clustName}</span>
                            </div>
                          ) : (
                            <span className="italic text-muted-foreground/60">-</span>
                          )}
                          {m.isKormater && (
                            <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[9px] py-0 gap-0.5">
                              <Sparkles className="h-2.5 w-2.5" />
                              Kormater
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Subunit & Kormasit Badge */}
                      <td className="px-4 py-3 text-muted-foreground">
                        <div className="space-y-1">
                          {subName ? (
                            <div className="flex items-center gap-1 font-medium text-foreground">
                              <MapPin className="h-3 w-3 text-emerald-500 shrink-0" />
                              <span>{subName}</span>
                            </div>
                          ) : (
                            <span className="italic text-muted-foreground/60">-</span>
                          )}
                          {m.isKormasit && (
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[9px] py-0 gap-0.5">
                              <Sparkles className="h-2.5 w-2.5" />
                              Kormasit
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <Badge
                          variant={m.status === 'active' ? 'default' : 'outline'}
                          className={`text-[10px] font-semibold ${
                            m.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                              : 'text-muted-foreground border-border'
                          }`}
                        >
                          {statusLabels[m.status]}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title={dict.actions.edit}
                            onClick={() => setSelectedMemberForEdit(m)}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title={dict.actions.resetPassword}
                            onClick={() => setSelectedMemberForReset(m)}
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={`h-7 w-7 ${
                              m.status === 'active'
                                ? 'text-muted-foreground hover:text-destructive'
                                : 'text-emerald-600 hover:text-emerald-700'
                            }`}
                            title={
                              m.status === 'active'
                                ? dict.actions.deactivate
                                : dict.actions.activate
                            }
                            onClick={() => handleToggleStatus(m)}
                          >
                            {m.status === 'active' ? (
                              <UserX className="h-3.5 w-3.5" />
                            ) : (
                              <UserCheck className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs */}
      <CreateMemberDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditMemberDialog
        member={selectedMemberForEdit}
        isOpen={Boolean(selectedMemberForEdit)}
        onClose={() => setSelectedMemberForEdit(null)}
      />

      <ResetPasswordDialog
        member={selectedMemberForReset}
        isOpen={Boolean(selectedMemberForReset)}
        onClose={() => setSelectedMemberForReset(null)}
      />
    </div>
  );
}
