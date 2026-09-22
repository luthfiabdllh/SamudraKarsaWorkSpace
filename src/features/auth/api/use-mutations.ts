'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { authKeys } from './query-keys';
import { toast } from 'sonner';
import type { LoginDTO, ChangePasswordDTO, User, AuthResponse } from '../types';

// ─── Login ────────────────────────────────────────────────────────────────

/**
 * Login mutation — memanggil BFF Route Handler yang memasang cookie httpOnly.
 * Mengisi cache currentUser secara instan pada saat berhasil.
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginDTO): Promise<AuthResponse> => {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: (response) => {
      if (response.success && response.data?.user) {
        queryClient.setQueryData<User>(authKeys.currentUser(), response.data.user);
      }
    },
  });
};

// ─── Logout ────────────────────────────────────────────────────────────────

/**
 * Logout mutation — memanggil BFF Route Handler yang mencabut sesi & membersihkan cookie httpOnly.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      toast.success('Anda telah berhasil keluar dari sistem.');
      window.location.href = '/login';
    },
    onError: () => {
      toast.error('Gagal keluar. Silakan coba lagi.');
    },
  });
};

// ─── Change Password ───────────────────────────────────────────────────────

/**
 * Change Password mutation — memanggil BFF Route Handler saat akun harus ganti password.
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: ChangePasswordDTO): Promise<void> => {
      await apiClient.post('/auth/change-password', payload);
    },
  });
};
