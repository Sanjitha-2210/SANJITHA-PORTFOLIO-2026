"use client";

import { Sparkles, ArrowDown, FolderGit2 } from "lucide-react";

export default function SkillsToProjectsSeparator() {
  return (
    <div className="relative py-10 sm:py-12 max-w-6xl mx-auto px-4 sm:px-8 select-none">
      <div className="relative flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Decorative Line with Gradient & Diamond Accent */}
        <div className="flex-1 relative flex items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-text-tan/60" />
          <div className="hidden sm:block absolute right-0 w-2 h-2 rotate-45 border border-text-tan/70 bg-surface shadow-xs" />
        </div>

        {/* Center Section Pill / Divider Badge */}
        <a
          href="#projects"
          className="group/sep relative flex items-center gap-2.5 sm:gap-3.5 px-5 sm:px-7 py-2.5 rounded-full bg-surface-card/90 dark:bg-[#121B16]/90 border border-border hover:border-text-tan/70 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
          title="Scroll down to Project Journey"
        >
          {/* Subtle Accent Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-text-tan/5 opacity-0 group-hover/sep:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Left Pulsing Indicator Dot */}
          <span className="w-2 h-2 rounded-full bg-text-tan animate-pulse" />

          {/* Center Text & Icon */}
          <div className="flex items-center gap-2 relative z-10">
            <FolderGit2 className="w-3.5 h-3.5 text-text-tan" />
            <span className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-foreground">
              IDEAS INTO REALITY
            </span>
          </div>

          {/* Mini Down Arrow Pill */}
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-btn-bg text-btn-text text-xs group-hover/sep:bg-btn-hover transition-colors shadow-xs ml-0.5">
            <ArrowDown className="w-3 h-3 group-hover/sep:translate-y-0.5 transition-transform" />
          </span>
        </a>

        {/* Right Decorative Line with Gradient & Diamond Accent */}
        <div className="flex-1 relative flex items-center">
          <div className="hidden sm:block absolute left-0 w-2 h-2 rotate-45 border border-text-tan/70 bg-surface shadow-xs" />
          <div className="w-full h-px bg-gradient-to-l from-transparent via-border to-text-tan/60" />
        </div>
      </div>
    </div>
  );
}
