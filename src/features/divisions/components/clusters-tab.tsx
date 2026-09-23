'use client';

import React from 'react';
import { Atom, Compass, Sprout, HeartPulse, Share2, Users, GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import type { Cluster, DivisionMemberItem } from '../types';
import { id as dictionary } from '@/lib/dictionaries/id';

interface ClustersTabProps {
  clusters: Cluster[];
  members: DivisionMemberItem[];
  searchQuery: string;
  isLoading: boolean;
}

const getClusterIcon = (code: string) => {
  switch (code.toLowerCase()) {
    case 'saintek':
      return <Atom className="h-6 w-6 text-cyan-500" />;
    case 'soshum':
      return <Compass className="h-6 w-6 text-amber-500" />;
    case 'agro':
      return <Sprout className="h-6 w-6 text-emerald-500" />;
    case 'medika':
      return <HeartPulse className="h-6 w-6 text-rose-500" />;
    case 'lintas':
      return <Share2 className="h-6 w-6 text-indigo-500" />;
    default:
      return <GraduationCap className="h-6 w-6 text-primary" />;
  }
};

export function ClustersTab({
  clusters,
  members,
  searchQuery,
  isLoading,
}: ClustersTabProps) {
  const dict = dictionary.divisions;

  const filteredClusters = clusters.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-44 rounded-xl bg-muted/40 animate-pulse border border-border/50" />
        ))}
      </div>
    );
  }

  if (filteredClusters.length === 0) {
    return (
      <EmptyState
        icon={GraduationCap}
        title={dict.emptyTitle}
        description={dict.emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {dict.clustersView.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {dict.clustersView.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClusters.map((cluster) => {
          const clusterMembers = members.filter((m) => m.clusterId === cluster.id);

          return (
            <Card
              key={cluster.id}
              className="flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-primary/40 bg-card/60"
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-muted/50 border border-border flex items-center justify-center">
                    {getClusterIcon(cluster.code)}
                  </div>
                  <Badge variant="outline" className="font-mono text-xs uppercase bg-background/50">
                    {cluster.code}
                  </Badge>
                </div>

                <div>
                  <CardTitle className="text-base font-semibold">
                    {cluster.name}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-2.5">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    {clusterMembers.length} {dict.memberCount}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground/80">
                    Urutan: #{cluster.sortOrder}
                  </span>
                </div>

                {/* Member avatars preview */}
                {clusterMembers.length > 0 ? (
                  <div className="flex items-center gap-1 overflow-hidden pt-1">
                    {clusterMembers.slice(0, 5).map((m) => (
                      <Avatar key={m.id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={m.photoUrl ?? undefined} />
                        <AvatarFallback className="text-[9px] bg-muted">
                          {m.fullName?.slice(0, 2).toUpperCase() || 'M'}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {clusterMembers.length > 5 && (
                      <span className="text-[10px] text-muted-foreground pl-1 font-medium">
                        +{clusterMembers.length - 5} lainnya
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground italic">
                    Belum ada anggota yang terdaftar di klaster ini.
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
