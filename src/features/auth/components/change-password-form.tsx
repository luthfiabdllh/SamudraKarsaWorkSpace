'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';

import { changePasswordSchema, type ChangePasswordDTO } from '../types';
import { useChangePassword } from '../api/use-mutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Dictionary } from '@/lib/dictionaries/id';

interface ChangePasswordFormProps {
  dict: Dictionary['auth']['changePassword'];
}

export function ChangePasswordForm({ dict }: ChangePasswordFormProps) {
  const router = useRouter();
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordDTO>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordDTO) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      toast.success(dict.success);
      router.push('/login');
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Gagal memperbarui kata sandi.';
      toast.error(message);
    }
  };

  const isPending = isSubmitting || changePasswordMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Formulir Ganti Kata Sandi"
      noValidate
      className="space-y-5"
    >
      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="current-password">{dict.currentPasswordLabel}</Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
            aria-hidden="true"
          />
          <Input
            id="current-password"
            type="password"
            placeholder={dict.currentPasswordPlaceholder}
            autoComplete="current-password"
            aria-required="true"
            aria-invalid={!!errors.currentPassword}
            aria-describedby={errors.currentPassword ? 'curr-pwd-error' : undefined}
            className={cn('pl-9', errors.currentPassword && 'border-destructive')}
            {...register('currentPassword')}
          />
        </div>
        {errors.currentPassword && (
          <p id="curr-pwd-error" role="alert" className="text-sm text-destructive">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="new-password">{dict.newPasswordLabel}</Label>
        <div className="relative">
          <ShieldCheck
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
            aria-hidden="true"
          />
          <Input
            id="new-password"
            type="password"
            placeholder={dict.newPasswordPlaceholder}
            autoComplete="new-password"
            aria-required="true"
            aria-invalid={!!errors.newPassword}
            aria-describedby={errors.newPassword ? 'new-pwd-error' : undefined}
            className={cn('pl-9', errors.newPassword && 'border-destructive')}
            {...register('newPassword')}
          />
        </div>
        {errors.newPassword && (
          <p id="new-pwd-error" role="alert" className="text-sm text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password">{dict.confirmPasswordLabel}</Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
            aria-hidden="true"
          />
          <Input
            id="confirm-password"
            type="password"
            placeholder={dict.confirmPasswordPlaceholder}
            autoComplete="new-password"
            aria-required="true"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirm-pwd-error' : undefined}
            className={cn('pl-9', errors.confirmPassword && 'border-destructive')}
            {...register('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && (
          <p id="confirm-pwd-error" role="alert" className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        id="change-password-submit"
        type="submit"
        className="w-full"
        disabled={isPending}
        aria-label={isPending ? dict.submittingButton : dict.submitButton}
      >
        {isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {isPending ? dict.submittingButton : dict.submitButton}
      </Button>
    </form>
  );
}
