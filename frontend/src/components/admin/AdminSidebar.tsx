"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, FolderGit2, Cpu, Briefcase, 
  Award, User, MessageSquare, ExternalLink, LogOut, Shield, GraduationCap,
  Milestone as MilestoneIcon
} from "lucide-react";
import { removeAuthToken } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";

interface AdminSidebarProps {
  unreadCount?: number;
}

export default function AdminSidebar({ unreadCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    removeAuthToken();
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Education Cards", href: "/admin/education", icon: GraduationCap },
    { label: "Timeline Milestones", href: "/admin/milestones", icon: MilestoneIcon },
    { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { label: "Skills", href: "/admin/skills", icon: Cpu },
    { label: "Experience", href: "/admin/experience", icon: Briefcase },
    { label: "Certifications", href: "/admin/certifications", icon: Award },
    { label: "Profile", href: "/admin/profile", icon: User },
    { 
      label: "Messages", 
      href: "/admin/messages", 
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined 
    },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col justify-between p-5 min-h-screen fixed left-0 top-0 bottom-0 z-30 transition-colors">
      <div>
        {/* Brand & Theme Toggle */}
        <div className="flex items-center justify-between px-2 py-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-btn-bg/15 border border-border flex items-center justify-center text-text-tan">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-foreground tracking-wide">CMS Admin</h1>
              <p className="text-[10px] font-mono text-text-tan">Content Control</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-btn-bg text-btn-text font-bold shadow-sm"
                    : "text-text-secondary hover:text-foreground hover:bg-surface-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-btn-text" : "text-text-secondary"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-btn-bg text-btn-text text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation: Live Website & Logout */}
      <div className="pt-6 border-t border-border space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-card border border-border text-text-secondary hover:text-foreground hover:border-text-tan text-xs font-medium transition-all shadow-sm"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-text-tan" />
            <span>View Public Site</span>
          </div>
          <span className="text-[10px] font-mono text-text-secondary">:3001</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-text-secondary hover:text-red-500 hover:bg-red-500/10 text-xs font-medium transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
