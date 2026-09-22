import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { workCenterKeys } from './query-keys';
import type { WorkItem, WorkItemDetail } from '../types';
import type {
  CreateWorkItemFormValues,
  SetWorkItemPicValues,
  TransitionWorkItemValues,
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
