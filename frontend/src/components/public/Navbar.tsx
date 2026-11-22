"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, Shield } from "lucide-react";
import { Profile } from "@/types";
import ThemeToggle from "@/components/ThemeToggle";
import { isAuthenticated } from "@/lib/auth";

interface NavbarProps {
  profile: Profile | null;
  onOpenTerminal: () => void;
}

export default function Navbar({ profile, onOpenTerminal }: NavbarProps) {
  const name = profile?.full_name || "Sanjitha E";
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    setIsAdminLoggedIn(isAuthenticated());
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-40 px-4 max-w-7xl mx-auto">
      <nav className="glass-panel rounded-full px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between border border-border shadow-xl transition-colors duration-300">
        {/* Brand identity on Left: Keep only the round "SE" monogram */}
        <Link href="/" className="flex items-center group" title={name}>
          <div className="w-10 h-10 rounded-full bg-badge-circle border border-border p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-sm flex items-center justify-center">
            <span className="font-bold text-xs text-badge-circle-text tracking-wider uppercase">
              {name.split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2) || "SE"}
            </span>
          </div>
        </Link>

        {/* Section Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider text-text-secondary font-semibold">
          <a href="#education" className="hover:text-text-tan transition-colors">Education</a>
          <a href="#skills" className="hover:text-text-tan transition-colors">Skills</a>
          <a href="#projects" className="hover:text-text-tan transition-colors">Projects</a>
          <a href="#experience" className="hover:text-text-tan transition-colors">Experience</a>
          <a href="#certifications" className="hover:text-text-tan transition-colors">Certifications</a>
          <a href="#contact" className="hover:text-text-tan transition-colors">Contact</a>
        </div>

        {/* Actions: Theme Toggle, CLI Mode & Admin Portal */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          {/* CLI Mode Pill */}
          <button
            onClick={onOpenTerminal}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card border border-border text-foreground hover:border-text-tan text-xs font-mono transition-all shadow-sm"
            title="Open Interactive CLI Terminal (or press ~)"
          >
            <Terminal className="w-3.5 h-3.5 text-text-tan" />
            <span>CLI Mode</span>
            <kbd className="bg-surface px-1.5 py-0.5 rounded text-[10px] text-text-secondary">~</kbd>
          </button>

          {/* Admin CMS: Small outlined shield icon (about 40-44px round), styled like Dark and CLI Mode pills */}
          <Link
            href={isAdminLoggedIn ? "/admin/dashboard" : "/admin/login"}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-card border border-border hover:border-text-tan text-text-secondary hover:text-text-tan flex items-center justify-center transition-all shadow-sm relative group ${
              isAdminLoggedIn ? "border-text-tan/60 text-text-tan" : ""
            }`}
            title={isAdminLoggedIn ? "Admin Dashboard" : "Admin Login"}
          >
            <Shield className="w-4 h-4 transition-transform group-hover:scale-110" />
            {isAdminLoggedIn && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
