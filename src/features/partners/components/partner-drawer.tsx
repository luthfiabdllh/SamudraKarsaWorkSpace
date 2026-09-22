'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Plus,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { id as dictionary } from '@/lib/dictionaries/id';
import {
  usePartnerDetail,
  useTransitionPartner,
  useAddFollowup,
  useUpdateBenefit,
  useDeleteBenefit,
} from '../api/use-partners';
import { PARTNER_STATUSES, type PartnerItem, type PartnerStatus } from '../types';

interface PartnerDrawerProps {
  partner: PartnerItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAddBenefit: (partner: PartnerItem) => void;
}

export function PartnerDrawer({
  partner,
  isOpen,
  onClose,
  onOpenAddBenefit,
}: PartnerDrawerProps) {
  const dict = dictionary.partners.drawer;
  const statusLabels = dictionary.statuses.partners;

  const { data: detail, isLoading } = usePartnerDetail(partner?.id ?? null);
  const transitionMutation = useTransitionPartner();
  const addFollowupMutation = useAddFollowup(partner?.id ?? '');
  const updateBenefitMutation = useUpdateBenefit(partner?.id ?? '');
  const deleteBenefitMutation = useDeleteBenefit(partner?.id ?? '');

  const [followupText, setFollowupText] = useState('');

  if (!partner) return null;

  const displayData = detail || partner;

  const handleAddFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupText.trim()) return;
    try {
      await addFollowupMutation.mutateAsync({ followupNote: followupText.trim() });
      setFollowupText('');
    } catch {
      // handled
    }
  };

  const handleToggleBenefitStatus = (benefitId: string, currentStatus?: string | null) => {
    const nextStatus = currentStatus === 'fulfilled' ? 'pending' : 'fulfilled';
    updateBenefitMutation.mutate({
      benefitId,
      payload: { status: nextStatus },
    });
  };

  const handleTransition = (nextStatus: PartnerStatus) => {
    transitionMutation.mutate({
      id: partner.id,
      payload: { to: nextStatus },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        id="partner-detail-drawer"
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col h-full bg-card"
      >
        <SheetHeader className="p-5 border-b border-border/70 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-normal">
              {displayData.category || 'Mitra'}
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              {statusLabels[displayData.status] || displayData.status}
            </Badge>
          </div>
          <SheetTitle className="text-lg font-bold text-foreground">
            {displayData.name}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {dict.description}
          </SheetDescription>
        </SheetHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Status Pipeline Transition Selector */}
          <div className="space-y-2 p-3 rounded-lg border border-border/70 bg-muted/20">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Perbarui Tahapan Pipeline
            </span>
            <div className="flex items-center gap-2">
              <select
                value={displayData.status}
                onChange={(e) => handleTransition(e.target.value as PartnerStatus)}
                disabled={transitionMutation.isPending}
                className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {PARTNER_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {statusLabels[st] || st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Overview Info */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              {dict.overview}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-muted-foreground">{dict.contactPerson}:</span>
                <p className="font-medium text-foreground">{displayData.contactPerson || '-'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground">{dict.contactInfo}:</span>
                <p className="font-medium text-foreground">{displayData.contactInfo || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <span className="text-muted-foreground">Target Dukungan:</span>
                <p className="font-mono font-medium text-foreground">
                  {displayData.targetSupport
                    ? new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(Number(displayData.targetSupport))
                    : '-'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground">Realisasi Dana:</span>
                <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {displayData.fundReceived
                    ? new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(Number(displayData.fundReceived))
                    : '-'}
                </p>
              </div>
            </div>

            {displayData.inKindSupport && (
              <div className="pt-2">
                <span className="text-muted-foreground">{dict.inKindSupport}:</span>
                <p className="text-foreground mt-0.5">{displayData.inKindSupport}</p>
              </div>
            )}
          </div>

          <Separator className="bg-border/60" />

          {/* Documents Section */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              {dict.documents}
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {displayData.proposalUrl ? (
                <a
                  href={displayData.proposalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-border/70 bg-card hover:bg-accent/40 flex items-center justify-between text-primary font-medium transition-colors"
                >
                  <span className="truncate">{dict.proposalLink}</span>
                  <ExternalLink size={13} className="shrink-0 ml-1" />
                </a>
              ) : (
                <div className="p-2.5 rounded-lg border border-dashed border-border/70 text-muted-foreground text-[11px]">
                  {dict.proposalLink}: {dict.noDocument}
                </div>
              )}

              {displayData.mouUrl ? (
                <a
                  href={displayData.mouUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-border/70 bg-card hover:bg-accent/40 flex items-center justify-between text-primary font-medium transition-colors"
                >
                  <span className="truncate">{dict.mouLink}</span>
                  <ExternalLink size={13} className="shrink-0 ml-1" />
                </a>
              ) : (
                <div className="p-2.5 rounded-lg border border-dashed border-border/70 text-muted-foreground text-[11px]">
                  {dict.mouLink}: {dict.noDocument}
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Benefit Checklist Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                {dict.benefitsTitle}
              </h4>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => onOpenAddBenefit(partner)}
              >
                <Plus size={13} />
                <span>{dict.addBenefit}</span>
              </Button>
            </div>

            {isLoading ? (
              <div className="py-4 text-center text-xs text-muted-foreground">
                Memuat komitmen benefit...
              </div>
            ) : !detail?.benefits || detail.benefits.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/70 p-4">
                Belum ada komitmen benefit kontraprestasi yang dicatat.
              </div>
            ) : (
              <div className="space-y-2">
                {detail.benefits.map((b) => {
                  const isFulfilled = b.status === 'fulfilled';

                  return (
                    <div
                      key={b.id}
                      className="p-3 rounded-lg border border-border/60 bg-card/60 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleBenefitStatus(b.id, b.status)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <CheckCircle2
                              size={16}
                              className={isFulfilled ? 'text-emerald-500' : 'text-muted-foreground/40'}
                            />
                          </button>
                          <span
                            className={`font-medium ${
                              isFulfilled ? 'line-through text-muted-foreground' : 'text-foreground'
                            }`}
                          >
                            {b.benefitDescription}
                          </span>
                        </div>

                        {b.deadline && (
                          <p className="text-[11px] text-muted-foreground pl-6">
                            Tenggat: {new Date(b.deadline).toLocaleDateString('id-ID')}
                          </p>
                        )}

                        {b.proofUrl && (
                          <div className="pl-6 pt-1">
                            <a
                              href={b.proofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary text-[11px] hover:underline inline-flex items-center gap-1"
                            >
                              <span>{dict.viewProof}</span>
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => deleteBenefitMutation.mutate(b.id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Separator className="bg-border/60" />

          {/* Follow-up Timeline Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              {dict.followupsTitle}
            </h4>

            {/* Inline Followup Form */}
            <form onSubmit={handleAddFollowup} className="flex gap-2">
              <Input
                placeholder="Tambah catatan hasil komunikasi..."
                value={followupText}
                onChange={(e) => setFollowupText(e.target.value)}
                className="h-8 text-xs flex-1"
              />
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs shrink-0"
                disabled={addFollowupMutation.isPending || !followupText.trim()}
              >
                Kirim
              </Button>
            </form>

            {isLoading ? (
              <div className="py-4 text-center text-xs text-muted-foreground">
                Memuat riwayat tindak lanjut...
              </div>
            ) : !detail?.followups || detail.followups.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/70 p-4">
                Belum ada catatan tindak lanjut untuk mitra ini.
              </div>
            ) : (
              <div className="space-y-2.5">
                {detail.followups.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1 text-xs"
                  >
                    <p className="text-foreground leading-relaxed">{f.followupNote}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground/70 pt-1">
                      <span>{f.author?.fullName || f.author?.email || 'Tim Kemitraan'}</span>
                      <span>
                        {new Date(f.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
