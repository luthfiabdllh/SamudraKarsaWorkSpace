'use client';

import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/store/ui.store';
import { useLogout } from '@/features/auth/api/use-mutations';
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationDropdown } from '@/features/notifications';
import type { SessionUser } from '@/lib/verify-session';

interface DashboardHeaderProps {
  user: SessionUser;
  logoutLabel: string;
}

export function DashboardHeader({
  user,
  logoutLabel,
}: DashboardHeaderProps) {
  const { toggleSidebar, isSidebarOpen } = useUIStore();
  const logoutMutation = useLogout();

  const displayName = user.fullName || user.email.split('@')[0] || 'Anggota';

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const primaryRole = user.roles[0] ?? 'member';

  const formatRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Ketua';
      case 'co_owner':
        return 'Pimpinan Inti';
      case 'division_head':
        return 'Kadiv';
      case 'division_deputy':
        return 'Wakadiv';
      default:
        return 'Anggota';
    }
  };

  return (
    <header
      id="dashboard-header"
      className="bg-card/80 backdrop-blur-md border-border/80 flex h-16 items-center justify-between border-b px-4 sm:px-6 sticky top-0 z-20"
      aria-label="Bilah Atas Navigasi"
    >
      {/* Left side: Sidebar toggle */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Alihkan tampilan navigasi samping"
          aria-expanded={isSidebarOpen}
          aria-controls="dashboard-sidebar"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Menu size={20} aria-hidden="true" />
        </Button>
      </div>

      {/* Right side: Actions & User profile */}
      <div className="flex items-center gap-3">
        {/* Theme mode toggle */}
        <ThemeToggle />

        {/* Polling notification dropdown */}
        <NotificationDropdown />

        <div className="h-4 w-px bg-border/80 mx-1 hidden sm:block" />

        {/* User profile & role badge */}
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20" aria-label={`Pengguna ${displayName}`}>
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="hidden flex-col sm:flex text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground truncate max-w-35">
                {displayName}
              </span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                {formatRoleBadge(primaryRole)}
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground truncate max-w-35">
              {user.email}
            </span>
          </div>
        </div>

        {/* Logout button */}
        <Button
          id="logout-button"
          variant="ghost"
          size="icon"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          aria-label={logoutLabel}
          title={logoutLabel}
          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut size={18} aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
