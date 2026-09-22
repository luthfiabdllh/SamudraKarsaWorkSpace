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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { id as dictionary } from '@/lib/dictionaries/id';
import { useAdminMembers, useUpdateMember } from '../api/use-admin';
import { useDivisions } from '@/features/requests/api/use-requests';
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

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('');
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
      // handled
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
      const matchStatus = !statusFilter || m.status === statusFilter;

      return matchSearch && matchRole && matchDivision && matchStatus;
    });
  }, [members, search, roleFilter, divisionFilter, statusFilter]);

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
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
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
          type="button"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="gap-1.5 shrink-0 text-xs font-semibold shadow-xs"
        >
          <UserPlus className="h-4 w-4" />
          <span>{dict.createMember}</span>
        </Button>
      </div>

      {/* Members Table */}
      <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/70 text-[11px]">
              <tr>
                <th className="px-4 py-3">{dict.table.name}</th>
                <th className="px-4 py-3">{dict.table.roles}</th>
                <th className="px-4 py-3">{dict.table.division}</th>
                <th className="px-4 py-3">{dict.table.status}</th>
                <th className="px-4 py-3">{dict.table.lastLogin}</th>
                <th className="px-4 py-3 text-right">{dict.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Memuat data anggota...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {dict.emptyTitle}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {dict.emptyDescription}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">
                        {m.fullName}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {m.email}
                      </div>
                    </td>

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

                    <td className="px-4 py-3 text-muted-foreground">
                      {m.divisionName ? (
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span>{m.divisionName}</span>
                        </div>
                      ) : (
                        <span className="italic text-muted-foreground/60">-</span>
                      )}
                    </td>

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

                    <td className="px-4 py-3 text-muted-foreground text-[11px]">
                      {m.lastLoginAt ? new Date(m.lastLoginAt).toLocaleDateString('id-ID') : 'Belum pernah'}
                    </td>

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
                          className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
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
                              ? 'text-destructive/80 hover:text-destructive hover:bg-destructive/10'
                              : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10'
                          }`}
                          title={m.status === 'active' ? dict.actions.deactivate : dict.actions.activate}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Modals */}
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
