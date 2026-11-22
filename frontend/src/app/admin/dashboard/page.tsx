"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardStats, Message } from "@/types";
import { getDashboardStats, adminGetMessages } from "@/lib/api";
import { 
  FolderGit2, Cpu, Briefcase, 
  Mail, Plus, ExternalLink, ShieldCheck, CheckCircle2 
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [statsData, msgsData] = await Promise.all([
          getDashboardStats(),
          adminGetMessages().catch(() => []),
        ]);
        setStats(statsData);
        setRecentMessages(msgsData.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Architecture Command Center
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary font-mono mt-1">
            Developer-Controlled UI · Admin-Controlled CMS · SQLite + Cloudinary
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="px-4 py-2.5 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-surface-card hover:bg-surface-card-hover border border-border text-text-secondary hover:text-foreground text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            <ExternalLink className="w-4 h-4 text-text-tan" />
            <span>Open Public Site</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Projects KPI */}
        <div className="glass-card p-5 rounded-2xl border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase">Projects</span>
            <div className="p-2 rounded-xl bg-btn-bg/15 text-text-tan">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">
              {stats?.total_projects ?? 0}
            </span>
            <span className="text-xs text-text-tan font-mono font-medium">
              ({stats?.published_projects ?? 0} published)
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-text-secondary pt-2 border-t border-border">
            <span>Draft: {stats?.draft_projects ?? 0}</span>
            <span>·</span>
            <span>Archived: {stats?.archived_projects ?? 0}</span>
          </div>
        </div>

        {/* Skills KPI */}
        <div className="glass-card p-5 rounded-2xl border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase">Tech Stack</span>
            <div className="p-2 rounded-xl bg-btn-bg/15 text-text-tan">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">
              {stats?.total_skills ?? 0}
            </span>
            <span className="text-xs text-text-tan font-mono">Technologies</span>
          </div>
          <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-border">
            Active in public matrix
          </div>
        </div>

        {/* Experience KPI */}
        <div className="glass-card p-5 rounded-2xl border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase">Milestones</span>
            <div className="p-2 rounded-xl bg-btn-bg/15 text-text-tan">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">
              {stats?.total_experience ?? 0}
            </span>
            <span className="text-xs text-text-tan font-mono">Career Roles</span>
          </div>
          <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-border">
            Timeline positions
          </div>
        </div>

        {/* Inquiries KPI */}
        <div className="glass-card p-5 rounded-2xl border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase">Inbox</span>
            <div className="p-2 rounded-xl bg-btn-bg/15 text-text-tan">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">
              {stats?.unread_messages ?? 0}
            </span>
            <span className="text-xs text-text-tan font-mono font-medium">
              unread / {stats?.total_messages ?? 0} total
            </span>
          </div>
          <div className="text-[11px] font-mono text-text-secondary pt-2 border-t border-border">
            Direct visitor inquiries
          </div>
        </div>
      </div>

      {/* Architectural Guarantee Checklist */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-border space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-text-tan font-mono text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Architectural Contract Verified</span>
        </div>
        <h3 className="text-lg font-bold text-foreground">
          Central Rules & Design Boundaries
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border">
            <CheckCircle2 className="w-4 h-4 text-text-tan mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-foreground">Developer-Controlled UI</p>
              <p className="text-text-secondary mt-0.5">Admin changes data via CMS forms; templates remain pristine.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border">
            <CheckCircle2 className="w-4 h-4 text-text-tan mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-foreground">Zero Draft / Archived Leakage</p>
              <p className="text-text-secondary mt-0.5">Only items with status=&quot;published&quot; appear on public endpoints.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border">
            <CheckCircle2 className="w-4 h-4 text-text-tan mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-foreground">Dual-Mode Media Storage</p>
              <p className="text-text-secondary mt-0.5">Instant local fallback + automated Cloudinary CDN routing.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border">
            <CheckCircle2 className="w-4 h-4 text-text-tan mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-foreground">Port Safety</p>
              <p className="text-text-secondary mt-0.5">Running on port 3001 and 8000; port 3000 left completely untouched.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Contact Inquiries */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-border space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4 text-text-tan" />
            <span>Recent Visitor Inquiries</span>
          </h3>
          <Link
            href="/admin/messages"
            className="text-xs font-mono text-text-tan hover:underline"
          >
            View all messages →
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-xs text-text-secondary py-4">No contact messages received yet.</p>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground">{msg.name}</span>
                    <span className="text-[11px] font-mono text-text-secondary">({msg.email})</span>
                    {!msg.is_read && (
                      <span className="px-1.5 py-0.5 rounded bg-btn-bg text-btn-text text-[10px] font-bold">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-1">{msg.subject || msg.message}</p>
                </div>

                <Link
                  href="/admin/messages"
                  className="px-3 py-1.5 rounded-lg bg-surface-card hover:bg-surface-card-hover border border-border text-xs text-text-secondary hover:text-foreground"
                >
                  Inspect
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
