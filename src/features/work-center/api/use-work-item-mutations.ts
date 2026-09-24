import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { workCenterKeys } from './query-keys';
import type { WorkItem, WorkItemDetail } from '../types';
import type {
  CreateWorkItemFormValues,
  SetWorkItemPicValues,
  TransitionWorkItemValues,
  UpdateWorkItemValues,
} from '../schemas/work-item';

/**
 * Mutasi pembuatan pekerjaan baru.
 * Otomatis menyertakan Idempotency-Key untuk mencegah duplikasi pembuatan pekerjaan.
 */
export function useCreateWorkItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateWorkItemFormValues) => {
      const idempotencyKey = crypto.randomUUID();
      const payload = {
        title: values.title,
        type: values.type,
        description: values.description || null,
        priority: values.priority,
        divisionId: values.divisionId || null,
        primaryPicId: values.primaryPicId || null,
        parentId: values.parentId || null,
        storyPoints: values.storyPoints ?? 0,
        startDate: values.startDate || null,
        dueDate: values.dueDate || null,
        progressPercentage: values.progressPercentage ?? 0,
      };

      const response = await apiClient.post<WorkItem>('/work-items', payload, {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workCenterKeys.lists() });
    },
  });
}

/**
 * Mutasi pembuatan Story beserta Task-task di bawahnya dalam 1 transaksi.
 */
export function useCreateStoryWithTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      title: string;
      description?: string | null;
      divisionId?: string | null;
      priority?: string;
      primaryPicId?: string | null;
      dueDate?: string | null;
      sourceRequestId?: string | null;
      tasks: Array<{
        title: string;
        description?: string | null;
        primaryPicId?: string | null;
        priority?: string;
        dueDate?: string | null;
        storyPoints?: number;
      }>;
    }) => {
      const idempotencyKey = crypto.randomUUID();
      const response = await apiClient.post('/work-items/stories', payload, {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workCenterKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: ['work-items', 'by-request'] });
    },
  });
}

/**
 * Mutasi transisi status FSM pekerjaan.
 * Wajib menyertakan header If-Match dan Idempotency-Key.
 */
export function useTransitionWorkItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      version,
      data,
    }: {
      id: string;
      version: number;
      data: TransitionWorkItemValues;
    }) => {
      const idempotencyKey = crypto.randomUUID();
      const response = await apiClient.post<WorkItemDetail>(
        `/work-items/${id}/transitions`,
        data,
        {
          headers: {
            'If-Match': `"${version}"`,
            'Idempotency-Key': idempotencyKey,
          },
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: workCenterKeys.detail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: workCenterKeys.lists() });
    },
  });
}

/**
 * Mutasi penetapan atau klaim penanggung jawab (PIC).
 * Wajib menyertakan header If-Match.
 */
export function useSetWorkItemPic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      version,
      data,
    }: {
      id: string;
      version: number;
      data: SetWorkItemPicValues;
    }) => {
      const response = await apiClient.patch<WorkItemDetail>(
        `/work-items/${id}/pic`,
        data,
        {
          headers: {
            'If-Match': `"${version}"`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: workCenterKeys.detail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: workCenterKeys.lists() });
    },
  });
}

/**
 * Mutasi pembaruan rincian pekerjaan (PATCH /work-items/:id).
 * Wajib menyertakan header If-Match untuk optimistic locking.
 */
export function useUpdateWorkItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      version,
      data,
    }: {
      id: string;
      version: number;
      data: UpdateWorkItemValues;
    }) => {
      const response = await apiClient.patch<WorkItemDetail>(
        `/work-items/${id}`,
        data,
        {
          headers: {
            'If-Match': `"${version}"`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: workCenterKeys.detail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: workCenterKeys.lists() });
    },
  });
}
