import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { requestKeys } from './query-keys';
import type { RequestDetail, RequestItem } from '../types';
import type {
  CreateRequestFormValues,
  ResolveSyncConflictValues,
  TransitionRequestValues,
} from '../schemas/request';

/**
 * Mutasi pembuatan pengajuan operasional baru lintas divisi.
 * Otomatis menyertakan Idempotency-Key untuk mencegah duplikasi pengajuan.
 */
export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateRequestFormValues) => {
      const idempotencyKey = crypto.randomUUID();
      const payload = {
        title: values.title,
        type: values.type,
        targetDivisionId: values.targetDivisionId,
        priority: values.priority,
        dueDate: values.dueDate || null,
        description: values.description || null,
        extraFields: {},
      };

      const response = await apiClient.post<RequestItem>('/requests', payload, {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: requestKeys.lists() });
    },
  });
}

/**
 * Mutasi transisi status alur FSM pengajuan.
 * Wajib menyertakan header If-Match dan Idempotency-Key.
 */
export function useTransitionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      version,
      data,
    }: {
      id: string;
      version: number;
      data: TransitionRequestValues;
    }) => {
      const idempotencyKey = crypto.randomUUID();
      const response = await apiClient.post<RequestDetail>(
        `/requests/${id}/transitions`,
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
      void queryClient.invalidateQueries({ queryKey: requestKeys.detail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: requestKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: ['work-center'] });
    },
  });
}

/**
 * Mutasi penyelesaian konflik sinkronisasi (sync_conflict_at).
 * Wajib menyertakan header If-Match.
 */
export function useResolveSyncConflict() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      version,
      data,
    }: {
      id: string;
      version: number;
      data: ResolveSyncConflictValues;
    }) => {
      const response = await apiClient.post<RequestDetail>(
        `/requests/${id}/sync-conflict`,
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
      void queryClient.invalidateQueries({ queryKey: requestKeys.detail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: requestKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: ['work-center'] });
    },
  });
}
