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
import { useClustersList, useSubunitsList } from '@/features/divisions';
import { useUpdateMember } from '../api/use-admin';
import type { AdminMemberItem } from '../types';

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
  const updateMutation = useUpdateMember(member.id, member.version);
  const { data: divisions = [] } = useDivisions();
  const { data: clusters = [] } = useClustersList();
  const { data: subunits = [] } = useSubunitsList();

  const [fullName, setFullName] = useState(member.fullName);
  const [nickname, setNickname] = useState(member.nickname || '');
  const [photoUrl, setPhotoUrl] = useState(member.photoUrl || '');
  const [phone, setPhone] = useState(member.phone || '');
  const [facultyMajor, setFacultyMajor] = useState(member.facultyMajor || '');
  const [batchYear, setBatchYear] = useState(member.batchYear || '');
  const [selectedRole, setSelectedRole] = useState(member.roles[0] || 'member');
  const [divisionId, setDivisionId] = useState(member.divisionId || '');
  const [clusterId, setClusterId] = useState(member.clusterId || '');
  const [subunitId, setSubunitId] = useState(member.subunitId || '');
  const [teamRole, setTeamRole] = useState(member.teamRole || '');
  const [isKormater, setIsKormater] = useState(Boolean(member.isKormater));
  const [isKormasit, setIsKormasit] = useState(Boolean(member.isKormasit));
  const [status, setStatus] = useState<'active' | 'inactive'>(
    member.status === 'inactive' ? 'inactive' : 'active'
  );

  // Additional Rich Profile Fields
  const [emergencyContactName, setEmergencyContactName] = useState(member.emergencyContactName || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(member.emergencyContactPhone || '');
  const [instagram, setInstagram] = useState(member.socialLinks?.instagram || '');
  const [linkedin, setLinkedin] = useState(member.socialLinks?.linkedin || '');
  const [github, setGithub] = useState(member.socialLinks?.github || '');
  const [website, setWebsite] = useState(member.socialLinks?.website || '');
  const [skills, setSkills] = useState((member.skills || []).join(', '));
  const [hobbies, setHobbies] = useState((member.hobbies || []).join(', '));
  const [availabilityNote, setAvailabilityNote] = useState(member.availabilityNote || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync({
        version: member.version,
        fullName: fullName.trim() || undefined,
        nickname: nickname.trim() || null,
        photoUrl: photoUrl.trim() || null,
        phone: phone.trim() || null,
        facultyMajor: facultyMajor.trim() || null,
        batchYear: batchYear.trim() || null,
        roles: [selectedRole],
        divisionId: divisionId || null,
        clusterId: clusterId || null,
        subunitId: subunitId || null,
        teamRole: teamRole.trim() || null,
        isKormasit,
        isKormater,
        status,
        emergencyContactName: emergencyContactName.trim() || null,
        emergencyContactPhone: emergencyContactPhone.trim() || null,
        socialLinks: {
          instagram: instagram.trim() || null,
          linkedin: linkedin.trim() || null,
          github: github.trim() || null,
          website: website.trim() || null,
        },
        skills: skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        hobbies: hobbies ? hobbies.split(',').map((s) => s.trim()).filter(Boolean) : [],
        availabilityNote: availabilityNote.trim() || null,
      });
      onClose();
    } catch {
      // Handled in mutation onError
    }
  };

  return (
    <DialogContent id="edit-member-modal" className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{dict.title}</DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground">
          {dict.description} ({member.email}) &bull; Versi: {member.version}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Identitas Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name" className="text-xs font-semibold">
              {dict.nameLabel} *
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
            <Label htmlFor="edit-nickname" className="text-xs font-semibold">
              Nama Panggilan
            </Label>
            <Input
              id="edit-nickname"
              placeholder="misal: Bagas, Dwi"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="edit-phone" className="text-xs font-semibold">
              No. Telepon / WhatsApp
            </Label>
            <Input
              id="edit-phone"
              placeholder="+62 812-xxxx-xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-status" className="text-xs font-semibold">
              {dict.statusLabel}
            </Label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {member.status === 'invited' && (
                <option value="invited" disabled>
                  {statusLabels.invited} (Belum Diaktivasi)
                </option>
              )}
              <option value="active">{statusLabels.active}</option>
              <option value="inactive">{statusLabels.inactive}</option>
            </select>
          </div>
        </div>

        {/* Akademik & Foto */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="edit-faculty-major" className="text-xs font-semibold">
              Fakultas / Program Studi
            </Label>
            <Input
              id="edit-faculty-major"
              placeholder="misal: Teknik Elektro / Ilmu Komputer"
              value={facultyMajor}
              onChange={(e) => setFacultyMajor(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-batch-year" className="text-xs font-semibold">
              Angkatan (Tahun)
            </Label>
            <Input
              id="edit-batch-year"
              placeholder="2023"
              value={batchYear}
              onChange={(e) => setBatchYear(e.target.value)}
              className="h-9 text-sm"
              maxLength={4}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-photo-url" className="text-xs font-semibold">
            URL Foto Profil (Opsional)
          </Label>
          <Input
            id="edit-photo-url"
            placeholder="https://..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        {/* Peran Struktural */}
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

        {/* Penugasan Tri-Dimensi */}
        <div className="rounded-xl border border-border/70 p-3.5 bg-muted/20 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Penugasan Organisasi 3 Dimensi
          </h4>

          {/* Divisi */}
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
              <option value="">{dict.divisionPlaceholder}</option>
              {divisions.map((div) => (
                <option key={div.id} value={div.id}>
                  {div.name} ({div.code})
                </option>
              ))}
            </select>
          </div>

          {/* Klaster & Subunit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-cluster" className="text-xs font-semibold">
                {dict.clusterLabel}
              </Label>
              <select
                id="edit-cluster"
                value={clusterId}
                onChange={(e) => setClusterId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">{dict.clusterPlaceholder}</option>
                {clusters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-subunit" className="text-xs font-semibold">
                {dict.subunitLabel}
              </Label>
              <select
                id="edit-subunit"
                value={subunitId}
                onChange={(e) => setSubunitId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">{dict.subunitPlaceholder}</option>
                {subunits.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.villageName || s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Team Role */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-team-role" className="text-xs font-semibold">
              Sebutan Jabatan / Tugas Khusus (Opsional)
            </Label>
            <Input
              id="edit-team-role"
              placeholder="misal: Staf Desain Grafis, Tim Lapangan Posko"
              value={teamRole}
              onChange={(e) => setTeamRole(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Toggles Kepemimpinan */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <label className="flex items-start gap-2.5 p-2 rounded-lg bg-background/60 border border-border/40 cursor-pointer hover:bg-background transition-colors">
              <input
                type="checkbox"
                id="edit-kormater-toggle"
                checked={isKormater}
                onChange={(e) => setIsKormater(e.target.checked)}
                className="mt-0.5 rounded border-input"
              />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {dict.kormaterLabel}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {dict.kormaterDesc}
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2 rounded-lg bg-background/60 border border-border/40 cursor-pointer hover:bg-background transition-colors">
              <input
                type="checkbox"
                id="edit-kormasit-toggle"
                checked={isKormasit}
                onChange={(e) => setIsKormasit(e.target.checked)}
                className="mt-0.5 rounded border-input"
              />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {dict.kormasitLabel}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {dict.kormasitDesc}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Kontak Darurat */}
        <div className="rounded-xl border border-border/70 p-3.5 bg-muted/20 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Kontak Darurat (Emergency Contact)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-emg-name" className="text-xs font-semibold">
                Nama Kontak Darurat
              </Label>
              <Input
                id="edit-emg-name"
                placeholder="misal: Orang Tua / Wali"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-emg-phone" className="text-xs font-semibold">
                No. HP Kontak Darurat
              </Label>
              <Input
                id="edit-emg-phone"
                placeholder="+62 81x-xxxx-xxxx"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Media Sosial & Portofolio */}
        <div className="rounded-xl border border-border/70 p-3.5 bg-muted/20 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Tautan Sosial & Portofolio
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-soc-ig" className="text-xs font-semibold">Instagram URL</Label>
              <Input
                id="edit-soc-ig"
                placeholder="https://instagram.com/..."
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-soc-li" className="text-xs font-semibold">LinkedIn URL</Label>
              <Input
                id="edit-soc-li"
                placeholder="https://linkedin.com/in/..."
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-soc-gh" className="text-xs font-semibold">GitHub URL</Label>
              <Input
                id="edit-soc-gh"
                placeholder="https://github.com/..."
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-soc-web" className="text-xs font-semibold">Website / Portofolio</Label>
              <Input
                id="edit-soc-web"
                placeholder="https://..."
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Keahlian, Hobi, & Ketersediaan */}
        <div className="rounded-xl border border-border/70 p-3.5 bg-muted/20 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Keahlian, Hobi, & Ketersediaan
          </h4>
          <div className="space-y-1.5">
            <Label htmlFor="edit-skills" className="text-xs font-semibold">
              Keahlian (pisahkan dengan koma)
            </Label>
            <Input
              id="edit-skills"
              placeholder="Desain, React, Manajemen Acara, Fotografi"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-hobbies" className="text-xs font-semibold">
              Hobi & Minat (pisahkan dengan koma)
            </Label>
            <Input
              id="edit-hobbies"
              placeholder="Membaca, Futsal, Musik"
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-avail" className="text-xs font-semibold">
              Catatan Ketersediaan Waktu
            </Label>
            <Input
              id="edit-avail"
              placeholder="misal: Tersedia sore hari setelah perkuliahan"
              value={availabilityNote}
              onChange={(e) => setAvailabilityNote(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
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

export function EditMemberDialog({ member, isOpen, onClose }: EditMemberDialogProps) {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <EditMemberForm key={member.id} member={member} onClose={onClose} />
    </Dialog>
  );
}
