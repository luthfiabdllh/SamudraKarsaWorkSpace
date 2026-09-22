'use client';

import React from 'react';
import { Handshake, User, Search, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { id as dictionary } from '@/lib/dictionaries/id';
import type { PartnerItem, PartnerStatus } from '../types';

interface PartnerTableProps {
  partners: PartnerItem[];
  isLoading: boolean;
  onSelectPartner: (partner: PartnerItem) => void;
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
}

export function PartnerTable({
  partners,
  isLoading,
  onSelectPartner,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: PartnerTableProps) {
  const dict = dictionary.partners;
  const statusLabels = dictionary.statuses.partners;

  const formatIDR = (val?: string | null) => {
    if (!val) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(val));
  };

  const formatStatusBadge = (status: PartnerStatus) => {
    switch (status) {
      case 'prospect':
      case 'not_contacted':
        return <Badge variant="secondary" className="text-xs font-normal">{statusLabels[status]}</Badge>;
      case 'initial_contact':
      case 'follow_up':
      case 'negotiation':
        return <Badge variant="default" className="text-xs font-normal bg-amber-600 hover:bg-amber-600">{statusLabels[status]}</Badge>;
      case 'proposal_sent':
      case 'awaiting_response':
        return <Badge variant="default" className="text-xs font-normal bg-blue-600 hover:bg-blue-600">{statusLabels[status]}</Badge>;
      case 'approved':
      case 'contract_signed':
      case 'counter_performance':
      case 'done':
        return <Badge variant="default" className="text-xs font-normal bg-emerald-600 hover:bg-emerald-600">{statusLabels[status]}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs font-normal">{status}</Badge>;
    }
  };

  const filteredPartners = partners.filter((p) => {
    if (statusFilter && p.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.industry && p.industry.toLowerCase().includes(q)) ||
      (p.contactPerson && p.contactPerson.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-3">
      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={dict.searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring sm:w-56"
        >
          <option value="">{dict.filterStatus}</option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Table Container */}
      <div className="border border-border/70 rounded-xl overflow-hidden bg-card/60 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs font-semibold border-b border-border/70">
              <tr>
                <th className="py-3 px-4">{dict.table.partnerName}</th>
                <th className="py-3 px-4">{dict.table.category}</th>
                <th className="py-3 px-4">{dict.table.pic}</th>
                <th className="py-3 px-4">{dict.table.targetValue}</th>
                <th className="py-3 px-4">{dict.table.fundReceived}</th>
                <th className="py-3 px-4">{dict.table.status}</th>
                <th className="py-3 px-4 text-right">{dict.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <p className="text-xs">Memuat daftar kemitraan...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Handshake className="h-9 w-9 text-muted-foreground/40" />
                      <p className="font-medium text-foreground">{dict.emptyTitle}</p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        {dict.emptyDescription}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => {
                  return (
                    <tr
                      key={partner.id}
                      onClick={() => onSelectPartner(partner)}
                      className="hover:bg-accent/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {partner.name}
                        </div>
                        {partner.contactPerson && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <User size={12} className="shrink-0" />
                            <span>{partner.contactPerson}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {partner.category && (
                            <Badge variant="outline" className="text-xs font-normal">
                              {partner.category}
                            </Badge>
                          )}
                          {partner.industry && (
                            <p className="text-[11px] text-muted-foreground">{partner.industry}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {partner.pic?.fullName || partner.pic?.email || '-'}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-foreground">
                        {formatIDR(partner.targetSupport)}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatIDR(partner.fundReceived)}
                      </td>
                      <td className="py-3 px-4">
                        {formatStatusBadge(partner.status)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground group-hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPartner(partner);
                          }}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
