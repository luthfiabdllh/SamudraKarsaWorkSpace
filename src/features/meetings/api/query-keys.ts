export const meetingKeys = {
  all: ['meetings'] as const,
  lists: () => [...meetingKeys.all, 'list'] as const,
  list: (periodId?: string) => [...meetingKeys.lists(), { periodId }] as const,
  details: () => [...meetingKeys.all, 'detail'] as const,
  detail: (id: string) => [...meetingKeys.details(), id] as const,
  decisions: (meetingId: string) => [...meetingKeys.detail(meetingId), 'decisions'] as const,
};
