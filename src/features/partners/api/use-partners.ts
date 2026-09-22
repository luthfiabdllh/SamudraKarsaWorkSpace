import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { partnerKeys } from './query-keys';
import type { PartnerItem, PartnerDetail, ListPartnersParams } from '../types';
import type {
  CreatePartnerInput,
  UpdatePartnerInput,
  TransitionPartnerInput,
  AddFollowupInput,
  AddBenefitInput,
  UpdateBenefitInput,
} from '../schemas/partner';

export function usePartners(params: ListPartnersParams = {}) {
  return useQuery({
    queryKey: partnerKeys.list(params),
    queryFn: async (): Promise<PartnerItem[]> => {
      const sp = new URLSearchParams();
      if (params.limit) sp.set('limit', String(params.limit));
      if (params.offset) sp.set('offset', String(params.offset));
      if (params.status) sp.set('status', params.status);
      if (params.periodId) sp.set('periodId', params.periodId);
      if (params.picId) sp.set('picId', params.picId);

      const qs = sp.toString() ? `?${sp.toString()}` : '';
      const res = await fetch(`/api/v1/partners${qs}`);
      if (!res.ok) {
        throw new Error('Gagal memuat daftar mitra kemitraan.');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function usePartnerDetail(id: string | null) {
  return useQuery({
    queryKey: partnerKeys.detail(id || ''),
    queryFn: async (): Promise<PartnerDetail> => {
      if (!id) throw new Error('ID mitra diperlukan.');
      const res = await fetch(`/api/v1/partners/${id}`);
      if (!res.ok) {
        throw new Error('Gagal memuat detail mitra kemitraan.');
      }
      return res.json();
    },
    enabled: Boolean(id),
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePartnerInput): Promise<PartnerItem> => {
      const res = await fetch('/api/v1/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal mendaftarkan mitra.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Mitra baru berhasil didaftarkan.');
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useUpdatePartner(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      version,
    }: {
      payload: UpdatePartnerInput;
      version?: number;
    }): Promise<PartnerItem> => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (version !== undefined) {
        headers['If-Match'] = `"${version}"`;
      }

      const res = await fetch(`/api/v1/partners/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal memperbarui data mitra.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Data mitra berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useTransitionPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: TransitionPartnerInput }) => {
      const res = await fetch(`/api/v1/partners/${id}/transitions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal mengubah status mitra.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Status alur kemitraan berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useAddFollowup(partnerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddFollowupInput) => {
      const res = await fetch(`/api/v1/partners/${partnerId}/followups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal menambahkan catatan tindak lanjut.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Catatan tindak lanjut berhasil ditambahkan.');
      queryClient.invalidateQueries({ queryKey: partnerKeys.detail(partnerId) });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useAddBenefit(partnerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddBenefitInput) => {
      const res = await fetch(`/api/v1/partners/${partnerId}/benefits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal menambahkan komitmen benefit.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Komitmen benefit mitra berhasil ditambahkan.');
      queryClient.invalidateQueries({ queryKey: partnerKeys.detail(partnerId) });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useUpdateBenefit(partnerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ benefitId, payload }: { benefitId: string; payload: UpdateBenefitInput }) => {
      const res = await fetch(`/api/v1/partners/${partnerId}/benefits/${benefitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal memperbarui status benefit.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Status benefit berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: partnerKeys.detail(partnerId) });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useDeleteBenefit(partnerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (benefitId: string) => {
      const res = await fetch(`/api/v1/partners/${partnerId}/benefits/${benefitId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Gagal menghapus butir benefit.');
      }
    },
    onSuccess: () => {
      toast.success('Butir benefit berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: partnerKeys.detail(partnerId) });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
