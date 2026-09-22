export const collaborationKeys = {
  all: ['collaboration'] as const,
  meetings: () => [...collaborationKeys.all, 'meetings'] as const,
  meeting: (id: string) => [...collaborationKeys.meetings(), id] as const,
  calendar: () => [...collaborationKeys.all, 'calendar'] as const,
};
