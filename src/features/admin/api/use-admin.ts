import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { adminKeys } from './query-keys';
import type {
  AdminMemberItem,
  RecycleBinItem,
  RecycleBinTable,
  AuditLogItem,
} from '../types';
import type {
  CreateMemberInput,
  UpdateMemberInput,
} from '../schemas/admin';

interface ApiResponse<T> {
  data?: T;
  message?: string;
}

export function useAdminMembers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: adminKeys.members(),
    queryFn: async (): Promise<AdminMemberItem[]> => {
      const res = await apiClient.get<ApiResponse<AdminMemberItem[]> | AdminMemberItem[]>('/profiles/admin');
      const payload = res.data;
      if (Array.isArray(payload)) return payload;
      if (payload && 'data' in payload && Array.isArray(payload.data)) return payload.data;
      return [];
    },
    staleTime: 30_000,
    enabled: options?.enabled ?? true,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMemberInput) => {
      const res = await apiClient.post<ApiResponse<AdminMemberItem>>('/profiles', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.members() });
      toast.success('Akun anggota baru berhasil didaftarkan.');
    },
    onError: (err: unknown) => {
      const errorMsg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(errorMsg || 'Gagal mendaftarkan anggota baru.');
    },
  });
}

export function useUpdateMember(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateMemberInput) => {
      const res = await apiClient.patch<ApiResponse<AdminMemberItem>>(`/profiles/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.members() });
      toast.success('Data keanggotaan berhasil diperbarui.');
    },
    onError: (err: unknown) => {
      const errorMsg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(errorMsg || 'Gagal memperbarui data anggota.');
    },
  });
}

export function useResetMemberPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<{ temporaryPassword: string }> => {
      const res = await apiClient.post<{ temporaryPassword?: string; data?: { temporaryPassword: string } }>(
        `/profiles/${id}/reset-password`
      );
      const payload = res.data;
      if (payload?.temporaryPassword) {
        return { temporaryPassword: payload.temporaryPassword };
      }
      if (payload?.data?.temporaryPassword) {
        return { temporaryPassword: payload.data.temporaryPassword };
      }
      return { temporaryPassword: '' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.members() });
    },
    onError: (err: unknown) => {
      const errorMsg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(errorMsg || 'Gagal mereset kata sandi anggota.');
    },
  });
}

export function useRecycleBinItems(table: RecycleBinTable, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: adminKeys.recycleBin(table),
    queryFn: async (): Promise<RecycleBinItem[]> => {
      const res = await apiClient.get<ApiResponse<RecycleBinItem[]> | RecycleBinItem[]>(`/recycle-bin/${table}`);
      const payload = res.data;
      if (Array.isArray(payload)) return payload;
      if (payload && 'data' in payload && Array.isArray(payload.data)) return payload.data;
      return [];
    },
    staleTime: 10_000,
    enabled: options?.enabled ?? true,
  });
}

export function useRestoreRecycleBinItem(table: RecycleBinTable) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/recycle-bin/${table}/${id}/restore`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.recycleBin(table) });
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      toast.success('Data berhasil dipulihkan dari tempat sampah.');
    },
    onError: (err: unknown) => {
      const errorMsg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(errorMsg || 'Gagal memulihkan data.');
    },
  });
}

export function useHardDeleteRecycleBinItem(table: RecycleBinTable) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, password }: { id: string; password: string }) => {
      await apiClient.delete(`/recycle-bin/${table}/${id}`, {
        data: { password },
        headers: {
          'Idempotency-Key':
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : `hd-${Date.now()}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.recycleBin(table) });
      toast.success('Data berhasil dihapus secara permanen.');
    },
    onError: (err: unknown) => {
      const status =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      const errorMsg =
        status === 401
          ? 'Kata sandi tidak sesuai. Penghapusan dibatalkan demi keamanan.'
          : (err && typeof err === 'object' && 'response' in err
              ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
              : null) || 'Gagal menghapus data secara permanen.';
      toast.error(errorMsg);
    },
  });
}

export function useAuditLogs(filters?: Record<string, unknown>, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: adminKeys.auditLogs(filters),
    queryFn: async (): Promise<AuditLogItem[]> => {
      const res = await apiClient.get<ApiResponse<AuditLogItem[]> | AuditLogItem[]>('/audit-logs', {
        params: filters,
      });
      const payload = res.data;
      if (Array.isArray(payload)) return payload;
      if (payload && 'data' in payload && Array.isArray(payload.data)) return payload.data;
      return [];
    },
    staleTime: 15_000,
    enabled: options?.enabled ?? true,
  });
}
