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
  const { data: clusters = [] } = useClustersList();
  const { data: subunits = [] } = useSubunitsList();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('SamudraKarsa2026!');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [facultyMajor, setFacultyMajor] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');
  const [divisionId, setDivisionId] = useState('');
  const [clusterId, setClusterId] = useState('');
  const [subunitId, setSubunitId] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [isKormater, setIsKormater] = useState(false);
  const [isKormasit, setIsKormasit] = useState(false);

  // Additional Rich Profile Fields
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [website, setWebsite] = useState('');
  const [skills, setSkills] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [availabilityNote, setAvailabilityNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPassword('SamudraKarsa2026!');
    setNickname('');
    setPhone('');
    setFacultyMajor('');
    setBatchYear('');
    setPhotoUrl('');
    setSelectedRole('member');
    setDivisionId('');
    setClusterId('');
    setSubunitId('');
    setTeamRole('');
    setIsKormater(false);
    setIsKormasit(false);
    setEmergencyContactName('');
    setEmergencyContactPhone('');
    setInstagram('');
    setLinkedin('');
    setGithub('');
    setWebsite('');
    setSkills('');
    setHobbies('');
    setAvailabilityNote('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parseResult = createMemberSchema.safeParse({
      fullName,
      email,
      password,
      nickname: nickname.trim() || null,
      phone: phone.trim() || null,
      facultyMajor: facultyMajor.trim() || null,
      batchYear: batchYear.trim() || null,
      photoUrl: photoUrl.trim() || null,
      roles: [selectedRole],
      status: 'active', // STATUS LANGSUNG AKTIF!
      divisionId: divisionId || null,
      clusterId: clusterId || null,
      subunitId: subunitId || null,
      teamRole: teamRole.trim() || null,
      isKormasit,
      isKormater,
      periodId: null,
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

    if (!parseResult.success) {
      setError(parseResult.error.issues[0]?.message || 'Data tidak valid');
      return;
    }

    try {
      await createMutation.mutateAsync(parseResult.data);
      resetForm();
      onClose();
    } catch {
      // Handled in mutation onError
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent id="create-member-modal" className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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

          {/* Akun Pokok */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <Label htmlFor="m-nickname" className="text-xs font-semibold">
                Nama Panggilan
              </Label>
              <Input
                id="m-nickname"
                placeholder="misal: Bagas, Dwi"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <Label htmlFor="m-phone" className="text-xs font-semibold">
                No. Telepon / WhatsApp
              </Label>
              <Input
                id="m-phone"
                placeholder="+62 812-xxxx-xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </div>

          {/* Akademik & Foto */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="m-faculty-major" className="text-xs font-semibold">
                Fakultas / Program Studi
              </Label>
              <Input
                id="m-faculty-major"
                placeholder="misal: Teknik Elektro / Ilmu Komputer"
                value={facultyMajor}
                onChange={(e) => setFacultyMajor(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="m-batch-year" className="text-xs font-semibold">
                Angkatan (Tahun)
              </Label>
              <Input
                id="m-batch-year"
                placeholder="2023"
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                className="h-9 text-sm"
                maxLength={4}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="m-photo-url" className="text-xs font-semibold">
              URL Foto Profil (Opsional)
            </Label>
            <Input
              id="m-photo-url"
              placeholder="https://..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          {/* Penugasan Tri-Dimensi */}
          <div className="rounded-xl border border-border/70 p-3.5 bg-muted/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Penugasan Organisasi 3 Dimensi
            </h4>

            {/* Divisi */}
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

            {/* Klaster & Subunit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="m-cluster" className="text-xs font-semibold">
                  {dict.clusterLabel}
                </Label>
                <select
                  id="m-cluster"
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
                <Label htmlFor="m-subunit" className="text-xs font-semibold">
                  {dict.subunitLabel}
                </Label>
                <select
                  id="m-subunit"
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
              <Label htmlFor="m-team-role" className="text-xs font-semibold">
                Sebutan Jabatan / Tugas Khusus (Opsional)
              </Label>
              <Input
                id="m-team-role"
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
                  id="m-kormater-toggle"
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
                  id="m-kormasit-toggle"
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
                <Label htmlFor="m-emg-name" className="text-xs font-semibold">
                  Nama Kontak Darurat
                </Label>
                <Input
                  id="m-emg-name"
                  placeholder="misal: Orang Tua / Wali"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="m-emg-phone" className="text-xs font-semibold">
                  No. HP Kontak Darurat
                </Label>
                <Input
                  id="m-emg-phone"
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
                <Label htmlFor="m-soc-ig" className="text-xs font-semibold">Instagram URL</Label>
                <Input
                  id="m-soc-ig"
                  placeholder="https://instagram.com/..."
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-soc-li" className="text-xs font-semibold">LinkedIn URL</Label>
                <Input
                  id="m-soc-li"
                  placeholder="https://linkedin.com/in/..."
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-soc-gh" className="text-xs font-semibold">GitHub URL</Label>
                <Input
                  id="m-soc-gh"
                  placeholder="https://github.com/..."
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-soc-web" className="text-xs font-semibold">Website / Portofolio</Label>
                <Input
                  id="m-soc-web"
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
              <Label htmlFor="m-skills" className="text-xs font-semibold">
                Keahlian (pisahkan dengan koma)
              </Label>
              <Input
                id="m-skills"
                placeholder="Desain, React, Manajemen Acara, Fotografi"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-hobbies" className="text-xs font-semibold">
                Hobi & Minat (pisahkan dengan koma)
              </Label>
              <Input
                id="m-hobbies"
                placeholder="Membaca, Futsal, Musik"
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-avail" className="text-xs font-semibold">
                Catatan Ketersediaan Waktu
              </Label>
              <Input
                id="m-avail"
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
