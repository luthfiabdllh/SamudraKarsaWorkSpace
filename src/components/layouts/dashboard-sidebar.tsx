'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Settings } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { cn } from '@/lib/utils';
import type { Dictionary } from '@/lib/dictionaries/en';

interface DashboardSidebarProps {
  lang: string;
  dict: Dictionary['dashboard']['navigation'];
}

const navItems = [
  { key: 'dashboard' as const, icon: LayoutDashboard, href: 'dashboard' },
  { key: 'profile' as const, icon: User, href: 'profile' },
  { key: 'settings' as const, icon: Settings, href: 'settings' },
];

export function DashboardSidebar({ lang, dict }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isSidebarOpen } = useUIStore();

  return (
    <aside
      id="dashboard-sidebar"
      aria-label="Dashboard navigation sidebar"
      className={cn(
        'bg-card border-border flex flex-col border-r transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0">
          N
        </div>
        {isSidebarOpen && (
          <span className="ml-3 font-semibold truncate">Enterprise App</span>
        )}
      </div>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="flex-1 space-y-1 p-3">
        {navItems.map(({ key, icon: Icon, href }) => {
          const fullPath = `/${lang}/${href}`;
          const isActive = pathname === fullPath || pathname.startsWith(`${fullPath}/`);

          return (
            <Link
              key={key}
              href={fullPath}
              aria-label={dict[key]}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon size={18} aria-hidden="true" className="shrink-0" />
              {isSidebarOpen && <span className="truncate">{dict[key]}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
