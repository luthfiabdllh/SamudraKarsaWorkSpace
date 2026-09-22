'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { id as dictionary } from '@/lib/dictionaries/id';
import { useDivisions } from '@/features/requests/api/use-requests';
import { useUpdateMember } from '../api/use-admin';
import type { AdminMemberItem, MemberAccountStatus } from '../types';

interface EditMemberDialogProps {
  member: AdminMemberItem | null;
  isOpen: boolean;
  onClose: () => void;
}

interface EditMemberFormProps {
  member: AdminMemberItem;
  onClose: () => void;
}

function EditMemberForm({ member, onClose }: EditMemberFormProps) {
  const dict = dictionary.admin.members.editDialog;
  const roleLabels = dictionary.roles;
  const statusLabels = dictionary.statuses.members;
  const updateMutation = useUpdateMember(member.id);
  const { data: divisions = [] } = useDivisions();

  const [fullName, setFullName] = useState(member.fullName);
  const [selectedRole, setSelectedRole] = useState(member.roles[0] || 'member');
  const [divisionId, setDivisionId] = useState(member.divisionId || '');
  const [status, setStatus] = useState<MemberAccountStatus>(member.status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync({
        fullName: fullName.trim() || undefined,
        roles: [selectedRole],
        divisionId: divisionId || null,
        status,
      });
      onClose();
    } catch {
      // Handled in mutation onError
    }
  };

  return (
    <DialogContent id="edit-member-modal" className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{dict.title}</DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground">
          {dict.description} ({member.email})
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <Label htmlFor="edit-name" className="text-xs font-semibold">
            {dict.nameLabel}
          </Label>
          <Input
            id="edit-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-9 text-sm"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-role" className="text-xs font-semibold">
            {dict.rolesLabel}
          </Label>
          <select
            id="edit-role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="member">{roleLabels.member}</option>
            <option value="division_deputy">{roleLabels.division_deputy}</option>
            <option value="division_head">{roleLabels.division_head}</option>
            <option value="co_owner">{roleLabels.co_owner}</option>
            <option value="owner">{roleLabels.owner}</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-division" className="text-xs font-semibold">
            {dict.divisionLabel}
          </Label>
          <select
            id="edit-division"
            value={divisionId}
            onChange={(e) => setDivisionId(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Tidak terafiliasi divisi khusus</option>
            {divisions.map((div) => (
              <option key={div.id} value={div.id}>
                {div.name} ({div.code})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-status" className="text-xs font-semibold">
            {dict.statusLabel}
          </Label>
          <select
            id="edit-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as MemberAccountStatus)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="active">{statusLabels.active}</option>
            <option value="inactive">{statusLabels.inactive}</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border/70">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Batal
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? dict.submittingButton : dict.submitButton}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

export function EditMemberDialog({
  member,
  isOpen,
  onClose,
}: EditMemberDialogProps) {
  if (!isOpen || !member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <EditMemberForm key={member.id} member={member} onClose={onClose} />
    </Dialog>
  );
}
