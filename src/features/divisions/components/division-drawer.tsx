'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { ShieldCheck, Users, Info } from 'lucide-react';
import type { Division, DivisionMemberItem } from '../types';
import { id as dictionary } from '@/lib/dictionaries/id';

interface DivisionDrawerProps {
  division: Division | null;
  isOpen: boolean;
  onClose: () => void;
  members: DivisionMemberItem[];
}

export function DivisionDrawer({
  division,
  isOpen,
  onClose,
  members,
}: DivisionDrawerProps) {
  const dict = dictionary.divisions;

  if (!division) return null;

  const divisionMembers = members.filter((m) => m.divisionId === division.id);
  const headOfDivision = divisionMembers.find((m) =>
    m.roles?.includes('division_head') || m.teamRole?.toLowerCase().includes('kadiv') || m.teamRole?.toLowerCase().includes('kepala')
  );
  const deputyOfDivision = divisionMembers.find((m) =>
    m.roles?.includes('division_deputy') || m.teamRole?.toLowerCase().includes('wakadiv') || m.teamRole?.toLowerCase().includes('wakil')
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto space-y-6">
        <SheetHeader className="space-y-3 border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shrink-0">
              {division.icon || '🏢'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <SheetTitle className="text-xl font-bold tracking-tight text-foreground">
                  {division.name}
                </SheetTitle>
              </div>
              <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider mt-1 bg-muted">
                {division.code}
              </Badge>
            </div>
          </div>
          <SheetDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {division.description || 'Divisi operasional kepanitiaan resmi Samudra Karsa.'}
          </SheetDescription>
        </SheetHeader>

        {/* Leadership Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Kepemimpinan Divisi
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Kadiv */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-2">
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block">
                {dict.details.headOfDivision}
              </span>
              {headOfDivision ? (
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9 border border-border shrink-0">
                    <AvatarImage src={headOfDivision.photoUrl ?? undefined} />
                    <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                      {headOfDivision.fullName?.slice(0, 2).toUpperCase() || 'KD'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">
                      {headOfDivision.fullName || headOfDivision.nickname}
                    </p>
                    {headOfDivision.nickname && (
                      <p className="text-[11px] text-muted-foreground truncate">
                        &quot;{headOfDivision.nickname}&quot;
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Belum ditugaskan</p>
              )}
            </div>

            {/* Wakadiv */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-2">
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block">
                {dict.details.deputyHead}
              </span>
              {deputyOfDivision ? (
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9 border border-border shrink-0">
                    <AvatarImage src={deputyOfDivision.photoUrl ?? undefined} />
                    <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                      {deputyOfDivision.fullName?.slice(0, 2).toUpperCase() || 'WD'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">
                      {deputyOfDivision.fullName || deputyOfDivision.nickname}
                    </p>
                    {deputyOfDivision.nickname && (
                      <p className="text-[11px] text-muted-foreground truncate">
                        &quot;{deputyOfDivision.nickname}&quot;
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Belum ditugaskan</p>
              )}
            </div>
          </div>
        </div>

        {/* Member Directory */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              {dict.details.members} ({divisionMembers.length})
            </h4>
          </div>

          {divisionMembers.length === 0 ? (
            <EmptyState
              icon={Users}
              title={dict.details.noMembers}
              description="Anggota kepanitiaan belum dipetakan ke dalam divisi ini."
            />
          ) : (
            <div className="rounded-xl border border-border/70 divide-y divide-border/60 bg-card/50 overflow-hidden">
              {divisionMembers.map((member) => (
                <div key={member.id} className="p-3 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-8 w-8 border border-border shrink-0">
                      <AvatarImage src={member.photoUrl ?? undefined} />
                      <AvatarFallback className="text-[10px] font-semibold bg-muted text-foreground">
                        {member.fullName?.slice(0, 2).toUpperCase() || 'AN'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {member.fullName || member.nickname || 'Anggota'}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {member.teamRole || (member.roles.includes('division_head') ? 'Kepala Divisi' : member.roles.includes('division_deputy') ? 'Wakil Kepala Divisi' : 'Staf Divisi')}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={member.status === 'active' ? 'default' : 'secondary'}
                    className="text-[10px] shrink-0 capitalize"
                  >
                    {member.status === 'active' ? 'Aktif' : member.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Meta */}
        <div className="rounded-xl border border-border/60 bg-muted/10 p-3.5 space-y-2 text-xs text-muted-foreground">
          <h5 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
            <Info className="h-3.5 w-3.5 text-primary" />
            Metadata Organisasi
          </h5>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div>
              <span className="text-muted-foreground">ID Divisi:</span>{' '}
              <span className="text-foreground truncate block">{division.id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Urutan Tampilan:</span>{' '}
              <span className="text-foreground">#{division.sortOrder}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Dibuat:</span>{' '}
              <span className="text-foreground">{new Date(division.createdAt).toLocaleDateString('id-ID')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>{' '}
              <span className="text-emerald-500 font-semibold">Resmi Terdaftar</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
