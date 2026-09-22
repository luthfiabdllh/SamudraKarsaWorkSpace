export const MEETING_TYPES = [
  'general_meeting',
  'division_meeting',
  'coordination_meeting',
  'evaluation',
  'other',
] as const;

export type MeetingType = (typeof MEETING_TYPES)[number];

export interface MeetingParticipant {
  id: string;
  meetingId: string;
  profileId: string;
  createdAt: string;
  profile?: {
    id: string;
    fullName?: string | null;
    email: string;
  } | null;
}

export interface MeetingDecision {
  id: string;
  meetingId: string;
  decisionText: string;
  picId?: string | null;
  dueDate?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: string;
  linkedWorkItemId?: string | null;
  createdAt: string;
  updatedAt: string;
  pic?: {
    id: string;
    fullName?: string | null;
    email: string;
  } | null;
}

export interface MeetingItem {
  id: string;
  title: string;
  meetingType: MeetingType;
  heldAt: string;
  locationOrMedia?: string | null;
  agenda?: string | null;
  summary?: string | null;
  divisionId?: string | null;
  version?: number;
  createdAt: string;
  updatedAt: string;
  division?: {
    id: string;
    name: string;
    code: string;
  } | null;
  participantsCount?: number;
  decisionsCount?: number;
}

export interface MeetingDetail extends MeetingItem {
  participants: MeetingParticipant[];
  decisions: MeetingDecision[];
}
