'use client';

import React from 'react';
import { MapPin, Home, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import type { Subunit, DivisionMemberItem } from '../types';
import { id as dictionary } from '@/lib/dictionaries/id';

interface SubunitsTabProps {
  subunits: Subunit[];
  members: DivisionMemberItem[];
  searchQuery: string;
  isLoading: boolean;
}

export function SubunitsTab({
  subunits,
  members,
  searchQuery,
  isLoading,
}: SubunitsTabProps) {
  const dict = dictionary.divisions;

  const filteredSubunits = subunits.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.villageName && s.villageName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-44 rounded-xl bg-muted/40 animate-pulse border border-border/50" />
        ))}
      </div>
    );
  }

  if (filteredSubunits.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title={dict.emptyTitle}
        description={dict.emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {dict.subunitsView.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {dict.subunitsView.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSubunits.map((subunit) => {
          const subunitMembers = members.filter((m) => m.subunitId === subunit.id);

          return (
            <Card
              key={subunit.id}
              className="flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-primary/40 bg-card/60"
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Home className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="font-mono text-xs uppercase bg-background/50">
                    {subunit.code}
                  </Badge>
                </div>

                <div>
                  <CardTitle className="text-base font-semibold">
                    {subunit.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span>{dict.subunitsView.village}:</span>
                    <span className="font-medium text-foreground">{subunit.villageName || 'Belum ditentukan'}</span>
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-2.5">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    {subunitMembers.length} {dict.memberCount}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground/80">
                    Urutan: #{subunit.sortOrder}
                  </span>
                </div>

                {/* Member avatars preview */}
                {subunitMembers.length > 0 ? (
                  <div className="flex items-center gap-1 overflow-hidden pt-1">
                    {subunitMembers.slice(0, 6).map((m) => (
                      <Avatar key={m.id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={m.photoUrl ?? undefined} />
                        <AvatarFallback className="text-[9px] bg-muted">
                          {m.fullName?.slice(0, 2).toUpperCase() || 'M'}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {subunitMembers.length > 6 && (
                      <span className="text-[10px] text-muted-foreground pl-1 font-medium">
                        +{subunitMembers.length - 6} lainnya
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground italic">
                    Belum ada anggota yang ditempatkan di subunit ini.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
