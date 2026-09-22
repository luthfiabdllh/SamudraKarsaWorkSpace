import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { letterKeys } from './query-keys';
import type {
  LetterDetail,
  LetterFilterParams,
  LetterItem,
} from '../types';
import type {
  CreateLetterFormValues,
  TransitionLetterFormValues,
} from '../schemas/letter';

/**
 * Mengambil daftar surat dari backend NestJS melalui BFF.
 */
export function useLetters(filters?: LetterFilterParams) {
  return useQuery({
    queryKey: letterKeys.list(filters),
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (filters?.direction) params.direction = filters.direction;
      if (filters?.status) params.status = filters.status;
      if (filters?.periodId) params.periodId = filters.periodId;
      if (filters?.picId) params.picId = filters.picId;
      if (filters?.limit) params.limit = filters.limit;
      if (filters?.cursor) params.cursor = filters.cursor;

      const response = await apiClient.get<LetterItem[]>('/letters', { params });
      return response.data;
    },
  });
}

/**
 * Mengambil detail lengkap berkas surat (termasuk availableTransitions & transitionRequirements)
 */
export function useLetterDetail(id: string | null) {
  return useQuery({
    queryKey: letterKeys.detail(id ?? ''),
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<LetterDetail>(`/letters/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Mutasi pembuatan / registrasi surat baru
 */
export function useCreateLetter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateLetterFormValues) => {
      const payload = {
        letterKind: values.letterKind,
        direction: values.direction,
        subject: values.subject,
        senderRecipient: values.senderRecipient || null,
        institution: values.institution || null,
        signerName: values.signerName || null,
        letterDate: values.letterDate || null,
        dueDate: values.dueDate || null,
        note: values.note || null,
      };

      const response = await apiClient.post<LetterItem>('/letters', payload);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: letterKeys.lists() });
    },
  });
}

/**
 * Mutasi transisi status alur FSM surat
 */
export function useTransitionLetter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TransitionLetterFormValues;
    }) => {
      const response = await apiClient.post<LetterDetail>(
        `/letters/${id}/transitions`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: letterKeys.detail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: letterKeys.lists() });
    },
  });
}
