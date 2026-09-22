export const CALENDAR_EVENT_TYPES = [
  'weekly_meeting',
  'all_hands_meeting',
  'daily_meeting',
  'division_meeting',
  'cluster_meeting',
  'subunit_meeting',
  'audience',
  'field_activity',
  'other',
] as const;

export type CalendarEventType = (typeof CALENDAR_EVENT_TYPES)[number];

export const RSVP_STATUSES = [
  'attending',
  'maybe',
  'not_attending',
  'no_response',
] as const;

export type RsvpStatus = (typeof RSVP_STATUSES)[number];

export interface EventAttendee {
  id: string;
  eventId: string;
  profileId: string;
  status: RsvpStatus;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: {
    id: string;
    fullName?: string | null;
    email: string;
  } | null;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  eventType: CalendarEventType;
  startAt: string;
  endAt: string;
  timezone?: string;
  allDay?: boolean;
  location?: string | null;
  meetingLink?: string | null;
  agenda?: string | null;
  divisionId?: string | null;
  clusterId?: string | null;
  subunitId?: string | null;
  linkedWorkItemId?: string | null;
  linkedMeetingId?: string | null;
  isCancelled?: boolean;
  version?: number;
  createdAt: string;
  updatedAt: string;
  division?: {
    id: string;
    name: string;
    code: string;
  } | null;
  attendeesCount?: number;
}

export interface CalendarEventDetail extends CalendarEventItem {
  attendees: EventAttendee[];
}
