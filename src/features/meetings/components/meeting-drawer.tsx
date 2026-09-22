'use client';

import React from 'react';
import {
  Clock,
  MapPin,
  Users,
  Plus,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { id as dictionary } from '@/lib/dictionaries/id';
import {
  useMeetingDetail,
  useFollowUpMeetingDecision,
} from '../api/use-meetings';
import type { MeetingItem } from '../types';

interface MeetingDrawerProps {
  meeting: MeetingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAddDecision: (meeting: MeetingItem) => void;
}

export function MeetingDrawer({
  meeting,
  isOpen,
  onClose,
  onOpenAddDecision,
}: MeetingDrawerProps) {
  const dict = dictionary.meetings.drawer;
  const typeLabels = dictionary.types.meetings;
  const priorityLabels = dictionary.priorities;

  const { data: detail, isLoading } = useMeetingDetail(meeting?.id ?? null);
  const followUpMutation = useFollowUpMeetingDecision(meeting?.id ?? '');

  if (!meeting) return null;

  const displayData = detail || meeting;

  const handleFollowUp = (decisionId: string) => {
    followUpMutation.mutate(decisionId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        id="meeting-detail-drawer"
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col h-full bg-card"
      >
        <SheetHeader className="p-5 border-b border-border/70 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-normal">
              {typeLabels[displayData.meetingType] || displayData.meetingType}
            </Badge>
          </div>
          <SheetTitle className="text-lg font-bold text-foreground">
            {displayData.title}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {dict.description}
          </SheetDescription>
        </SheetHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Meeting Time & Place */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Clock size={14} className="text-primary shrink-0" />
              <span>
                {new Date(displayData.heldAt).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {displayData.locationOrMedia && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={14} className="shrink-0" />
                <span>{displayData.locationOrMedia}</span>
              </div>
            )}
          </div>

          <Separator className="bg-border/60" />

          {/* Agenda */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              {dict.agendaTitle}
            </h4>
            <div className="p-3 rounded-lg bg-muted/20 border border-border/60 text-foreground leading-relaxed whitespace-pre-line">
              {displayData.agenda || 'Belum ada rincian agenda yang ditulis.'}
            </div>
          </div>

          {/* Notulensi Summary */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              {dict.summaryTitle}
            </h4>
            {displayData.summary ? (
              <div className="p-3 rounded-lg bg-muted/20 border border-border/60 text-foreground leading-relaxed whitespace-pre-line">
                {displayData.summary}
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-dashed border-border/70 text-muted-foreground text-[11px]">
                {dict.noSummary}
              </div>
            )}
          </div>

          <Separator className="bg-border/60" />

          {/* Participants */}
          <div className="space-y-2">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users size={13} />
              <span>{dict.participantsTitle}</span>
            </h4>

            {isLoading ? (
              <div className="py-2 text-xs text-muted-foreground">Memuat partisipan...</div>
            ) : !detail?.participants || detail.participants.length === 0 ? (
              <div className="p-3 rounded-lg border border-dashed border-border/70 text-muted-foreground text-xs text-center">
                {dict.noParticipants}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {detail.participants.map((p) => (
                  <Badge key={p.id} variant="secondary" className="text-xs font-normal">
                    {p.profile?.fullName || p.profile?.email || 'Partisipan'}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-border/60" />

          {/* Meeting Decisions & Work Item Follow-Up */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                {dict.decisionsTitle}
              </h4>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => onOpenAddDecision(meeting)}
              >
                <Plus size={13} />
                <span>{dict.addDecision}</span>
              </Button>
            </div>

            {isLoading ? (
              <div className="py-4 text-center text-xs text-muted-foreground">
                Memuat butir keputusan...
              </div>
            ) : !detail?.decisions || detail.decisions.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/70 p-4">
                {dict.noDecisions}
              </div>
            ) : (
              <div className="space-y-2.5">
                {detail.decisions.map((dec) => {
                  const hasFollowedUp = Boolean(dec.linkedWorkItemId);

                  return (
                    <div
                      key={dec.id}
                      className="p-3 rounded-lg border border-border/60 bg-card/60 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-foreground leading-relaxed">
                          {dec.decisionText}
                        </p>
                        {dec.priority && (
                          <Badge variant="outline" className="text-[10px] shrink-0 font-normal">
                            {priorityLabels[dec.priority] || dec.priority}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                        <span>
                          {dec.dueDate
                            ? `Tenggat: ${new Date(dec.dueDate).toLocaleDateString('id-ID')}`
                            : 'Tanpa tenggat'}
                        </span>

                        {hasFollowedUp ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                            <CheckCircle2 size={13} />
                            <span>{dict.followedUp}</span>
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 text-[11px] gap-1 px-2"
                            disabled={followUpMutation.isPending}
                            onClick={() => handleFollowUp(dec.id)}
                          >
                            <span>{dict.followUpAction}</span>
                            <ArrowRight size={11} />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
