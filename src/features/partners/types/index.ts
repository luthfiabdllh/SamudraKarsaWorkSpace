export const PARTNER_STATUSES = [
  'prospect',
  'not_contacted',
  'initial_contact',
  'follow_up',
  'negotiation',
  'proposal_sent',
  'awaiting_response',
  'approved',
  'contract_signed',
  'counter_performance',
  'done',
] as const;

export type PartnerStatus = (typeof PARTNER_STATUSES)[number];

export interface PartnerFollowup {
  id: string;
  partnerId: string;
  followupNote: string;
  createdAt: string;
  authorId?: string | null;
  author?: {
    id: string;
    fullName?: string | null;
    email: string;
  } | null;
}

export interface PartnerBenefit {
  id: string;
  partnerId: string;
  benefitDescription: string;
  deadline?: string | null;
  status?: string | null;
  proofUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  category?: string | null;
  industry?: string | null;
  contactPerson?: string | null;
  contactInfo?: string | null;
  picId?: string | null;
  relationChannel?: string | null;
  targetSupport?: string | null;
  agreedValue?: string | null;
  fundReceived?: string | null;
  inKindSupport?: string | null;
  proposalUrl?: string | null;
  coverLetterUrl?: string | null;
  mouUrl?: string | null;
  status: PartnerStatus;
  programId?: string | null;
  periodId?: string | null;
  version?: number;
  createdAt: string;
  updatedAt: string;
  pic?: {
    id: string;
    fullName?: string | null;
    email: string;
  } | null;
}

export interface PartnerDetail extends PartnerItem {
  followups: PartnerFollowup[];
  benefits: PartnerBenefit[];
}

export interface ListPartnersParams {
  limit?: number;
  offset?: number;
  status?: PartnerStatus;
  periodId?: string;
  picId?: string;
}
