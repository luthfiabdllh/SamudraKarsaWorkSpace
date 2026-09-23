'use client';

import React from 'react';
import { Users, ChevronRight, UserCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Division, DivisionMemberItem } from '../types';
import { id as dictionary } from '@/lib/dictionaries/id';

interface DivisionCardProps {
  division: Division;
  members: DivisionMemberItem[];
  onSelect: (division: Division) => void;
}

export function DivisionCard({ division, members, onSelect }: DivisionCardProps) {
  const dict = dictionary.divisions;

  // Filter members belonging to this division
  const divisionMembers = members.filter((m) => m.divisionId === division.id);
  const headOfDivision = divisionMembers.find((m) =>
    m.roles?.includes('division_head') || m.teamRole?.toLowerCase().includes('kadiv') || m.teamRole?.toLowerCase().includes('kepala')
  );

  return (
    <Card className="flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-primary/40 group relative overflow-hidden bg-card/60 backdrop-blur-xs">
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary/30 via-primary to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl shrink-0">
            {division.icon ? (
              <span>{division.icon}</span>
            ) : (
              <span className="text-sm font-bold text-primary">{division.code.slice(0, 2).toUpperCase()}</span>
            )}
          </div>

          <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider bg-background/50">
            {division.code}
          </Badge>
        </div>

        <div>
          <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-1">
            {division.name}
          </CardTitle>
          <CardDescription className="text-xs line-clamp-2 mt-1.5 min-h-8">
            {division.description || 'Tidak ada deskripsi tanggung jawab yang dicatat.'}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="py-2 space-y-3">
        {/* Kadiv preview */}
        <div className="rounded-lg bg-muted/40 p-2.5 border border-border/50 flex items-center gap-2.5">
          <Avatar className="h-8 w-8 rounded-full border border-border shrink-0">
            <AvatarImage src={headOfDivision?.photoUrl ?? undefined} />
            <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
              {headOfDivision?.fullName
                ? headOfDivision.fullName.slice(0, 2).toUpperCase()
                : 'KD'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <UserCheck className="h-3 w-3 text-primary" />
              {dict.details.headOfDivision}
            </p>
            <p className="text-xs font-semibold text-foreground truncate">
              {headOfDivision?.fullName || headOfDivision?.nickname || 'Belum ditugaskan'}
            </p>
          </div>
        </div>

        {/* Member count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {divisionMembers.length} {dict.memberCount}
          </span>
          <span className="text-[11px] font-mono text-muted-foreground/80">
            Urutan: #{division.sortOrder}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-4">
        <Button
          id={`view-division-${division.code}`}
          variant="secondary"
          size="sm"
          onClick={() => onSelect(division)}
          className="w-full justify-between text-xs font-medium hover:bg-primary hover:text-primary-foreground group/btn"
        >
          <span>{dict.viewProfile}</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
