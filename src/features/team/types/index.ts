export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  pinned?: boolean;
  divisionId?: string | null;
  authorId?: string | null;
  createdAt: string;
  updatedAt: string;
  division?: {
    id: string;
    name: string;
    code: string;
  } | null;
  author?: {
    id: string;
    fullName?: string | null;
    email: string;
  } | null;
}

export type FeedbackVisibility = 'anonymous' | 'named';

export interface FeedbackItem {
  id: string;
  category?: string | null;
  visibility?: FeedbackVisibility | null;
  targetNote?: string | null;
  message: string;
  isPrivate?: boolean;
  authorId?: string | null;
  createdAt: string;
  author?: {
    id: string;
    fullName?: string | null;
    email: string;
  } | null;
}
