import type { LetterFilterParams } from '../types';

export const letterKeys = {
  all: ['letters'] as const,
  lists: () => [...letterKeys.all, 'list'] as const,
  list: (filters?: LetterFilterParams) =>
    [...letterKeys.lists(), filters ?? {}] as const,
  details: () => [...letterKeys.all, 'detail'] as const,
  detail: (id: string) => [...letterKeys.details(), id] as const,
};
