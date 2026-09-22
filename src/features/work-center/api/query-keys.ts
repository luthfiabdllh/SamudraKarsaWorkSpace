import type { WorkCenterFilterParams } from '../types';

export const workCenterKeys = {
  all: ['work-center'] as const,
  lists: () => [...workCenterKeys.all, 'list'] as const,
  list: (filters?: WorkCenterFilterParams) =>
    [...workCenterKeys.lists(), filters ?? {}] as const,
  details: () => [...workCenterKeys.all, 'detail'] as const,
  detail: (id: string) => [...workCenterKeys.details(), id] as const,
  withoutPic: () => [...workCenterKeys.all, 'without-pic'] as const,
};
