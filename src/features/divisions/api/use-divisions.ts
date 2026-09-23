import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { divisionsKeys } from './query-keys';
import type { Division, Cluster, Subunit, DivisionMemberItem } from '../types';
import type { CreateDivisionInput } from '../schemas/division';

export function useDivisionsList() {
  return useQuery({
    queryKey: divisionsKeys.list(),
    queryFn: async (): Promise<Division[]> => {
      const res = await fetch('/api/v1/organization/divisions');
      if (!res.ok) {
        throw new Error('Gagal memuat daftar divisi.');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useClustersList() {
  return useQuery({
    queryKey: divisionsKeys.clusters(),
    queryFn: async (): Promise<Cluster[]> => {
      const res = await fetch('/api/v1/organization/clusters');
      if (!res.ok) {
        throw new Error('Gagal memuat daftar klaster keilmuan.');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useSubunitsList() {
  return useQuery({
    queryKey: divisionsKeys.subunits(),
    queryFn: async (): Promise<Subunit[]> => {
      const res = await fetch('/api/v1/organization/subunits');
      if (!res.ok) {
        throw new Error('Gagal memuat daftar subunit posko.');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useDivisionMembers(divisionId?: string) {
  return useQuery({
    queryKey: divisionsKeys.members(divisionId),
    queryFn: async (): Promise<DivisionMemberItem[]> => {
      const sp = new URLSearchParams();
      sp.set('limit', '100');
      if (divisionId) sp.set('divisionId', divisionId);

      const res = await fetch(`/api/v1/profiles?${sp.toString()}`);
      if (!res.ok) {
        throw new Error('Gagal memuat anggota divisi.');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useCreateDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDivisionInput): Promise<Division> => {
      const res = await fetch('/api/v1/organization/divisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal menambahkan divisi.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Divisi baru berhasil ditambahkan.');
      queryClient.invalidateQueries({ queryKey: divisionsKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
