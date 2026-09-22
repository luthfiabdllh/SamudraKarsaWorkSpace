'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  FileSpreadsheet,
  Building2,
  Users,
  Wallet,
  ScrollText,
  Handshake,
  Package,
  Calendar,
  ShieldCheck,
  Anchor,
  Clock,
  X,
} from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Dictionary } from '@/lib/dictionaries/id';

interface DashboardSidebarProps {
  dict: Dictionary['navigation'];
  userRoles?: readonly string[];
}

const hubItems = [
  { key: 'beranda' as const, icon: LayoutDashboard, href: '/dashboard' },
  { key: 'workCenter' as const, icon: CheckSquare, href: '/work-center' },
  { key: 'requests' as const, icon: FileSpreadsheet, href: '/requests' },
  { key: 'divisions' as const, icon: Building2, href: '/divisions' },
  { key: 'team' as const, icon: Users, href: '/team' },
];

const moduleItems = [
  { key: 'finance' as const, icon: Wallet, href: '/finance', minRoles: ['owner', 'co_owner'] },
  { key: 'letters' as const, icon: ScrollText, href: '/letters' },
  { key: 'partners' as const, icon: Handshake, href: '/partners' },
  { key: 'inventory' as const, icon: Package, href: '/inventory' },
  { key: 'meetings' as const, icon: Clock, href: '/meetings' },
  { key: 'calendar' as const, icon: Calendar, href: '/calendar' },
  { key: 'admin' as const, icon: ShieldCheck, href: '/admin', minRoles: ['owner'] },
];

export function DashboardSidebar({ dict, userRoles = [] }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  const isRoleAllowed = (minRoles?: readonly string[]) => {
    if (!minRoles || minRoles.length === 0) return true;
    return minRoles.some((r) => userRoles.includes(r));
  };

  const handleLinkClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="dashboard-sidebar"
        aria-label="Navigasi Utama Organisasi"
        className={cn(
          'bg-card/95 backdrop-blur border-border/80 flex flex-col border-r duration-300 select-none shadow-sm',
          // Mobile responsive: fixed off-canvas drawer
          'fixed inset-y-0 left-0 z-50 transition-transform md:transition-all',
          isSidebarOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full md:translate-x-0 md:w-20',
          // Desktop responsive: static positioning inside layout
          'md:static md:z-30 md:shrink-0',
          isSidebarOpen && 'md:w-64'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center border-b border-border/70 px-4 gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-md shadow-primary/20 shrink-0">
            <Anchor className="h-5 w-5" aria-hidden="true" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-tight truncate text-foreground">
                Samudra Karsa
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                WorkSpace v2.0
              </span>
            </div>
          )}
          {/* Mobile Close Button */}
          {isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="ml-auto md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Tutup navigasi samping"
            >
              <X size={18} aria-hidden="true" />
            </Button>
          )}
        </div>

        {/* Navigation Links Scroll Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6 scrollbar-thin">
          {/* Daily Hubs Section */}
          <div className="space-y-1">
            {isSidebarOpen && (
              <h2 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2">
                {dict.hubsTitle}
              </h2>
            )}
            {hubItems.map(({ key, icon: Icon, href }) => {
              const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`));

              return (
                <Link
                  key={key}
                  href={href}
                  onClick={handleLinkClick}
                  aria-label={dict[key]}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all group',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  title={!isSidebarOpen ? dict[key] : undefined}
                >
                  <Icon
                    size={19}
                    aria-hidden="true"
                    className={cn(
                      'shrink-0 transition-transform group-hover:scale-105',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  {isSidebarOpen && <span className="truncate">{dict[key]}</span>}
                </Link>
              );
            })}
          </div>

          {/* Functional Modules Section */}
          <div className="space-y-1">
            {isSidebarOpen && (
              <h2 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2">
                {dict.modulesTitle}
              </h2>
            )}
            {moduleItems
              .filter((item) => isRoleAllowed(item.minRoles))
              .map(({ key, icon: Icon, href }) => {
                const isActive = pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={key}
                    href={href}
                    onClick={handleLinkClick}
                    aria-label={dict[key]}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all group',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                    title={!isSidebarOpen ? dict[key] : undefined}
                  >
                    <Icon
                      size={19}
                      aria-hidden="true"
                      className={cn(
                        'shrink-0 transition-transform group-hover:scale-105',
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    {isSidebarOpen && <span className="truncate">{dict[key]}</span>}
                  </Link>
                );
              })}
          </div>
        </div>
      </aside>
    </>
  );
}
