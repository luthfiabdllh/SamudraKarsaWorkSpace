export const divisionsKeys = {
  all: ['divisions'] as const,
  list: () => [...divisionsKeys.all, 'list'] as const,
  detail: (id: string) => [...divisionsKeys.all, 'detail', id] as const,
  clusters: () => ['clusters', 'list'] as const,
  subunits: () => ['subunits', 'list'] as const,
  members: (divisionId?: string) => ['division-members', divisionId ?? 'all'] as const,
};
