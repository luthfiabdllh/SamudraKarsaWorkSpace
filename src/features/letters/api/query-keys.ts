export const letterKeys = {
  all: ['letters'] as const,
  lists: () => [...letterKeys.all, 'list'] as const,
  list: (type?: string) => [...letterKeys.lists(), type] as const,
  detail: (id: string) => [...letterKeys.all, 'detail', id] as const,
};
