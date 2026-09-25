'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { useWorkItems, useSetWorkItemPic, WorkItemDrawer, type WorkItem } from '@/features/work-center';
import { useRequests } from '@/features/requests/api/use-requests';
import { useMeetings } from '@/features/meetings/api/use-meetings';
import { useCalendarEvents } from '@/features/calendar/api/use-calendar';
import { getDictionary } from '@/lib/i18n';
import {
  CheckSquare,
  FileSpreadsheet,
  Calendar,
  Clock,
  Inbox,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  UserCheck,
  Layers,
  Loader2,
  Video,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { AxiosError } from 'axios';

interface DashboardViewProps {
  currentUser: {
    id: string;
    fullName?: string | null;
    email: string;
    roles?: readonly string[];
    divisionCodes?: readonly string[];
    divisionId?: string | null;
  };
}

type DashboardTab = 'myTasks' | 'openTasks' | 'requests' | 'agenda';

export function DashboardView({ currentUser }: DashboardViewProps) {
  const dict = getDictionary();
  const [activeTab, setActiveTab] = useState<DashboardTab>('myTasks');
  const [selectedWorkItem, setSelectedWorkItem] = useState<WorkItem | null>(null);

  // 1. Data Fetching
  const { data: workItems = [], isLoading: isLoadingWorkItems } = useWorkItems({
    limit: 100,
  });
  const { data: requests = [], isLoading: isLoadingRequests } = useRequests({
    limit: 50,
  });
  const { data: meetings = [], isLoading: isLoadingMeetings } = useMeetings();
  const { data: calendarEvents = [], isLoading: isLoadingCalendar } = useCalendarEvents();

  const setPicMutation = useSetWorkItemPic();

  // 2. Computed Metrics
  // Pekerjaan aktif di mana user adalah PIC
  const myActiveTasks = useMemo(() => {
    return workItems.filter(
      (item) =>
        item.primaryPicId === currentUser.id &&
        item.status !== 'done' &&
        item.status !== 'canceled'
    );
  }, [workItems, currentUser.id]);

  const highPriorityTasksCount = useMemo(() => {
    return myActiveTasks.filter(
      (item) => item.priority === 'high' || item.priority === 'urgent'
    ).length;
  }, [myActiveTasks]);

  // Pekerjaan tanpa PIC (siap diklaim)
  const unassignedTasks = useMemo(() => {
    return workItems.filter(
      (item) =>
        !item.primaryPicId &&
        item.status !== 'done' &&
        item.status !== 'canceled'
    );
  }, [workItems]);

  // Pengajuan aktif (submitted, in_progress, need_clarification, need_review)
  const pendingRequests = useMemo(() => {
    return requests.filter((req) =>
      ['submitted', 'in_progress', 'need_clarification', 'need_review'].includes(req.status)
    );
  }, [requests]);

  // Agenda & rapat mendatang
  const upcomingMeetings = useMemo(() => {
    return meetings.slice(0, 5);
  }, [meetings]);

  const upcomingCalendarEvents = useMemo(() => {
    return calendarEvents.filter((ev) => !ev.isCancelled).slice(0, 5);
  }, [calendarEvents]);

  const totalUpcomingAgenda = upcomingMeetings.length + upcomingCalendarEvents.length;

  const userName = currentUser.fullName || currentUser.email.split('@')[0] || 'Anggota';

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // Quick claim task directly from dashboard
  const handleQuickClaim = async (task: WorkItem) => {
    try {
      await setPicMutation.mutateAsync({
        id: task.id,
        version: task.version,
        data: {
          primaryPicId: currentUser.id,
          note: 'Klaim penugasan mandiri dari Beranda.',
        },
      });
      toast.success(dict.workCenter.quickClaimSuccess);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 409) {
        toast.error(dict.workCenter.conflict.title);
      } else {
        toast.error('Gagal mengambil alih penanggung jawab pekerjaan.');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8 backdrop-blur-xs">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                WorkSpace v2.0
              </span>
              <span className="text-xs text-muted-foreground">{todayFormatted}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {dict.dashboard.welcome.replace('{name}', userName)}
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              {dict.dashboard.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2 sm:pt-0">
            <Button asChild size="sm" className="gap-2 shadow-xs">
              <Link href="/work-center">
                <CheckSquare className="h-4 w-4" />
                <span>{dict.dashboard.viewAllWorkCenter}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2 bg-card/60">
              <Link href="/requests">
                <FileSpreadsheet className="h-4 w-4" />
                <span>{dict.dashboard.viewAllRequests}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Dynamic Live Metrics Grid (Clickable to switch tab) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Pekerjaan Aktif PIC */}
        <Card
          onClick={() => setActiveTab('myTasks')}
          className={cn(
            'border-border/70 shadow-xs hover:border-primary/60 transition-all cursor-pointer group',
            activeTab === 'myTasks' && 'ring-2 ring-primary/40 border-primary/60 bg-primary/5'
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              {dict.dashboard.activeWorkItems}
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <CheckSquare className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingWorkItems ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {myActiveTasks.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                  <span>
                    {dict.dashboard.highPriorityTasks.replace(
                      '{count}',
                      highPriorityTasksCount.toString()
                    )}
                  </span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Metric 2: Menunggu Telaah */}
        <Card
          onClick={() => setActiveTab('requests')}
          className={cn(
            'border-border/70 shadow-xs hover:border-amber-500/60 transition-all cursor-pointer group',
            activeTab === 'requests' && 'ring-2 ring-amber-500/40 border-amber-500/60 bg-amber-500/5'
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              {dict.dashboard.pendingRequests}
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingRequests ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {pendingRequests.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {dict.dashboard.pendingRequestsSubtitle}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Metric 3: Agenda Mendatang */}
        <Card
          onClick={() => setActiveTab('agenda')}
          className={cn(
            'border-border/70 shadow-xs hover:border-purple-500/60 transition-all cursor-pointer group',
            activeTab === 'agenda' && 'ring-2 ring-purple-500/40 border-purple-500/60 bg-purple-500/5'
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              {dict.dashboard.upcomingEvents}
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingMeetings || isLoadingCalendar ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {totalUpcomingAgenda}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {dict.dashboard.upcomingEventsSubtitle}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Metric 4: Pekerjaan Tanpa PIC */}
        <Card
          onClick={() => setActiveTab('openTasks')}
          className={cn(
            'border-border/70 shadow-xs hover:border-emerald-500/60 transition-all cursor-pointer group',
            activeTab === 'openTasks' && 'ring-2 ring-emerald-500/40 border-emerald-500/60 bg-emerald-500/5'
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              {dict.dashboard.unassignedWorkItems}
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <Inbox className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingWorkItems ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {unassignedTasks.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {dict.dashboard.unassignedSubtitle}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs / Sub-Sections Navigation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/80 pb-2 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant={activeTab === 'myTasks' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('myTasks')}
              className="gap-2 text-xs font-semibold"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span>{dict.dashboard.tabMyTasks}</span>
              <span className="ml-1 rounded-full bg-primary-foreground/20 px-1.5 py-0.2 text-[10px]">
                {myActiveTasks.length}
              </span>
            </Button>

            <Button
              variant={activeTab === 'openTasks' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('openTasks')}
              className="gap-2 text-xs font-semibold"
            >
              <Inbox className="h-3.5 w-3.5" />
              <span>{dict.dashboard.tabOpenTasks}</span>
              {unassignedTasks.length > 0 && (
                <span className="ml-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 text-[10px] font-bold">
                  {unassignedTasks.length}
                </span>
              )}
            </Button>

            <Button
              variant={activeTab === 'requests' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('requests')}
              className="gap-2 text-xs font-semibold"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>{dict.dashboard.tabRequests}</span>
              <span className="ml-1 rounded-full bg-muted text-muted-foreground px-1.5 py-0.2 text-[10px]">
                {pendingRequests.length}
              </span>
            </Button>

            <Button
              variant={activeTab === 'agenda' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('agenda')}
              className="gap-2 text-xs font-semibold"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{dict.dashboard.tabAgenda}</span>
              <span className="ml-1 rounded-full bg-muted text-muted-foreground px-1.5 py-0.2 text-[10px]">
                {totalUpcomingAgenda}
              </span>
            </Button>
          </div>

          <div className="hidden sm:block">
            {activeTab === 'myTasks' && (
              <Button asChild variant="link" size="sm" className="text-xs text-primary gap-1">
                <Link href="/work-center">
                  <span>{dict.dashboard.viewAllWorkCenter}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            )}
            {activeTab === 'openTasks' && (
              <Button asChild variant="link" size="sm" className="text-xs text-primary gap-1">
                <Link href="/work-center">
                  <span>{dict.dashboard.viewAllWorkCenter}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            )}
            {activeTab === 'requests' && (
              <Button asChild variant="link" size="sm" className="text-xs text-primary gap-1">
                <Link href="/requests">
                  <span>{dict.dashboard.viewAllRequests}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            )}
            {activeTab === 'agenda' && (
              <Button asChild variant="link" size="sm" className="text-xs text-primary gap-1">
                <Link href="/calendar">
                  <span>{dict.dashboard.viewAllCalendar}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Tab 1: Tugas Saya (My Work Items) */}
        {activeTab === 'myTasks' && (
          <div className="space-y-3">
            {isLoadingWorkItems ? (
              <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Memuat pekerjaan aktif Anda...</span>
              </div>
            ) : myActiveTasks.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title={dict.dashboard.emptyMyTasks}
                description="Semua pekerjaan Anda telah selesai atau belum ada tiket baru yang ditugaskan kepada Anda."
                actionLabel={dict.dashboard.viewAllWorkCenter}
                onAction={() => {
                  window.location.href = '/work-center';
                }}
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {myActiveTasks.map((task) => {
                  const isOverdue =
                    task.dueDate &&
                    new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

                  return (
                    <Card
                      key={task.id}
                      onClick={() => setSelectedWorkItem(task)}
                      className="border-border/80 hover:border-primary/60 transition-all cursor-pointer group bg-card/70 hover:shadow-md flex flex-col justify-between"
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-mono text-[11px] font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                            {task.workNumber}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="text-[11px] capitalize">
                              {dict.priorities[task.priority] ?? task.priority}
                            </Badge>
                            <Badge variant="secondary" className="text-[11px] font-medium">
                              {dict.statuses.workItems[task.status] ?? task.status}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {task.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                          <span>{dict.types.workItems[task.type] ?? task.type}</span>
                          {task.divisionName && (
                            <>
                              <span>•</span>
                              <span>{task.divisionName}</span>
                            </>
                          )}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="p-4 pt-2 space-y-2.5">
                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                            <span>Kemajuan</span>
                            <span className="font-mono">{task.progressPercentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${task.progressPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Due Date & Story Points */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span
                              className={cn(
                                isOverdue && 'text-rose-600 dark:text-rose-400 font-semibold'
                              )}
                            >
                              {task.dueDate
                                ? new Intl.DateTimeFormat('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                  }).format(new Date(task.dueDate))
                                : '-'}
                            </span>
                            {isOverdue && (
                              <span className="text-[10px] bg-rose-500/15 text-rose-600 dark:text-rose-400 px-1 py-0.2 rounded font-semibold">
                                {dict.dashboard.overdue}
                              </span>
                            )}
                          </div>

                          {task.storyPoints > 0 && (
                            <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                              <span>⚡</span>
                              <span>{task.storyPoints} SP</span>
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Tiket Terbuka Siap Diklaim (Open Tasks) */}
        {activeTab === 'openTasks' && (
          <div className="space-y-3">
            {isLoadingWorkItems ? (
              <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Memuat tiket terbuka...</span>
              </div>
            ) : unassignedTasks.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title={dict.dashboard.emptyOpenTasks}
                description="Semua tiket pekerjaan aktif saat ini telah memiliki penanggung jawab (PIC)."
                actionLabel={dict.dashboard.viewAllWorkCenter}
                onAction={() => {
                  window.location.href = '/work-center';
                }}
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {unassignedTasks.map((task) => (
                  <Card
                    key={task.id}
                    onClick={() => setSelectedWorkItem(task)}
                    className="border-border/80 hover:border-emerald-500/60 transition-all cursor-pointer group bg-card/70 hover:shadow-md flex flex-col justify-between"
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                          {task.workNumber}
                        </span>
                        <Badge variant="outline" className="text-[11px] capitalize">
                          {dict.priorities[task.priority] ?? task.priority}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {task.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                        <Layers className="h-3 w-3 text-muted-foreground" />
                        <span>{task.divisionName || 'Lintas Divisi'}</span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-4 pt-2 space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{dict.workCenter.drawer.noPic}</span>
                        </span>

                        {task.storyPoints > 0 && (
                          <span className="font-semibold text-foreground">
                            ⚡ {task.storyPoints} SP
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedWorkItem(task)}
                          className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                        >
                          {dict.dashboard.viewDetail}
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleQuickClaim(task);
                          }}
                          disabled={setPicMutation.isPending}
                          className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                        >
                          {setPicMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <UserCheck className="h-3.5 w-3.5" />
                          )}
                          <span>{dict.dashboard.quickClaim}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Pengajuan & Permintaan */}
        {activeTab === 'requests' && (
          <div className="space-y-3">
            {isLoadingRequests ? (
              <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Memuat pengajuan...</span>
              </div>
            ) : pendingRequests.length === 0 ? (
              <EmptyState
                icon={FileSpreadsheet}
                title={dict.dashboard.emptyRequests}
                description="Tidak ada pengajuan yang membutuhkan persetujuan atau telaah mendesak saat ini."
                actionLabel={dict.dashboard.viewAllRequests}
                onAction={() => {
                  window.location.href = '/requests';
                }}
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pendingRequests.map((req) => (
                  <Link key={req.id} href="/requests" className="block group">
                    <Card className="border-border/80 hover:border-amber-500/60 transition-all cursor-pointer bg-card/70 hover:shadow-md flex flex-col justify-between h-full">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-500/10">
                            {req.requestNumber}
                          </span>
                          <Badge variant="outline" className="text-[11px] capitalize">
                            {dict.priorities[req.priority] ?? req.priority}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-semibold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                          {req.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                          <span>{req.targetDivisionName || 'Divisi Tujuan'}</span>
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="p-4 pt-2 space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                          <span className="truncate max-w-37.5">
                            Oleh: {req.requesterName || 'Anggota'}
                          </span>
                          <Badge variant="secondary" className="text-[11px]">
                            {dict.statuses.requests?.[req.status] ?? req.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Agenda & Rapat Mendatang */}
        {activeTab === 'agenda' && (
          <div className="space-y-4">
            {isLoadingMeetings || isLoadingCalendar ? (
              <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Memuat agenda dan rapat...</span>
              </div>
            ) : totalUpcomingAgenda === 0 ? (
              <EmptyState
                icon={Calendar}
                title={dict.dashboard.emptyAgenda}
                description="Belum ada agenda rapat atau kegiatan tim yang dijadwalkan dalam waktu dekat."
                actionLabel={dict.dashboard.viewAllCalendar}
                onAction={() => {
                  window.location.href = '/calendar';
                }}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {/* Rapat Section */}
                <Card className="border-border/80">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <CardTitle className="text-sm font-bold">
                          {dict.dashboard.meetingsTitle}
                        </CardTitle>
                      </div>
                      <Button asChild variant="ghost" size="sm" className="text-xs h-7 px-2">
                        <Link href="/meetings">{dict.dashboard.viewAllMeetings}</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingMeetings.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">
                        {dict.dashboard.emptyMeetings}
                      </p>
                    ) : (
                      upcomingMeetings.map((m) => (
                        <div
                          key={m.id}
                          className="rounded-lg border border-border/60 p-3 bg-muted/20 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-foreground">{m.title}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {m.meetingType}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Intl.DateTimeFormat('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              }).format(new Date(m.heldAt))}
                            </span>
                            {m.locationOrMedia && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {m.locationOrMedia}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Kalender Section */}
                <Card className="border-border/80">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <CardTitle className="text-sm font-bold">
                          {dict.dashboard.agendaTitle}
                        </CardTitle>
                      </div>
                      <Button asChild variant="ghost" size="sm" className="text-xs h-7 px-2">
                        <Link href="/calendar">{dict.dashboard.viewAllCalendar}</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingCalendarEvents.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">
                        {dict.dashboard.emptyAgenda}
                      </p>
                    ) : (
                      upcomingCalendarEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="rounded-lg border border-border/60 p-3 bg-muted/20 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-foreground">{ev.title}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {ev.eventType}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Intl.DateTimeFormat('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              }).format(new Date(ev.startAt))}
                            </span>
                            {ev.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {ev.location}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Work Item Drawer */}
      <WorkItemDrawer
        selectedItem={selectedWorkItem}
        currentUserId={currentUser.id}
        currentUser={currentUser}
        onClose={() => setSelectedWorkItem(null)}
      />
    </div>
  );
}
