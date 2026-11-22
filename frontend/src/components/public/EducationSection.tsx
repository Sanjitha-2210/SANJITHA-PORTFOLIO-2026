"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { GraduationCap, BookOpen, ArrowRight, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { Education, Milestone } from "@/types";

interface EducationSectionProps {
  education?: Education[];
  milestones?: Milestone[];
}

// Circular Donut Gauge with smooth scroll-animated count-up
function CircularScoreGauge({
  score,
  percentage,
  label,
  strokeColor,
  trackClass,
  textColorClass,
  sublabelColorClass,
}: {
  score: string;
  percentage: number;
  label: string;
  strokeColor: string;
  trackClass?: string;
  textColorClass?: string;
  sublabelColorClass?: string;
}) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            strokeWidth="8.5"
            className={trackClass || "stroke-text-tan/25"}
          />
          {/* Animated active score progress arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="8.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </svg>
        <span className={`absolute font-extrabold text-base sm:text-lg tracking-tight ${textColorClass || "text-foreground"}`}>
          {score}
        </span>
      </div>
      <span className={`text-[10px] sm:text-[11px] font-mono tracking-wider uppercase mt-1.5 font-bold ${sublabelColorClass || "text-text-secondary"}`}>
        {label}
      </span>
    </div>
  );
}

const defaultMilestones: Milestone[] = [
  {
    year: 2022,
    pct: 0,
    title: "Higher Secondary (HSC) Inception",
    subtitle: "Began Mathematics with Computer Science at Perambalur Govt Model School",
    period: "June 2022",
    status: "Completed",
  },
  {
    year: 2023,
    pct: 16.67,
    title: "Foundations in Computational Sciences",
    subtitle: "Advanced calculus, discrete algebra, binary logic & core algorithms",
    period: "2022 — 2023",
    status: "Completed",
  },
  {
    year: 2024,
    pct: 33.33,
    title: "HSC 88.5% & B.E. College Entry",
    subtitle: "Joined B.E. Computer Science Engineering (AI & ML) at KPR Institute, Coimbatore",
    period: "June 2024",
    status: "Completed",
  },
  {
    year: 2025,
    pct: 50.0,
    title: "Core AI & Scalable Systems",
    subtitle: "Neural networks, data structures, and high-throughput microservices",
    period: "2024 — 2025",
    status: "Completed",
  },
  {
    year: 2026,
    pct: 66.67,
    title: "Autonomous Agentic Engineering",
    subtitle: "Engineering LLM agent swarms, RAG architectures & full-stack platforms",
    period: "2025 — 2026",
    status: "In Progress",
  },
  {
    year: 2027,
    pct: 83.33,
    title: "Senior Engineering & Capstone",
    subtitle: "Advanced distributed architectures, ML publications & enterprise systems",
    period: "2026 — 2027",
    status: "Upcoming",
  },
  {
    year: 2028,
    pct: 100,
    title: "Expected B.E. Graduation",
    subtitle: "B.E. Computer Science Engineering (AI & ML) Degree Conferred",
    period: "May 2028",
    status: "Upcoming",
  },
];

export default function EducationSection({ education, milestones }: EducationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [animatedHscScore, setAnimatedHscScore] = useState(0);
  const [animatedBtechScore, setAnimatedBtechScore] = useState(0);
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);

  const activeMilestones = useMemo(() => {
    if (milestones && milestones.length > 0) {
      return milestones;
    }
    return defaultMilestones;
  }, [milestones]);

  // Dynamic Boundary Clamping for Milestone Tooltips (Prevents left & right screen clipping)
  const getTooltipPosition = (pct: number) => {
    // Left boundary: year 2022 (pct 0) or early years: keep card within container by pinning left: 0px
    if (pct <= 22) {
      return {
        container: { left: "0px", right: "auto", transform: "none" } as React.CSSProperties,
        arrow: { left: `clamp(24px, ${pct === 0 ? "24px" : `${Math.max(12, pct * 2.5)}%`}, 85%)`, transform: "translateX(-50%)" } as React.CSSProperties,
      };
    }
    // Right boundary: year 2028 (pct 100) or late years: keep card within container by pinning right: 0px
    if (pct >= 78) {
      return {
        container: { right: "0px", left: "auto", transform: "none" } as React.CSSProperties,
        arrow: { right: `clamp(24px, ${pct === 100 ? "24px" : `${Math.max(12, (100 - pct) * 2.5)}%`}, 85%)`, left: "auto", transform: "translateX(50%)" } as React.CSSProperties,
      };
    }
    // Middle years: centered directly over the tick mark
    return {
      container: { left: `${pct}%`, right: "auto", transform: "translateX(-50%)" } as React.CSSProperties,
      arrow: { left: "50%", right: "auto", transform: "translateX(-50%)" } as React.CSSProperties,
    };
  };

  // Extract or fallback items
  const bTechItem = education?.find(
    (e) =>
      e.degree.toLowerCase().includes("b.e") ||
      e.degree.toLowerCase().includes("computer") ||
      e.icon === "degree"
  ) || {
    id: 1,
    degree: "B.E. Computer Science Engineering (AI & ML)",
    institution: "KPR Institute of Engineering and Technology, Coimbatore",
    period: "2024 — 2028",
    metrics: "8.7",
    tags: "AI & ML",
    icon: "degree",
    status: "published",
    order_index: 1,
  };

  const hscItem = education?.find(
    (e) =>
      e.degree.toLowerCase().includes("hsc") ||
      e.degree.toLowerCase().includes("school") ||
      e.icon === "school"
  ) || {
    id: 2,
    degree: "HSC: Mathematics with Computer Science",
    institution: "Perambalur Govt Model School, Perambalur",
    period: "2022 — 2024",
    metrics: "88.5%",
    tags: "Mathematics, Computer Science",
    icon: "school",
    status: "published",
    order_index: 2,
  };

  const hscTags = Array.isArray(hscItem.tags)
    ? hscItem.tags
    : typeof hscItem.tags === "string"
    ? hscItem.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : ["Mathematics", "Computer Science"];

  const bTechTags = Array.isArray(bTechItem.tags)
    ? bTechItem.tags
    : typeof bTechItem.tags === "string"
    ? bTechItem.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : ["AI & ML"];

  // ==========================================
  // SCROLL-TRIGGERED OBSERVER & NUMBER COUNT-UP
  // ==========================================
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const targetHsc = 88.5;
    const targetBtech = 8.7;
    const duration = 1400; // ms
    const startTime = performance.now();

    const animateScores = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth cubic ease-out curve
      const ease = 1 - Math.pow(1 - progress, 3);

      setAnimatedHscScore(parseFloat((ease * targetHsc).toFixed(1)));
      setAnimatedBtechScore(parseFloat((ease * targetBtech).toFixed(1)));

      if (progress < 1) {
        requestAnimationFrame(animateScores);
      } else {
        setAnimatedHscScore(targetHsc);
        setAnimatedBtechScore(targetBtech);
      }
    };

    const frame = requestAnimationFrame(animateScores);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  // ==========================================
  // REAL-TIME AUTOMATIC DATE & TIMELINE ENGINE
  // ==========================================
  const timelineData = useMemo(() => {
    const startYear = 2022;
    const endYear = 2028;
    const totalSpan = endYear - startYear; // 6 years

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    const currentDateFloat = currentYear + currentMonth / 12;

    // Clamped date between 2022 and 2028
    const clampedDate = Math.max(startYear, Math.min(endYear, currentDateFloat));

    // Calculate percentage along total 6-year axis (0% to 100%)
    const todayPct = ((clampedDate - startYear) / totalSpan) * 100;

    // HSC segment: 2022 to 2024 = 2 years / 6 years = 33.33%
    const hscPct = ((2024 - 2022) / totalSpan) * 100;

    // B.E. active progress: from 2024 (33.33%) up to today
    const beActiveWidth = Math.max(0, todayPct - hscPct);

    // Remaining future progress until 2028: from today to 100%
    const remainingWidth = Math.max(0, 100 - todayPct);

    const yearTicks = [2022, 2023, 2024, 2025, 2026, 2027, 2028].map((yr) => ({
      year: yr,
      pct: ((yr - startYear) / totalSpan) * 100,
    }));

    return {
      hscPct,
      todayPct,
      beActiveWidth,
      remainingWidth,
      yearTicks,
      currentYear,
      displayDateLabel: now.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
  }, []);

  return (
    <section 
      id="education" 
      ref={sectionRef}
      className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10"
    >
      {/* 1. FADING LINE WITH A NODE SEPARATOR BETWEEN HERO AND ACADEMIC JOURNEY */}
      <div className="group/separator w-full max-w-5xl sm:max-w-6xl mx-auto flex items-center justify-center mb-16 sm:mb-20 select-none">
        {/* Left fading tan line */}
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#C6A06B]/30 to-[#B08D5E]/85 transition-all duration-500 group-hover/separator:via-[#C6A06B]/60 group-hover/separator:to-[#D4B07C]" />
        
        {/* Center circular badge node with enlarged presence and smooth hover effects */}
        <div className="relative mx-3.5 sm:mx-4.5 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all duration-500 ease-out flex-shrink-0
          bg-[#FAF7F0] border-[#D4B07C]/50 text-[#8C6D42] shadow-[0_3px_12px_rgba(176,141,94,0.22)]
          dark:bg-[#16221D] dark:border-[#D4B07C]/50 dark:text-[#D4B07C]
          group-hover/separator:scale-115 group-hover/separator:border-[#D4B07C] group-hover/separator:shadow-[0_0_24px_rgba(212,176,124,0.6)]">
          <GraduationCap className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-500 ease-out group-hover/separator:rotate-12 group-hover/separator:scale-110" />
        </div>

        {/* Right fading tan line */}
        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-[#C6A06B]/30 to-[#B08D5E]/85 transition-all duration-500 group-hover/separator:via-[#C6A06B]/60 group-hover/separator:to-[#D4B07C]" />
      </div>

      {/* 2. Section Header Matching User's Exact Copy */}
      <div className="mb-10 sm:mb-14">
        <div className="flex items-center gap-2 text-text-tan font-mono text-xs tracking-widest uppercase mb-2.5 font-bold">
          <GraduationCap className="w-4 h-4 text-text-tan" />
          <span>Academic Journey</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          CHAPTERS OF LEARNING
        </h2>
        <p className="text-sm sm:text-base text-text-secondary mt-2 max-w-2xl font-medium">
          Every chapter adding something new to my journey.
        </p>
      </div>

      {/* 3. OPTION 3: THE GRADIENT STORYBOARD SLATE MASTER GLASS CONTAINER WITH HOVER SPOTLIGHT */}
      <div className="group/canvas relative rounded-[32px] sm:rounded-[44px] p-6 sm:p-9 lg:p-12 overflow-hidden backdrop-blur-2xl border border-border shadow-2xl transition-all duration-500 hover:shadow-[0_25px_65px_-15px_rgba(27,59,43,0.3)] dark:hover:shadow-[0_25px_65px_-15px_rgba(212,176,124,0.2)] hover:border-text-tan/50 bg-gradient-to-r from-[#F7EFE2]/85 via-[#FAF6EE]/50 to-[#122A1E]/85 dark:from-[#262016]/80 dark:via-[#16221D]/60 dark:to-[#0B1E15]/90">
        
        {/* Dynamic Light Sheen overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover/canvas:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[inherit]" />

        {/* Ambient Radial Lights behind the Storyboard Canvas */}
        <div className="absolute -top-14 -left-14 w-80 h-80 rounded-full bg-[#B08D5E]/15 dark:bg-[#B08D5E]/10 blur-3xl pointer-events-none -z-10 group-hover/canvas:scale-110 transition-transform duration-700" />
        <div className="absolute -bottom-14 -right-14 w-96 h-96 rounded-full bg-emerald-500/20 dark:bg-emerald-400/15 blur-3xl pointer-events-none -z-10 group-hover/canvas:scale-110 transition-transform duration-700" />

        {/* Master Showcase Top Bar: Clear High-Contrast (2022 — 2028 (Undergraduate)) badge */}
        <div className="flex items-center justify-end mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-card/90 dark:bg-black/60 border border-border/80 text-foreground dark:text-[#EDE8DC] font-mono text-xs font-bold tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-text-tan animate-pulse" />
            <span>2022 — 2028 (Undergraduate)</span>
          </div>
        </div>

        {/* 4. The Dual Cards (MATCHING IDENTICAL HEIGHT) & Carried Over Bridge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: HSC (Warm Ivory Card) - Stretches to match exact height of Card 2 */}
          <div className="lg:col-span-5 relative rounded-3xl p-6 sm:p-7 bg-[#FAF7F0] dark:bg-[#16221D] border border-[#E5DEC9] dark:border-border shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between h-full">
            {/* Top Row: Icon + Badge + Timeline */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-foreground">
                  <BookOpen className="w-5 h-5 text-foreground" />
                </div>
                <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[11px] font-mono text-foreground/80 font-bold border border-black/5 dark:border-white/10">
                  Completed
                </span>
              </div>
              <span className="font-mono text-xs sm:text-[13px] font-semibold text-text-secondary tracking-wider">
                {hscItem.period || "2022 — 2024"}
              </span>
            </div>

            {/* Middle & Bottom Row: Content + Circular Donut Score with Count-Up */}
            <div className="flex items-start justify-between gap-4 flex-1">
              <div className="flex flex-col justify-between h-full flex-1">
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight leading-snug">
                    {hscItem.degree}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary font-medium">
                    {hscItem.institution}
                  </p>
                </div>

                {/* Tags aligned to bottom */}
                <div className="flex flex-wrap gap-1.5 pt-6 mt-auto">
                  {hscTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground/90 text-xs font-mono font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Circular Gauge with Live Count-Up */}
              <div className="mt-auto pb-1">
                <CircularScoreGauge
                  score={`${animatedHscScore.toFixed(1)}%`}
                  percentage={inView ? animatedHscScore : 0}
                  label="HSC score"
                  strokeColor="#B08D5E"
                  trackClass="stroke-text-tan/20 dark:stroke-white/10"
                  textColorClass="text-foreground"
                  sublabelColorClass="text-text-secondary"
                />
              </div>
            </div>
          </div>

          {/* Transition Bridge: Carried Over Arrow - Centered Vertically with Ambient Pulse */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0 text-center space-y-2 select-none self-center group/bridge">
            <span className="font-mono text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-text-tan transition-colors group-hover/bridge:text-[#D4B07C]">
              Carried Over
            </span>
            <div className="w-10 h-10 rounded-full bg-surface-card border border-border flex items-center justify-center text-text-tan shadow-xs transition-all duration-300 group-hover/bridge:scale-115 group-hover/bridge:border-text-tan group-hover/bridge:shadow-[0_0_15px_rgba(212,176,124,0.45)]">
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/bridge:translate-x-0.5" />
            </div>
            <p className="text-[11px] text-text-secondary font-medium leading-snug max-w-[130px]">
              Maths + programming became the base for AI & ML
            </p>
          </div>

          {/* Card 2: B.E. College Card - Stretches to match exact height of Card 1
              Light mode: Deep Forest Green (#1A382A) with cream text
              Dark mode: #F3EFE6 Light page background with dark text (#1F2A24) matching the Profile Card theme */}
          <div className="lg:col-span-5 relative rounded-3xl p-6 sm:p-7 transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between h-full
            bg-[#1A382A] text-[#EDE8DC] border border-[#2D563E]
            dark:bg-[#F3EFE6] dark:text-[#1F2A24] dark:border-[#D6CFBF]">
            
            {/* Top Row: Icon + In progress Badge + Timeline */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center border transition-colors
                  bg-[#234937] text-[#D4B07C] border-[#356B52]
                  dark:bg-[#E5DEC9] dark:text-[#8C6D42] dark:border-[#D6CFBF]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border transition-colors
                  bg-[#234937] border-[#34D399]/30 text-[#6EE7B7]
                  dark:bg-[#E2DDD0] dark:border-[#1E6B42]/30 dark:text-[#1E6B42]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] dark:bg-[#1E6B42] animate-pulse"></span>
                  In progress
                </span>
              </div>
              <span className="font-mono text-xs sm:text-[13px] font-semibold tracking-wider transition-colors
                text-[#D4B07C] dark:text-[#8C6D42]">
                {bTechItem.period || "2024 — 2028"}
              </span>
            </div>

            {/* Middle & Bottom Row: Content + Circular Donut Score with Count-Up */}
            <div className="flex items-start justify-between gap-4 flex-1">
              <div className="flex flex-col justify-between h-full flex-1">
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug transition-colors
                    text-white dark:text-[#1F2A24]">
                    {bTechItem.degree}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium transition-colors
                    text-[#A7C2B2] dark:text-[#52665B]">
                    {bTechItem.institution}
                  </p>
                </div>

                {/* Tags aligned to bottom */}
                <div className="flex flex-wrap gap-1.5 pt-6 mt-auto">
                  {bTechTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl text-xs font-mono font-medium border transition-colors
                        bg-[#142B20] border-[#2D563E] text-[#EDE8DC]
                        dark:bg-[#E5DEC9] dark:border-[#D6CFBF] dark:text-[#1F2A24]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Circular Gauge for CGPA with Live Count-Up */}
              <div className="mt-auto pb-1">
                <CircularScoreGauge
                  score={animatedBtechScore.toFixed(1)}
                  percentage={inView ? (animatedBtechScore / 10) * 100 : 0}
                  label="CGPA / 10"
                  strokeColor="#D4B07C"
                  trackClass="stroke-black/10 dark:stroke-black/15"
                  textColorClass="text-white dark:text-[#1F2A24]"
                  sublabelColorClass="text-[#A7C2B2] dark:text-[#52665B]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. INTERACTIVE TIMELINE TRACK WITH BOUNDARY-CLAMPED MILESTONE POPUPS */}
        <div className="mt-14 sm:mt-16 relative group/track">

          {/* Floating Milestone Card Tooltip on Hover */}
          {hoveredMilestone !== null && activeMilestones[hoveredMilestone] && (() => {
            const currentMilestone = activeMilestones[hoveredMilestone];
            const pos = getTooltipPosition(currentMilestone.pct);

            return (
              <div
                style={pos.container}
                className="absolute -top-32 sm:-top-36 z-30 pointer-events-none w-64 sm:w-80 p-3.5 sm:p-4 rounded-2xl glass-panel bg-panel-bg/98 dark:bg-[#F3EFE6] dark:text-[#1F2A24] dark:border-[#D6CFBF] border border-border shadow-2xl transition-all duration-200 ease-out animate-in fade-in zoom-in-95"
              >
                {/* Header with year, period & status pill */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-text-tan dark:text-[#8C6D42]">
                    {currentMilestone.year} • {currentMilestone.period}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                      currentMilestone.status === "Completed"
                        ? "bg-[#B08D5E]/20 text-[#B08D5E] dark:bg-[#B08D5E]/25 dark:text-[#8C6D42]"
                        : currentMilestone.status === "In Progress"
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-700 font-bold"
                        : "bg-surface-card border border-border text-text-secondary"
                    }`}
                  >
                    {currentMilestone.status === "Completed" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    <span>{currentMilestone.status}</span>
                  </span>
                </div>

                {/* Milestone Title & Description */}
                <h4 className="font-extrabold text-xs sm:text-[13px] text-foreground dark:text-[#1F2A24] leading-snug">
                  {currentMilestone.title}
                </h4>
                <p className="text-[11px] text-text-secondary dark:text-[#52665B] mt-1 leading-relaxed">
                  {currentMilestone.subtitle}
                </p>

                {/* Precision Pointer Arrow pointing directly to the tick */}
                <div 
                  style={pos.arrow}
                  className="absolute top-full -mt-1 w-2.5 h-2.5 rotate-45 bg-panel-bg dark:bg-[#F3EFE6] border-r border-b border-border dark:border-[#D6CFBF]" 
                />
              </div>
            );
          })()}

          {/* Precision Horizontal Timeline Bar */}
          <div className="relative w-full h-11 sm:h-12 flex items-center rounded-2xl overflow-visible shadow-inner">
            
            {/* Segment 1: HSC 2022-24 (Caramel Tan Filled Pill: exactly 0% to 33.33%) */}
            <div 
              style={{ width: `${timelineData.hscPct}%` }}
              className="h-full bg-[#B08D5E] text-[#17140E] font-mono text-xs sm:text-[13px] font-bold flex items-center px-4 rounded-l-2xl shadow-sm z-10 flex-shrink-0 select-none"
            >
              <span className="truncate">HSC • 2022-24</span>
            </div>

            {/* Segment 2: B.E Active Completed (Forest Green Bar: from 33.33% up to Today) */}
            <div 
              style={{ width: inView ? `${timelineData.beActiveWidth}%` : "0%" }}
              className="h-full bg-[#1B3B2B] dark:bg-[#12261C] text-[#EDE8DC] font-mono text-xs sm:text-[13px] font-bold flex items-center px-4 border-y border-[#2D563E] shadow-sm z-10 flex-shrink-0 select-none transition-all duration-1000 ease-out"
            >
              <span className="truncate">B.E • 2024-28</span>
            </div>

            {/* Segment 3: Expected Future Segment (Dashed Border from Today up to 2028: 100%) */}
            <div 
              style={{ width: `${timelineData.remainingWidth}%` }}
              className="h-full border-2 border-dashed border-text-tan/60 bg-surface-card/50 text-[#FAF7F0] dark:text-[#FAF7F0] font-mono text-xs sm:text-[12px] font-bold flex items-center justify-center rounded-r-2xl z-10 flex-shrink-0 select-none shadow-sm"
            >
              <span className="truncate px-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">expected 2028</span>
            </div>

            {/* AUTOMATIC REAL-TIME "TODAY" PIN MARKER */}
            <div 
              style={{ left: `${timelineData.todayPct}%` }}
              className="absolute top-0 bottom-0 flex flex-col items-center z-20 pointer-events-none -translate-x-1/2"
            >
              {/* Green Pin Pill with Pulsing Dot directly above the exact real-time point */}
              <div className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-[#1B3B2B] border border-[#34D399] text-[#34D399] font-mono text-[10px] font-bold shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping" />
                <span>Today ({timelineData.displayDateLabel})</span>
              </div>
              {/* Vertical Laser Line slicing through the bar */}
              <div className="w-0.5 h-full bg-[#34D399] shadow-[0_0_8px_#34d399]" />
            </div>
          </div>

          {/* 6. Mathematically Aligned Interactive Years Axis Line & Labels */}
          <div className="relative w-full h-10 mt-2 select-none">
            {activeMilestones.map((milestone, idx) => {
              const isHovered = hoveredMilestone === idx;

              // High-Contrast Adaptive Colors:
              // 2022-2024 sit over light cream/sand background -> deep dark tan
              // 2025 sits over center transition -> deep forest tone
              // 2026-2028 sit over deep dark emerald green -> bright crisp ivory with drop shadow
              let textColorClass = "text-[#3B3224] dark:text-[#EAE3D2] font-bold";
              let tickColorClass = "bg-[#3B3224]/60 dark:bg-[#EAE3D2]/60";

              if (milestone.year === 2025) {
                textColorClass = "text-[#23382C] dark:text-[#FAF7F0] font-bold";
                tickColorClass = "bg-[#23382C]/60 dark:bg-[#FAF7F0]/60";
              } else if (milestone.year >= 2026) {
                textColorClass = "text-[#FAF7F0] dark:text-[#FAF7F0] font-extrabold drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]";
                tickColorClass = "bg-[#FAF7F0]/90 dark:bg-[#FAF7F0]/90 shadow-[0_0_4px_rgba(255,255,255,0.4)]";
              }

              return (
                <div 
                  key={milestone.year}
                  style={{ left: `${milestone.pct}%` }}
                  onMouseEnter={() => setHoveredMilestone(idx)}
                  onMouseLeave={() => setHoveredMilestone(null)}
                  className="absolute flex flex-col items-center -translate-x-1/2 cursor-pointer group/tick px-2.5 py-1 -mt-0.5 rounded-xl hover:bg-white/10 transition-all"
                >
                  {/* Year Tick Mark with interactive expansion on hover */}
                  <div className={`w-0.5 transition-all duration-200 mb-1 rounded-full ${
                    isHovered 
                      ? "h-3.5 bg-text-tan scale-x-150 shadow-[0_0_8px_#d4b07c]" 
                      : `${tickColorClass} h-2 group-hover/tick:bg-text-tan`
                  }`} />
                  {/* Year Label */}
                  <span className={`text-[11px] sm:text-xs font-mono transition-all duration-200 ${
                    isHovered
                      ? "text-text-tan font-black scale-110 drop-shadow-[0_0_10px_rgba(212,176,124,0.8)]"
                      : textColorClass
                  }`}>
                    {milestone.year}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}