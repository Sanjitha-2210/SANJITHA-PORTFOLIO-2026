"use client";

import { GraduationCap, Code2, ArrowRight } from "lucide-react";

export default function TheoryToPracticeBridge() {
  return (
    <div className="relative py-10 sm:py-12 max-w-6xl mx-auto px-4 sm:px-8 select-none">
      <div className="group/bridge relative flex items-center justify-between">
        
        {/* ========================================================= */}
        {/* 1. LEFT NODE: STUDIED (Education Anchor) */}
        {/* ========================================================= */}
        <a
          href="#education"
          className="group/left flex flex-col items-center gap-2.5 z-10 transition-transform duration-300 hover:scale-105 cursor-pointer"
          title="Jump to Academic Education"
        >
          {/* Circular Node with Ambient Hover Glow */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1F3327] dark:bg-[#132219] border-2 border-[#2D4A39] dark:border-[#264432] text-[#EDE8DC] dark:text-[#6EE7B7] flex items-center justify-center shadow-lg transition-all duration-300 group-hover/left:border-emerald-500 group-hover/left:shadow-[0_0_24px_rgba(16,185,129,0.45)]">
            <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover/left:rotate-[-8deg] group-hover/left:scale-110" />
            
            {/* Subtle Pulse Ring on Hover */}
            <span className="absolute inset-0 rounded-full border-2 border-emerald-500/0 group-hover/left:border-emerald-500/40 group-hover/left:animate-ping pointer-events-none" />
          </div>

          {/* Subtitle Label */}
          <span className="font-mono text-[11px] sm:text-xs font-black tracking-[0.25em] uppercase text-text-secondary dark:text-[#A3B899] transition-colors duration-200 group-hover/left:text-emerald-600 dark:group-hover/left:text-emerald-400">
            STUDIED
          </span>
        </a>

        {/* ========================================================= */}
        {/* 2. DOTTED PATH (LEFT SEGMENT: STUDIED -> CENTER) - Lengthy Span */}
        {/* ========================================================= */}
        <div className="flex-1 relative mx-4 sm:mx-8 lg:mx-12 flex items-center overflow-visible">
          <svg className="w-full h-4 overflow-visible" preserveAspectRatio="none">
            <line
              x1="0"
              y1="8"
              x2="100%"
              y2="8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="4 6"
              className="text-[#8A6A3C]/40 dark:text-[#D4B07C]/40 group-hover/bridge:text-text-tan dark:group-hover/bridge:text-[#D4B07C] group-hover/bridge:animate-dash-flow transition-colors duration-300"
            />
          </svg>
        </div>

        {/* ========================================================= */}
        {/* 3. CENTER PILL: THEORY TO PRACTICE BADGE */}
        {/* ========================================================= */}
        <div className="group/pill relative z-10 px-5 sm:px-8 py-2 sm:py-2.5 rounded-full bg-surface-card dark:bg-[#121B16] border border-border dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-text-tan cursor-default">
          {/* Ambient Inner Glow on Hover */}
          <div className="absolute inset-0 rounded-full bg-text-tan/5 opacity-0 group-hover/pill:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="flex items-center gap-2.5 relative z-10">
            <span className="font-mono text-xs sm:text-sm font-bold text-foreground dark:text-[#EDE8DC] tracking-wider lowercase">
              theory to practice
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-text-tan dark:text-[#D4B07C] opacity-60 group-hover/pill:opacity-100 group-hover/pill:translate-x-1 transition-all duration-200" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. DOTTED PATH (RIGHT SEGMENT: CENTER -> APPLIED) - Lengthy Span */}
        {/* ========================================================= */}
        <div className="flex-1 relative mx-4 sm:mx-8 lg:mx-12 flex items-center overflow-visible">
          <svg className="w-full h-4 overflow-visible" preserveAspectRatio="none">
            <line
              x1="0"
              y1="8"
              x2="100%"
              y2="8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="4 6"
              className="text-[#8A6A3C]/40 dark:text-[#D4B07C]/40 group-hover/bridge:text-text-tan dark:group-hover/bridge:text-[#D4B07C] group-hover/bridge:animate-dash-flow transition-colors duration-300"
            />
          </svg>
        </div>

        {/* ========================================================= */}
        {/* 5. RIGHT NODE: APPLIED (Skills Anchor) */}
        {/* ========================================================= */}
        <a
          href="#skills"
          className="group/right flex flex-col items-center gap-2.5 z-10 transition-transform duration-300 hover:scale-105 cursor-pointer"
          title="Jump to Applied Skills Radar"
        >
          {/* Circular Node with Ambient Golden Hover Glow */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#966E3A] dark:bg-[#785427] border-2 border-[#B08D5E] dark:border-[#8E6532] text-[#17140E] dark:text-[#EDE8DC] flex items-center justify-center shadow-lg transition-all duration-300 group-hover/right:border-[#D4B07C] group-hover/right:shadow-[0_0_24px_rgba(212,176,124,0.55)]">
            <Code2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5] transition-transform duration-300 group-hover/right:scale-110" />
            
            {/* Subtle Pulse Ring on Hover */}
            <span className="absolute inset-0 rounded-full border-2 border-[#D4B07C]/0 group-hover/right:border-[#D4B07C]/40 group-hover/right:animate-ping pointer-events-none" />
          </div>

          {/* Subtitle Label */}
          <span className="font-mono text-[11px] sm:text-xs font-black tracking-[0.25em] uppercase text-text-secondary dark:text-[#A3B899] transition-colors duration-200 group-hover/right:text-text-tan dark:group-hover/right:text-[#D4B07C]">
            APPLIED
          </span>
        </a>

      </div>
    </div>
  );
}
