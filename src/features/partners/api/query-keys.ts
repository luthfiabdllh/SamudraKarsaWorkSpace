export const partnerKeys = {
  all: ['partners'] as const,
  lists: () => [...partnerKeys.all, 'list'] as const,
  detail: (id: string) => [...partnerKeys.all, 'detail', id] as const,
};
