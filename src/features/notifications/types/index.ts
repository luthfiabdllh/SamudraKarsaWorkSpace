export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  entityType?: string | null;
  entityId?: string | null;
  kind?: string | null;
  readAt?: string | null;
  createdAt: string;
}
