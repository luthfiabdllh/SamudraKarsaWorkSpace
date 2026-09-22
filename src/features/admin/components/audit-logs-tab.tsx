'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Activity,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { id as dictionary } from '@/lib/dictionaries/id';
import { useAuditLogs } from '../api/use-admin';
import type { AuditLogItem } from '../types';

export function AuditLogsTab() {
  const dict = dictionary.admin.auditLogs;
  const { data: logs = [], isLoading } = useAuditLogs();

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [selectedLogForDetails, setSelectedLogForDetails] = useState<AuditLogItem | null>(null);

  const formatActionBadge = (action: string) => {
    if (action.includes('delete') || action.includes('hard_delete')) {
      return { variant: 'outline' as const, className: 'text-destructive border-destructive/30 bg-destructive/10' };
    }
    if (action.includes('create') || action.includes('restore')) {
      return { variant: 'outline' as const, className: 'text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
    }
    if (action.includes('viewed')) {
      return { variant: 'outline' as const, className: 'text-indigo-700 dark:text-indigo-400 border-indigo-500/30 bg-indigo-500/10' };
    }
    return { variant: 'outline' as const, className: 'text-primary border-primary/30 bg-primary/10' };
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        !search ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        (log.actorName && log.actorName.toLowerCase().includes(search.toLowerCase())) ||
        (log.entityType && log.entityType.toLowerCase().includes(search.toLowerCase()));

      const matchAction = !actionFilter || log.action === actionFilter;

      return matchSearch && matchAction;
    });
  }, [logs, search, actionFilter]);

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={dict.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">{dict.filterAction}</option>
            <option value="create">Penciptaan Data (create)</option>
            <option value="update">Perubahan Data (update)</option>
            <option value="delete">Hapus Lunak (delete)</option>
            <option value="restore">Pemulihan (restore)</option>
            <option value="hard_delete">Hapus Permanen (hard_delete)</option>
            <option value="finance.viewed">Akses Keuangan (finance.viewed)</option>
          </select>
        </div>

        <Badge variant="outline" className="text-xs self-start sm:self-center font-mono">
          {filteredLogs.length} Aktivitas Tercatat
        </Badge>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/70 text-[11px]">
              <tr>
                <th className="px-4 py-3">{dict.table.timestamp}</th>
                <th className="px-4 py-3">{dict.table.actor}</th>
                <th className="px-4 py-3">{dict.table.action}</th>
                <th className="px-4 py-3">{dict.table.entity}</th>
                <th className="px-4 py-3 text-right">{dict.table.details}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Memuat log audit sistem...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {dict.emptyTitle}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {dict.emptyDescription}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badgeStyle = formatActionBadge(log.action);
                  return (
                    <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground font-mono text-[11px]">
                        {new Date(log.createdAt).toLocaleString('id-ID')}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">
                          {log.actorName || 'Sistem / Anonim'}
                        </div>
                        {log.actorId && (
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {log.actorId.slice(0, 8)}...
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant={badgeStyle.variant}
                          className={`text-[10px] font-mono font-semibold ${badgeStyle.className}`}
                        >
                          {log.action}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {log.entityType ? (
                          <div>
                            <span className="font-semibold text-foreground">
                              {log.entityType}
                            </span>
                            {log.entityId && (
                              <span className="text-[10px] font-mono ml-1.5 opacity-70">
                                #{log.entityId.slice(0, 8)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="italic text-muted-foreground/60">-</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {log.details ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                            onClick={() => setSelectedLogForDetails(log)}
                          >
                            <Eye className="h-3 w-3" />
                            <span>{dict.actions.viewDetails}</span>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground/50 text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog
        open={Boolean(selectedLogForDetails)}
        onOpenChange={(open) => !open && setSelectedLogForDetails(null)}
      >
        <DialogContent id="audit-details-modal" className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <DialogTitle>{dict.detailsDialog.title}</DialogTitle>
            </div>
            {selectedLogForDetails && (
              <DialogDescription className="text-xs text-muted-foreground">
                Aksi: {selectedLogForDetails.action} | Waktu:{' '}
                {new Date(selectedLogForDetails.createdAt).toLocaleString('id-ID')}
              </DialogDescription>
            )}
          </DialogHeader>

          {selectedLogForDetails && (
            <div className="space-y-3 pt-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {selectedLogForDetails.ipAddress && (
                  <div className="bg-muted/50 p-2 rounded-md">
                    <span className="text-muted-foreground font-semibold">
                      {dict.detailsDialog.ipAddress}:
                    </span>{' '}
                    <span className="font-mono">{selectedLogForDetails.ipAddress}</span>
                  </div>
                )}
                {selectedLogForDetails.userAgent && (
                  <div className="bg-muted/50 p-2 rounded-md truncate" title={selectedLogForDetails.userAgent}>
                    <span className="text-muted-foreground font-semibold">
                      {dict.detailsDialog.userAgent}:
                    </span>{' '}
                    <span className="font-mono">{selectedLogForDetails.userAgent}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-muted-foreground">
                  {dict.detailsDialog.changesPayload}:
                </p>
                <pre className="max-h-60 overflow-y-auto rounded-lg bg-muted/80 p-3 font-mono text-[11px] leading-relaxed text-foreground scrollbar-thin">
                  {JSON.stringify(selectedLogForDetails.details, null, 2)}
                </pre>
              </div>

              <div className="flex justify-end pt-2 border-t border-border/70">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedLogForDetails(null)}
                >
                  {dict.actions.closeDetails}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
