'use client';

import React from 'react';
import { Clock, MapPin, Search, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { id as dictionary } from '@/lib/dictionaries/id';
import type { MeetingItem, MeetingType } from '../types';

interface MeetingTableProps {
  meetings: MeetingItem[];
  isLoading: boolean;
  onSelectMeeting: (meeting: MeetingItem) => void;
  search: string;
  onSearchChange: (val: string) => void;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
}

export function MeetingTable({
  meetings,
  isLoading,
  onSelectMeeting,
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}: MeetingTableProps) {
  const dict = dictionary.meetings;
  const typeLabels = dictionary.types.meetings;

  const formatMeetingTypeBadge = (type: MeetingType) => {
    switch (type) {
      case 'general_meeting':
        return <Badge variant="default" className="text-xs font-normal bg-primary">{typeLabels.general_meeting}</Badge>;
      case 'coordination_meeting':
        return <Badge variant="secondary" className="text-xs font-normal">{typeLabels.coordination_meeting}</Badge>;
      case 'division_meeting':
        return <Badge variant="outline" className="text-xs font-normal">{typeLabels.division_meeting}</Badge>;
      case 'evaluation':
        return <Badge variant="destructive" className="text-xs font-normal">{typeLabels.evaluation}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs font-normal">{typeLabels.other}</Badge>;
    }
  };

  const filteredMeetings = meetings.filter((m) => {
    if (typeFilter && m.meetingType !== typeFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      (m.agenda && m.agenda.toLowerCase().includes(q)) ||
      (m.locationOrMedia && m.locationOrMedia.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-3">
      {/* Search and Type Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={dict.searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring sm:w-56"
        >
          <option value="">{dict.filterType}</option>
          {Object.entries(typeLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Table Container */}
      <div className="border border-border/70 rounded-xl overflow-hidden bg-card/60 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs font-semibold border-b border-border/70">
              <tr>
                <th className="py-3 px-4">{dict.table.title}</th>
                <th className="py-3 px-4">{dict.table.type}</th>
                <th className="py-3 px-4">{dict.table.heldAt}</th>
                <th className="py-3 px-4">{dict.table.location}</th>
                <th className="py-3 px-4">{dict.table.division}</th>
                <th className="py-3 px-4 text-right">{dict.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <p className="text-xs">Memuat agenda rapat...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredMeetings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Clock className="h-9 w-9 text-muted-foreground/40" />
                      <p className="font-medium text-foreground">{dict.emptyTitle}</p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        {dict.emptyDescription}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMeetings.map((meeting) => {
                  return (
                    <tr
                      key={meeting.id}
                      onClick={() => onSelectMeeting(meeting)}
                      className="hover:bg-accent/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {meeting.title}
                        </div>
                        {meeting.agenda && (
                          <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs mt-0.5">
                            {meeting.agenda}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {formatMeetingTypeBadge(meeting.meetingType)}
                      </td>
                      <td className="py-3 px-4 text-xs text-foreground">
                        {new Date(meeting.heldAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {meeting.locationOrMedia ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="shrink-0 text-muted-foreground/70" />
                            <span className="truncate max-w-35">{meeting.locationOrMedia}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {meeting.division?.name || 'Seluruh Organisasi'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground group-hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMeeting(meeting);
                          }}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
