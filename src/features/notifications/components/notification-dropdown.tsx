'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { id as dictionary } from '@/lib/dictionaries/id';
import { useNotifications } from '../api/use-notifications';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dict = dictionary.notifications;
  const { data: notifications = [] } = useNotifications();

  const unreadNotifications = notifications.filter((n) => !n.readAt);
  const unreadCount = unreadNotifications.length;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        id="notification-bell-btn"
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pemberitahuan Sistem"
        aria-expanded={isOpen}
        className="h-9 w-9 relative text-muted-foreground hover:text-foreground"
      >
        <Bell size={18} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground ring-2 ring-background">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div
          id="notification-dropdown-panel"
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border/80 bg-card/95 backdrop-blur-md shadow-lg z-50 overflow-hidden animate-in fade-in-0 zoom-in-95"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 border-b border-border/70">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-foreground">{dict.title}</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5 py-0">
                  {unreadCount} baru
                </Badge>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground p-4">
                <Inbox className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs font-medium text-foreground">{dict.noNotifications}</p>
              </div>
            ) : (
              notifications.map((item) => {
                const isUnread = !item.readAt;

                return (
                  <div
                    key={item.id}
                    className={`p-3 text-xs transition-colors hover:bg-accent/40 ${
                      isUnread ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-foreground text-xs leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground/70 shrink-0">
                        {new Date(item.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-[11px] leading-relaxed mt-1">
                      {item.body}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
