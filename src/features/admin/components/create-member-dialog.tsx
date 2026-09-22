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
import { useCreateMember } from '../api/use-admin';
import { createMemberSchema } from '../schemas/admin';

interface CreateMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMemberDialog({
  isOpen,
  onClose,
}: CreateMemberDialogProps) {
  const dict = dictionary.admin.members.createDialog;
  const roleLabels = dictionary.roles;
  const createMutation = useCreateMember();
  const { data: divisions = [] } = useDivisions();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('SamudraKarsa2026!');
  const [selectedRole, setSelectedRole] = useState('member');
  const [divisionId, setDivisionId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parseResult = createMemberSchema.safeParse({
      fullName,
      email,
      password,
      roles: [selectedRole],
      divisionId: divisionId || null,
      periodId: null,
    });

    if (!parseResult.success) {
      setError(parseResult.error.issues[0]?.message || 'Data tidak valid');
      return;
    }

    try {
      await createMutation.mutateAsync(parseResult.data);
      setFullName('');
      setEmail('');
      setPassword('SamudraKarsa2026!');
      setSelectedRole('member');
      setDivisionId('');
      onClose();
    } catch {
      // Handled in mutation onError
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent id="create-member-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {dict.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-2.5 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="m-name" className="text-xs font-semibold">
              {dict.nameLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="m-name"
              placeholder={dict.namePlaceholder}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-9 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="m-email" className="text-xs font-semibold">
              {dict.emailLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="m-email"
              type="email"
              placeholder={dict.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="m-password" className="text-xs font-semibold">
              {dict.passwordLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="m-password"
              type="text"
              placeholder={dict.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9 text-sm font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="m-role" className="text-xs font-semibold">
              {dict.roleLabel} <span className="text-destructive">*</span>
            </Label>
            <select
              id="m-role"
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
            <Label htmlFor="m-division" className="text-xs font-semibold">
              {dict.divisionLabel}
            </Label>
            <select
              id="m-division"
              value={divisionId}
              onChange={(e) => setDivisionId(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">{dict.divisionPlaceholder}</option>
              {divisions.map((div) => (
                <option key={div.id} value={div.id}>
                  {div.name} ({div.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? dict.submittingButton : dict.submitButton}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
