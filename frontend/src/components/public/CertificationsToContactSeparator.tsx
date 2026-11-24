"use client";

import { ArrowDown, Mail, MessageSquare } from "lucide-react";

export default function CertificationsToContactSeparator() {
  return (
    <div className="relative py-10 sm:py-12 max-w-6xl mx-auto px-4 sm:px-8 select-none">
      {/* Background Soft Glow Halo */}
      <div className="absolute inset-x-1/4 top-1/2 -translate-y-1/2 h-12 bg-gradient-to-r from-text-tan/0 via-text-tan/10 to-text-tan/0 blur-2xl pointer-events-none" />

      <div className="relative flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Decorative Line with Gradient & Diamond Accent */}
        <div className="flex-1 relative flex items-center">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#C6A06B]/70 to-[#B08D5E] dark:via-text-tan/60 dark:to-text-tan shadow-xs" />
          <div className="absolute right-0 w-2.5 h-2.5 rotate-45 border-2 border-[#B08D5E] dark:border-text-tan bg-surface shadow-xs transition-transform duration-500 hover:rotate-90 hover:scale-125" />
        </div>

        {/* Center Section Pill / Divider Badge */}
        <a
          href="#contact"
          className="group/sep relative flex items-center gap-2.5 sm:gap-3.5 px-5 sm:px-7 py-2.5 rounded-full bg-surface-card/90 dark:bg-[#121B16]/90 border border-border hover:border-text-tan/70 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
          title="Scroll down to Contact Form"
        >
          {/* Subtle Accent Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-text-tan/10 opacity-0 group-hover/sep:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Left Pulsing Indicator Dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-text-tan opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-text-tan" />
          </span>

          {/* Center Text & Icon */}
          <div className="flex items-center gap-2 relative z-10">
            <Mail className="w-3.5 h-3.5 text-text-tan transition-transform duration-300 group-hover/sep:scale-110" />
            <span className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-foreground">
              LET&apos;S CONNECT
            </span>
          </div>

          {/* Mini Down Arrow Pill */}
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-btn-bg text-btn-text text-xs group-hover/sep:bg-btn-hover transition-colors shadow-xs ml-0.5">
            <ArrowDown className="w-3 h-3 group-hover/sep:translate-y-0.5 transition-transform" />
          </span>
        </a>

        {/* Right Decorative Line with Gradient & Diamond Accent */}
        <div className="flex-1 relative flex items-center">
          <div className="absolute left-0 w-2.5 h-2.5 rotate-45 border-2 border-[#B08D5E] dark:border-text-tan bg-surface shadow-xs transition-transform duration-500 hover:rotate-90 hover:scale-125" />
          <div className="w-full h-[2px] bg-gradient-to-l from-transparent via-[#C6A06B]/70 to-[#B08D5E] dark:via-text-tan/60 dark:to-text-tan shadow-xs" />
        </div>
      </div>
    </div>
  );
}
