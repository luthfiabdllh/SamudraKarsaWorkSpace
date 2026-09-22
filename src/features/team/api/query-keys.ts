export const teamKeys = {
  all: ['team'] as const,
  announcements: (divisionId?: string) =>
    [...teamKeys.all, 'announcements', { divisionId }] as const,
  feedback: (periodId?: string) =>
    [...teamKeys.all, 'feedback', { periodId }] as const,
};
