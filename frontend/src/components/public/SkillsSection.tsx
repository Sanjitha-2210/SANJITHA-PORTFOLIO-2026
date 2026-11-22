"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Skill } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import { 
  Compass, Layers, BrainCircuit, Code2, 
  Globe, Database, Target, 
  ArrowUpRight
} from "lucide-react";

interface SkillsSectionProps {
  skills: Skill[];
}

type QuadrantKey = "languages" | "ai" | "web" | "infra";

interface QuadrantConfig {
  id: QuadrantKey;
  number: string;
  title: string;
  shortTitle: string;
  icon: typeof BrainCircuit;
  angleRange: [number, number]; // [minDeg, maxDeg]
  color: string;
  badgeBg: string;
  badgeText: string;
  accentBorder: string;
  accentGlow: string;
  description: string;
  examples: string;
}

const QUADRANTS: Record<QuadrantKey, QuadrantConfig> = {
  languages: {
    id: "languages",
    number: "01",
    title: "Languages",
    shortTitle: "Languages",
    icon: Code2,
    angleRange: [192, 258], // Top-Left
    color: "#D4B07C",
    badgeBg: "bg-[#D4B07C]/15 border-[#D4B07C]/30",
    badgeText: "text-[#D4B07C]",
    accentBorder: "border-[#D4B07C]",
    accentGlow: "shadow-[0_0_20px_rgba(212,176,124,0.3)]",
    description: "Algorithmic logic, concurrency & typed architectures",
    examples: "Python, Java, TypeScript, JavaScript",
  },
  ai: {
    id: "ai",
    number: "02",
    title: "AI & Machine Learning",
    shortTitle: "AI & ML",
    icon: BrainCircuit,
    angleRange: [282, 348], // Top-Right
    color: "#10B981",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    badgeText: "text-emerald-500",
    accentBorder: "border-emerald-500",
    accentGlow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    description: "LLMs, RAG pipelines, agentic swarms & neural networks",
    examples: "GenAI, LLMs, RAG, PyTorch, LangChain, Agentic AI",
  },
  web: {
    id: "web",
    number: "03",
    title: "Web & Frameworks",
    shortTitle: "Web & Apps",
    icon: Globe,
    angleRange: [102, 168], // Bottom-Left
    color: "#38BDF8",
    badgeBg: "bg-sky-400/15 border-sky-400/30",
    badgeText: "text-sky-400",
    accentBorder: "border-sky-400",
    accentGlow: "shadow-[0_0_20px_rgba(56,189,248,0.3)]",
    description: "Next.js, reactive microservices, FastAPI & Tailwind CSS",
    examples: "Next.js, React, FastAPI, Tailwind CSS, Streamlit",
  },
  infra: {
    id: "infra",
    number: "04",
    title: "Infrastructure & Tools",
    shortTitle: "Infra & Tools",
    icon: Database,
    angleRange: [12, 78], // Bottom-Right
    color: "#A78BFA",
    badgeBg: "bg-purple-500/15 border-purple-500/30",
    badgeText: "text-purple-400",
    accentBorder: "border-purple-400",
    accentGlow: "shadow-[0_0_20px_rgba(167,139,250,0.3)]",
    description: "Docker containers, Linux kernel, vector DBs & Git",
    examples: "Redis, Celery, Docker, Git, Linux, SQLite, PostgreSQL, Cloud",
  },
};

// Map skill to one of the 4 ThoughtWorks Quadrants with strict domain rules
function mapSkillToQuadrant(category: string, name: string): QuadrantKey {
  const c = (category || "").toLowerCase().trim();
  const n = (name || "").toLowerCase().trim();

  // 1. Explicit Category matching (Primary Authority)
  if (c.includes("ai") || c.includes("machine learning") || c.includes("data science")) {
    // If Streamlit or Tailwind were filed under AI, reroute to Web Frameworks
    if (n.includes("streamlit") || n.includes("tailwind")) {
      return "web";
    }
    return "ai";
  }
  if (c.includes("web") || c.includes("front") || c.includes("framework")) {
    return "web";
  }
  if (
    c.includes("infra") || c.includes("tool") || c.includes("database") || 
    c.includes("cloud") || c.includes("devops") || c.includes("backend")
  ) {
    return "infra";
  }
  if (c.includes("lang")) {
    // Edge case safety: Databases should never sit in Languages quadrant
    if (n.includes("postgres") || n.includes("sqlite") || n.includes("mongo") || n.includes("redis")) {
      return "infra";
    }
    return "languages";
  }

  // 2. Name-based fallback (Secondary Authority)
  if (
    n.includes("postgres") || n.includes("sqlite") || n.includes("docker") || 
    n.includes("linux") || n.includes("git") || n.includes("redis") || 
    n.includes("mongo") || n.includes("chroma") || n.includes("cloud")
  ) {
    return "infra";
  }
  if (
    n.includes("next") || n.includes("react") || n.includes("fastapi") || 
    n.includes("tailwind") || n.includes("streamlit") || n.includes("web") || 
    n.includes("html") || n.includes("css")
  ) {
    return "web";
  }
  if (
    n.includes("python") || n.includes("typescript") || n.includes("c++") || 
    n.includes("java") || (n === "sql") || n.includes("javascript")
  ) {
    return "languages";
  }
  if (
    n.includes("ai") || n.includes("llm") || n.includes("rag") || 
    n.includes("prompt") || n.includes("langchain") || n.includes("agent") || 
    n.includes("pytorch") || n.includes("mcp") || n.includes("deep learning") ||
    n.includes("machine learning")
  ) {
    return "ai";
  }

  return "infra";
}

// Polar coordinate mapping to SVG (x, y) on a 640x640 canvas (Center: 320, 320)
// Features intelligent multi-lane orbital staggering and collision-free boundary guards
function calculateBlipCoordinates(
  quadrant: QuadrantKey,
  tier: string,
  indexInGroup: number,
  totalInGroup: number
) {
  const center = 320;
  const config = QUADRANTS[quadrant];
  const [minAngle, maxAngle] = config.angleRange;

  const t = (tier || "Core").toLowerCase();
  // Enlarged concentric ring radii: Core (130), Proficient (205), Exploring (280)
  let rMin = 52;
  let rMax = 108;
  let ringRadius = 130;

  if (t === "proficient") {
    rMin = 145;
    rMax = 192;
    ringRadius = 205;
  } else if (t === "exploring") {
    rMin = 220;
    rMax = 265;
    ringRadius = 280;
  }

  // Multi-Lane Orbital Distribution:
  // Alternates between inner, middle, and outer orbital lanes
  // so adjacent dots never share the same radial distance OR x/y coordinate
  let radius = (rMin + rMax) / 2;
  if (totalInGroup > 1) {
    if (totalInGroup === 2) {
      radius = indexInGroup === 0 ? rMin + 8 : rMax - 8;
    } else if (totalInGroup === 3) {
      const pattern = [rMin + 8, rMax - 8, (rMin + rMax) / 2];
      radius = pattern[indexInGroup % pattern.length];
    } else {
      // 4+ items: Stagger alternate inner/outer with distinct sub-lanes
      const step = (rMax - rMin) / (totalInGroup - 1);
      const isEven = indexInGroup % 2 === 0;
      radius = isEven 
        ? rMin + (indexInGroup / 2) * step * 0.7 
        : rMax - ((indexInGroup - 1) / 2) * step * 0.7;
      radius = Math.max(rMin, Math.min(rMax, radius));
    }
  }

  // Angular Distribution:
  // Spread evenly across the quadrant angle span
  const angleSpan = maxAngle - minAngle;
  let angleDeg = (minAngle + maxAngle) / 2;

  if (totalInGroup > 1) {
    const angleStep = angleSpan / (totalInGroup - 0.2);
    angleDeg = minAngle + (indexInGroup + 0.4) * angleStep;
  }

  const angleRad = (angleDeg * Math.PI) / 180;
  const x = Math.round((center + radius * Math.cos(angleRad)) * 10) / 10;
  const y = Math.round((center + radius * Math.sin(angleRad)) * 10) / 10;

  // Label Placement & Boundary Guard:
  // Wording must NEVER touch or cross the border line:
  const isRightSide = x >= center;
  const distFromCenter = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
  const distToRing = ringRadius - distFromCenter;

  let textAnchor: "start" | "end" = isRightSide ? "start" : "end";
  let labelX = isRightSide ? x + 9 : x - 9;

  // If the blip is close to the outer ring border, flip label inward to the open space
  if (distToRing < 26) {
    if (!isRightSide) {
      labelX = x + 9;
      textAnchor = "start";
    } else {
      labelX = x - 9;
      textAnchor = "end";
    }
  }

  return {
    dotX: x,
    dotY: y,
    labelX,
    labelY: y,
    textAnchor,
    radius,
    angleDeg,
  };
}

// Display-friendly compact names for radar blips (prevents clutter while keeping full clarity)
function getCompactName(name: string): string {
  const n = (name || "").trim();
  const lower = n.toLowerCase();

  if (lower === "python" || lower.startsWith("python")) return "Py";
  if (lower === "javascript" || lower.startsWith("javascript")) return "JS";
  if (lower === "typescript" || lower.startsWith("typescript")) return "TS";
  if (lower === "java") return "Java";
  if (lower === "next.js 15" || lower === "next.js" || lower === "nextjs") return "Next.js";
  if (lower === "react.js" || lower === "react") return "React";
  if (lower === "fastapi") return "FastAPI";
  if (lower === "postgresql" || lower === "postgres") return "Postgres";
  if (lower.includes("tailwind")) return "Tailwind";
  if (lower.includes("large language models") || lower === "llms") return "LLMs";
  if (lower.includes("retrieval-augmented") || lower === "rag") return "RAG";
  if (lower.includes("generative ai") || lower === "genai") return "GenAI";
  if (lower.includes("agentic")) return "Agents";
  if (lower.includes("cloud & ai") || lower === "cloud deploy") return "Cloud";
  if (lower.includes("git & github") || lower === "github") return "Git";
  if (lower === "streamlit") return "Streamlit";
  if (lower === "pytorch") return "PyTorch";
  if (lower === "langchain") return "LangChain";
  if (lower === "docker") return "Docker";
  if (lower === "linux") return "Linux";
  if (lower === "redis") return "Redis";
  if (lower === "celery") return "Celery";
  if (lower === "sqlite") return "SQLite";

  return n;
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTier, setActiveTier] = useState<"All" | "Core" | "Proficient" | "Exploring">("All");
  const [activeQuadrant, setActiveQuadrant] = useState<"All" | QuadrantKey>("All");
  const [hoveredSkillId, setHoveredSkillId] = useState<number | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"radar" | "matrix">("radar");

  // Scroll Reveal & Radar Animation Orchestration
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Trigger scroll entrance sequence when scrolled into view
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPlaying(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Guided Spotlight Tour: Languages sector briefly highlights after sweep, then returns to normal
  useEffect(() => {
    if (isPlaying && !reducedMotion && !animationCompleted) {
      const spotlightTimer = setTimeout(() => {
        setActiveQuadrant((prev) => (prev === "All" ? "languages" : prev));
        const resetTimer = setTimeout(() => {
          setActiveQuadrant((prev) => (prev === "languages" ? "All" : prev));
          setAnimationCompleted(true);
        }, 1300);
        return () => clearTimeout(resetTimer);
      }, 3400);
      return () => clearTimeout(spotlightTimer);
    }
  }, [isPlaying, reducedMotion, animationCompleted]);

  const isDark = !mounted || theme === "dark";

  // Group skills by Quadrant
  const quadrantMap = useMemo(() => {
    const map: Record<QuadrantKey, Skill[]> = {
      languages: [],
      ai: [],
      web: [],
      infra: [],
    };

    skills.forEach((s) => {
      const q = mapSkillToQuadrant(s.category, s.name);
      map[q].push(s);
    });

    return map;
  }, [skills]);

  // Compute collision-free coordinates for all blips
  const blipData = useMemo(() => {
    const data: Record<number, {
      dotX: number;
      dotY: number;
      labelX: number;
      labelY: number;
      textAnchor: "start" | "end";
      quadrant: QuadrantKey;
      compactName: string;
      angleDeg: number;
    }> = {};

    Object.entries(quadrantMap).forEach(([qKey, skillList]) => {
      const q = qKey as QuadrantKey;

      // Group by tier
      const tiers: Record<string, Skill[]> = { core: [], proficient: [], exploring: [] };
      skillList.forEach((s) => {
        const t = (s.tier || "Core").toLowerCase();
        if (tiers[t]) tiers[t].push(s);
        else tiers.core.push(s);
      });

      Object.entries(tiers).forEach(([tierName, group]) => {
        group.forEach((s, idx) => {
          const coords = calculateBlipCoordinates(q, tierName, idx, group.length);
          data[s.id] = {
            ...coords,
            quadrant: q,
            compactName: getCompactName(s.name),
          };
        });
      });
    });

    return data;
  }, [quadrantMap]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: skills.length,
      core: skills.filter((s) => (s.tier || "Core").toLowerCase() === "core").length,
      proficient: skills.filter((s) => (s.tier || "").toLowerCase() === "proficient").length,
      exploring: skills.filter((s) => (s.tier || "").toLowerCase() === "exploring").length,
    };
  }, [skills]);

  return (
    <section 
      id="skills" 
      ref={sectionRef} 
      className="pt-16 sm:pt-20 pb-24 px-4 max-w-7xl mx-auto relative select-none"
    >
      
      {/* 1. Header with ThoughtWorks Radar Eyebrow */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 text-text-tan font-mono text-xs tracking-wider uppercase mb-2">
            <Compass className={`w-4 h-4 transition-transform duration-1000 ease-out ${isPlaying ? "rotate-0 text-text-tan" : "-rotate-180 text-text-tan/40"}`} />
            <span>Skill Development</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            AREAS OF EXPERTISE
          </h2>
          <p className="text-text-secondary text-sm sm:text-base mt-2 max-w-xl">
            Continuously learning, adapting, and building.
          </p>
        </div>

        {/* View Switcher: Radar View vs Matrix View */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface border border-border shadow-sm w-fit">
          <button
            onClick={() => setViewMode("radar")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              viewMode === "radar"
                ? "bg-surface-card text-foreground shadow-sm border border-border"
                : "text-text-secondary hover:text-foreground"
            }`}
          >
            <Target className="w-3.5 h-3.5 text-text-tan" />
            <span>Radar Canvas</span>
          </button>
          <button
            onClick={() => setViewMode("matrix")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              viewMode === "matrix"
                ? "bg-surface-card text-foreground shadow-sm border border-border"
                : "text-text-secondary hover:text-foreground"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-text-tan" />
            <span>Quadrant Matrix</span>
          </button>
        </div>
      </div>

      {/* 2. RADAR VIEW: CIRCULAR CANVAS + OUTSIDE QUADRANT HEADERS + INTERACTIVE INSPECTOR */}
      {viewMode === "radar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Circular Radar Container (7 cols on lg) - Solid Card Footprint (No Glass) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-between relative p-3.5 sm:p-5 pt-7 sm:pt-8 pb-3.5 sm:pb-4 rounded-[32px] sm:rounded-[36px] bg-surface-card border border-border shadow-xl dark:shadow-2xl text-foreground dark:text-[#EDE8DC] transition-colors duration-300 overflow-visible">
            
            {/* Ambient Background Glows: Fade In & Breathe Gently on Scroll Reveal */}
            <div className={`absolute -top-10 -left-10 w-60 h-60 rounded-full bg-[#B08D5E]/10 dark:bg-[#B08D5E]/10 blur-3xl pointer-events-none -z-10 transition-opacity duration-1000 ${isPlaying ? "opacity-100 animate-pulse" : "opacity-0"}`} />
            <div className={`absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl pointer-events-none -z-10 transition-opacity duration-1000 ${isPlaying ? "opacity-100 animate-pulse" : "opacity-0"}`} />

            {/* ========================================================= */}
            {/* SVG RADAR CANVAS CONTAINER WITH CORNER QUADRANT PILLS INSIDE */}
            {/* Web & Frameworks + Infra & Tools sit cleanly ABOVE the legend */}
            {/* ========================================================= */}
            <div className="relative w-full max-w-[610px] aspect-square flex items-center justify-center my-0.5">

              {/* Top-Left: Languages */}
              <div 
                onClick={() => setActiveQuadrant(activeQuadrant === "languages" ? "All" : "languages")}
                className={`absolute top-0 sm:top-0.5 left-0 sm:left-0.5 flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all duration-300 cursor-pointer z-20 ${
                  activeQuadrant === "languages"
                    ? "bg-surface-card dark:bg-[#16291F] border-text-tan dark:border-[#D4B07C] shadow-[0_0_15px_rgba(212,176,124,0.35)] scale-105"
                    : "bg-surface/90 dark:bg-[#101D16]/90 border-border dark:border-white/10 hover:border-text-tan/60 dark:hover:border-[#D4B07C]/50 shadow-sm"
                }`}
              >
                <span className="font-mono text-xs font-bold text-text-tan dark:text-[#D4B07C]">&lt;&gt;</span>
                <span className="font-mono text-xs font-black tracking-wider uppercase text-foreground dark:text-[#EDE8DC]">
                  LANGUAGES
                </span>
              </div>

              {/* Top-Right: AI & ML Pill Button */}
              <div 
                onClick={() => setActiveQuadrant(activeQuadrant === "ai" ? "All" : "ai")}
                className={`absolute top-0 sm:top-0.5 right-0 sm:right-0.5 flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all duration-300 cursor-pointer z-20 ${
                  activeQuadrant === "ai"
                    ? "bg-surface-card dark:bg-[#16291F] border-text-tan dark:border-[#D4B07C] shadow-[0_0_15px_rgba(212,176,124,0.35)] scale-105"
                    : "bg-surface/90 dark:bg-[#101D16]/90 border-border dark:border-white/10 hover:border-text-tan/60 dark:hover:border-[#D4B07C]/50 shadow-sm"
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5 text-text-tan dark:text-[#D4B07C]" />
                <span className="font-mono text-xs font-black tracking-wider uppercase text-foreground dark:text-[#EDE8DC]">
                  AI &amp; ML
                </span>
              </div>

              {/* Bottom-Left: Web & Frameworks (Placed cleanly ABOVE the bottom legend) */}
              <div 
                onClick={() => setActiveQuadrant(activeQuadrant === "web" ? "All" : "web")}
                className={`absolute bottom-0 sm:bottom-0.5 left-0 sm:left-0.5 flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all duration-300 cursor-pointer z-20 ${
                  activeQuadrant === "web"
                    ? "bg-surface-card dark:bg-[#16291F] border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.35)] scale-105"
                    : "bg-surface/90 dark:bg-[#101D16]/90 border-border dark:border-white/10 hover:border-sky-400/50 shadow-sm"
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                <span className="font-mono text-xs font-black tracking-wider uppercase text-foreground dark:text-[#EDE8DC]">
                  WEB &amp; FRAMEWORKS
                </span>
              </div>

              {/* Bottom-Right: Infrastructure & Tools (Placed cleanly ABOVE the bottom legend) */}
              <div 
                onClick={() => setActiveQuadrant(activeQuadrant === "infra" ? "All" : "infra")}
                className={`absolute bottom-0 sm:bottom-0.5 right-0 sm:right-0.5 flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all duration-300 cursor-pointer z-20 ${
                  activeQuadrant === "infra"
                    ? "bg-surface-card dark:bg-[#16291F] border-text-tan dark:border-[#D4B07C] shadow-[0_0_15px_rgba(212,176,124,0.35)] scale-105"
                    : "bg-surface/90 dark:bg-[#101D16]/90 border-border dark:border-white/10 hover:border-text-tan/60 dark:hover:border-[#D4B07C]/50 shadow-sm"
                }`}
              >
                <Database className="w-3.5 h-3.5 text-text-tan dark:text-[#D4B07C]" />
                <span className="font-mono text-xs font-black tracking-wider uppercase text-foreground dark:text-[#EDE8DC]">
                  INFRA &amp; TOOLS
                </span>
              </div>

              <svg 
                viewBox="0 0 640 640" 
                className="w-full h-full transform transition-all duration-300 drop-shadow-2xl overflow-visible select-none"
              >
                <defs>
                  {/* Active Quadrant Golden Sonar Wedge Gradient */}
                  <radialGradient id="activeSectorGradient" cx="320" cy="320" r="280" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={isDark ? "#D4B07C" : "#B08D5E"} stopOpacity={isDark ? "0.24" : "0.30"} />
                    <stop offset="65%" stopColor={isDark ? "#D4B07C" : "#B08D5E"} stopOpacity={isDark ? "0.10" : "0.12"} />
                    <stop offset="100%" stopColor={isDark ? "#D4B07C" : "#B08D5E"} stopOpacity="0.02" />
                  </radialGradient>

                  {/* High-Tech Radar Sweep Gradient */}
                  <linearGradient id="radarSweepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDark ? "#D4B07C" : "#B08D5E"} stopOpacity="0.45" />
                    <stop offset="60%" stopColor={isDark ? "#D4B07C" : "#B08D5E"} stopOpacity="0.10" />
                    <stop offset="100%" stopColor={isDark ? "#D4B07C" : "#B08D5E"} stopOpacity="0" />
                  </linearGradient>

                  {/* Drop Shadow Filter for Badges */}
                  <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity={isDark ? "0.25" : "0.15"} />
                  </filter>
                </defs>

                {/* ========================================================= */}
                {/* 00. RADAR SWEEP BEAM (ROTATES ONCE CLOCKWISE FROM 12 O'CLOCK) */}
                {/* ========================================================= */}
                {isPlaying && !reducedMotion && !animationCompleted && (
                  <g 
                    className="pointer-events-none select-none z-10"
                    style={{
                      transformOrigin: "320px 320px",
                      animation: "radar-sweep 2.6s linear 0.7s forwards",
                      opacity: 0,
                    }}
                  >
                    {/* Trailing soft golden sweep wedge */}
                    <path
                      d="M 320 320 L 320 40 A 280 280 0 0 0 122 122 Z"
                      fill="url(#radarSweepGradient)"
                    />
                    {/* Leading high-intensity beam line */}
                    <line
                      x1="320"
                      y1="320"
                      x2="320"
                      y2="40"
                      stroke={isDark ? "#E6CDA3" : "#7A5C30"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{
                        filter: `drop-shadow(0 0 8px ${isDark ? "#D4B07C" : "#B08D5E"})`,
                      }}
                    />
                  </g>
                )}

                {/* DYNAMIC QUADRANT WEDGE / ACTIVE SONAR SLICE (ONLY ILLUMINATES ON FOCUS CLICK) */}
                {(() => {
                  const activeQ = activeQuadrant !== "All" ? activeQuadrant : null;
                  if (activeQ === "ai") {
                    return (
                      <path
                        d="M 320 320 L 320 40 A 280 280 0 0 1 600 320 Z"
                        fill="url(#activeSectorGradient)"
                        className="transition-all duration-500 ease-out pointer-events-none"
                      />
                    );
                  }
                  if (activeQ === "languages") {
                    return (
                      <path
                        d="M 320 320 L 40 320 A 280 280 0 0 1 320 40 Z"
                        fill="url(#activeSectorGradient)"
                        className="transition-all duration-500 ease-out pointer-events-none"
                      />
                    );
                  }
                  if (activeQ === "web") {
                    return (
                      <path
                        d="M 320 320 L 320 600 A 280 280 0 0 1 40 320 Z"
                        fill="url(#activeSectorGradient)"
                        className="transition-all duration-500 ease-out pointer-events-none"
                      />
                    );
                  }
                  if (activeQ === "infra") {
                    return (
                      <path
                        d="M 320 320 L 600 320 A 280 280 0 0 1 320 600 Z"
                        fill="url(#activeSectorGradient)"
                        className="transition-all duration-500 ease-out pointer-events-none"
                      />
                    );
                  }
                  return null;
                })()}

                {/* 3 ENLARGED CONCENTRIC RINGS WITH SUBTLE DASHED STROKES (EXPAND OUTWARD IN SEQUENCE) */}
                {/* Outer Ring: Exploring (r = 280) */}
                <circle 
                  cx="320" 
                  cy="320" 
                  r="280" 
                  fill="none" 
                  stroke={isDark ? "rgba(255, 255, 255, 0.22)" : "rgba(36, 58, 47, 0.22)"} 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4"
                  style={{
                    transformOrigin: "320px 320px",
                    animation: isPlaying && !reducedMotion && !animationCompleted ? "ring-expand 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both" : undefined,
                  }}
                />
                {/* Middle Ring: Proficient (r = 205) */}
                <circle 
                  cx="320" 
                  cy="320" 
                  r="205" 
                  fill="none" 
                  stroke={isDark ? "rgba(212, 176, 124, 0.32)" : "rgba(138, 106, 60, 0.35)"} 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4"
                  style={{
                    transformOrigin: "320px 320px",
                    animation: isPlaying && !reducedMotion && !animationCompleted ? "ring-expand 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both" : undefined,
                  }}
                />
                {/* Inner Ring: Core (r = 130) - Enlarged with prominent border */}
                <circle 
                  cx="320" 
                  cy="320" 
                  r="130" 
                  fill="none" 
                  stroke={isDark ? "rgba(110, 231, 183, 0.45)" : "rgba(16, 185, 129, 0.50)"} 
                  strokeWidth="1.75" 
                  strokeDasharray="4 4"
                  style={{
                    transformOrigin: "320px 320px",
                    animation: isPlaying && !reducedMotion && !animationCompleted ? "ring-expand 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" : undefined,
                  }}
                />

                {/* SUBTLE DASHED CROSSHAIRS (EXPAND FROM CENTER) */}
                <g
                  style={{
                    transformOrigin: "320px 320px",
                    animation: isPlaying && !reducedMotion && !animationCompleted ? "crosshair-draw 0.5s ease-out 0.05s both" : undefined,
                  }}
                >
                  <line x1="320" y1="40" x2="320" y2="600" stroke={isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(36, 58, 47, 0.16)"} strokeWidth="1.25" strokeDasharray="3 3" />
                  <line x1="40" y1="320" x2="600" y2="320" stroke={isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(36, 58, 47, 0.16)"} strokeWidth="1.25" strokeDasharray="3 3" />
                </g>

                {/* CENTER HUB GLOW (DOUBLE RING AS IN MOCK - IGNITES FIRST) */}
                <circle cx="320" cy="320" r="8" fill="none" stroke={isDark ? "#6EE7B7" : "#059669"} strokeWidth="1.5" opacity="0.6" className={isPlaying ? "animate-pulse" : ""} />
                <circle cx="320" cy="320" r="3.5" fill={isDark ? "#6EE7B7" : "#059669"} />

                {/* ========================================================= */}
                {/* 02. PROMINENT AXIS BADGES (EXPLORING, PROFICIENT, CORE) */}
                {/* ALL THREE ACCURATELY CENTERED ON THEIR RESPECTIVE CIRCULAR RINGS (SPRING DROP ON ENTRANCE) */}
                {/* ========================================================= */}
                <g className="select-none pointer-events-none">
                  {/* Exploring Ring Badge (at Top 12 o'clock Axis on r=280, center y=40) */}
                  <g 
                    transform="translate(268, 29)" 
                    filter="url(#badgeShadow)"
                    style={{
                      animation: isPlaying && !reducedMotion && !animationCompleted ? "pill-drop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s both" : undefined,
                    }}
                  >
                    <rect width="104" height="22" rx="11" fill={isDark ? "#0C1611" : "#FAF7F0"} stroke={isDark ? "rgba(255, 255, 255, 0.35)" : "rgba(36, 58, 47, 0.4)"} strokeWidth="1" />
                    <text x="52" y="15" textAnchor="middle" className={`font-mono text-[9px] font-black uppercase tracking-wider ${isDark ? "fill-[#EDE8DC]" : "fill-[#1F2A24]"}`}>
                      EXPLORING
                    </text>
                  </g>

                  {/* Proficient Ring Badge (at Middle 12 o'clock Axis on r=205, center y=115) */}
                  <g 
                    transform="translate(264, 104)" 
                    filter="url(#badgeShadow)"
                    style={{
                      animation: isPlaying && !reducedMotion && !animationCompleted ? "pill-drop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s both" : undefined,
                    }}
                  >
                    <rect width="112" height="22" rx="11" fill={isDark ? "#0C1611" : "#FAF7F0"} stroke={isDark ? "#D4B07C" : "#8A6A3C"} strokeWidth="1.25" />
                    <text x="56" y="15" textAnchor="middle" className={`font-mono text-[9px] font-black uppercase tracking-wider ${isDark ? "fill-[#D4B07C]" : "fill-[#7A5C30]"}`}>
                      PROFICIENT
                    </text>
                  </g>

                  {/* Core Ring Badge (at Inner 12 o'clock Axis on r=130, center y=190) */}
                  <g 
                    transform="translate(276, 179)" 
                    filter="url(#badgeShadow)"
                    style={{
                      animation: isPlaying && !reducedMotion && !animationCompleted ? "pill-drop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s both" : undefined,
                    }}
                  >
                    <rect width="88" height="22" rx="11" fill={isDark ? "#0C1611" : "#FAF7F0"} stroke={isDark ? "#10B981" : "#059669"} strokeWidth="1.25" />
                    <text x="44" y="15" textAnchor="middle" className={`font-mono text-[9px] font-black uppercase tracking-wider ${isDark ? "fill-[#6EE7B7]" : "fill-[#047857]"}`}>
                      CORE
                    </text>
                  </g>
                </g>

                {/* ========================================================= */}
                {/* 01. & 03. SHAPE-ENCODED BLIPS (CIRCLE, DIAMOND, DASHED RING) */}
                {/* SYNCHRONIZED POP-IN BLOOM & RIPPLE AS SWEEP BEAM PASSES OVER */}
                {/* ========================================================= */}
                {skills.map((skill) => {
                  const data = blipData[skill.id];
                  if (!data) return null;

                  const tier = (skill.tier || "Core").toLowerCase();
                  const isHighlighted = hoveredSkillId === skill.id || selectedSkillId === skill.id;
                  const isHovered = isHighlighted;

                  // Sweep arrival timing based on polar angle (clockwise from 12 o'clock)
                  const sweepDelay = 0.7 + (((data.angleDeg + 90 + 360) % 360) / 360) * 2.6;

                  // Spotlight filtering: by Tier, by Quadrant, and by Selected Skill
                  const targetQuadrant = activeQuadrant !== "All" ? activeQuadrant : null;
                  const isDimmedByQuadrant = targetQuadrant !== null && data.quadrant !== targetQuadrant;
                  const isDimmedByTier = activeTier !== "All" && tier !== activeTier.toLowerCase();
                  const isDimmedBySelection = selectedSkillId !== null && skill.id !== selectedSkillId;
                  const isDimmed = isDimmedByQuadrant || isDimmedByTier || isDimmedBySelection;

                  return (
                    <g 
                      key={skill.id}
                      className="cursor-pointer transition-all duration-300"
                      opacity={isDimmed ? 0.2 : 1}
                      onClick={() => setSelectedSkillId(selectedSkillId === skill.id ? null : skill.id)}
                      onMouseEnter={() => setHoveredSkillId(skill.id)}
                      onMouseLeave={() => setHoveredSkillId(null)}
                      style={{
                        transformOrigin: `${data.dotX}px ${data.dotY}px`,
                        animation: isPlaying && !reducedMotion && !animationCompleted
                          ? `blip-bloom 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${sweepDelay.toFixed(3)}s both`
                          : undefined,
                      }}
                    >
                      {/* Generous Transparent Hit Area for Easy Hovering / Clicking */}
                      <circle
                        cx={data.dotX}
                        cy={data.dotY}
                        r="18"
                        fill="transparent"
                      />

                      {/* Ripple Ring when the sweep beam hits this blip */}
                      {isPlaying && !reducedMotion && !animationCompleted && (
                        <circle
                          cx={data.dotX}
                          cy={data.dotY}
                          r="8"
                          fill="none"
                          stroke={tier === "core" ? (isDark ? "#6EE7B7" : "#059669") : tier === "proficient" ? (isDark ? "#F59E0B" : "#D97706") : (isDark ? "#38BDF8" : "#0284C7")}
                          strokeWidth="1.5"
                          style={{
                            transformOrigin: `${data.dotX}px ${data.dotY}px`,
                            animation: `blip-ripple 0.75s ease-out ${(sweepDelay + 0.05).toFixed(3)}s both`,
                            pointerEvents: "none",
                          }}
                        />
                      )}

                      {/* Animated Sonar Ping Ring when Hovered or Clicked/Selected */}
                      {isHighlighted && (
                        <circle
                          cx={data.dotX}
                          cy={data.dotY}
                          r="14"
                          fill="none"
                          stroke={tier === "core" ? (isDark ? "#6EE7B7" : "#059669") : tier === "proficient" ? (isDark ? "#F59E0B" : "#D97706") : (isDark ? "#38BDF8" : "#0284C7")}
                          strokeWidth="1.5"
                          className="animate-ping origin-center opacity-70 pointer-events-none"
                        />
                      )}

                      {/* ========================================== */}
                      {/* SHAPE 1: CORE = SOLID CIRCLE (●) */}
                      {/* ========================================== */}
                      {tier === "core" && (
                        <g>
                          <circle
                            cx={data.dotX}
                            cy={data.dotY}
                            r={isHighlighted ? 6.5 : 5.5}
                            fill={isDark ? "#6EE7B7" : "#059669"}
                            className="transition-all duration-150"
                            style={{
                              filter: isHighlighted ? `drop-shadow(0 0 8px ${isDark ? "#6EE7B7" : "#059669"})` : undefined,
                            }}
                          />
                          <circle
                            cx={data.dotX}
                            cy={data.dotY}
                            r={1.75}
                            fill={isDark ? "#0B1510" : "#FAF7F0"}
                          />
                        </g>
                      )}

                      {/* ========================================== */}
                      {/* SHAPE 2: PROFICIENT = ROTATED DIAMOND (◆) */}
                      {/* ========================================== */}
                      {tier === "proficient" && (
                        <g>
                          <rect
                            x={data.dotX - (isHighlighted ? 6 : 5)}
                            y={data.dotY - (isHighlighted ? 6 : 5)}
                            width={isHighlighted ? 12 : 10}
                            height={isHighlighted ? 12 : 10}
                            transform={`rotate(45, ${data.dotX}, ${data.dotY})`}
                            fill={isDark ? "#F59E0B" : "#D97706"}
                            className="transition-all duration-150"
                            style={{
                              filter: isHighlighted ? `drop-shadow(0 0 8px ${isDark ? "#F59E0B" : "#D97706"})` : undefined,
                            }}
                          />
                        </g>
                      )}

                      {/* ========================================== */}
                      {/* SHAPE 3: EXPLORING = DASHED RADAR RING (◌) */}
                      {/* ========================================== */}
                      {tier === "exploring" && (
                        <g>
                          <circle
                            cx={data.dotX}
                            cy={data.dotY}
                            r={isHighlighted ? 7.5 : 6.5}
                            fill={isDark ? "#0B1510" : "#FAF7F0"}
                            stroke={isDark ? "#38BDF8" : "#0284C7"}
                            strokeWidth={isHighlighted ? "2" : "1.5"}
                            strokeDasharray="2.5 2"
                            className="transition-all duration-150"
                            style={{
                              filter: isHighlighted ? `drop-shadow(0 0 8px ${isDark ? "#38BDF8" : "#0284C7"})` : undefined,
                            }}
                          />
                        </g>
                      )}

                      {/* 03. Clear Label Beside Dot (Snappy, Natural & Non-Overbearing) */}
                      {!isDimmed && (
                        <text
                          x={data.labelX}
                          y={data.labelY}
                          textAnchor={data.textAnchor}
                          dominantBaseline="central"
                          paintOrder="stroke fill"
                          stroke={isDark ? "#0B1510" : "#FAF7F0"}
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                          className={`font-mono text-[10px] font-extrabold tracking-tight transition-colors duration-150 pointer-events-none select-none ${
                            isHighlighted
                              ? isDark ? "fill-white" : "fill-[#000000]"
                              : isDark ? "fill-[#EDE8DC]" : "fill-[#1F2A24]"
                          }`}
                        >
                          {data.compactName}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* ========================================================= */}
            {/* 04. REFINED SHAPE-BASED LEGEND (MATCHING EXACT SHAPES) */}
            {/* ========================================================= */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2.5 mt-1 border-t border-border dark:border-white/10 w-full max-w-lg mx-auto">
              {/* Item 1: Core (Solid Circle) */}
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-surface-card dark:bg-[#121B16] border border-border dark:border-white/10 shadow-sm">
                <span className="w-3 h-3 rounded-full bg-[#10B981] dark:bg-[#6EE7B7] shadow-[0_0_8px_#10b981] dark:shadow-[0_0_8px_#6ee7b7] flex-shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-foreground dark:text-white flex items-center gap-1.5">
                    <span>Core (●)</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-[#6EE7B7] font-bold">({counts.core})</span>
                  </div>
                  <p className="text-[10px] text-text-secondary dark:text-[#A3B899] font-medium leading-tight">Daily Production Stack</p>
                </div>
              </div>

              {/* Item 2: Proficient (Rotated Diamond) */}
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-surface-card dark:bg-[#121B16] border border-border dark:border-white/10 shadow-sm">
                <span className="w-3 h-3 rotate-45 bg-[#D97706] dark:bg-[#F59E0B] shadow-[0_0_8px_#f59e0b] flex-shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-foreground dark:text-white flex items-center gap-1.5">
                    <span>Proficient (◆)</span>
                    <span className="text-[10px] font-mono text-text-tan dark:text-[#D4B07C] font-bold">({counts.proficient})</span>
                  </div>
                  <p className="text-[10px] text-text-secondary dark:text-[#A3B899] font-medium leading-tight">Project-Tested Tools</p>
                </div>
              </div>

              {/* Item 3: Exploring (Dashed Radar Ring) */}
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-surface-card dark:bg-[#121B16] border border-border dark:border-white/10 shadow-sm">
                <svg className="w-3.5 h-3.5 flex-shrink-0 overflow-visible" viewBox="0 0 14 14">
                  <circle
                    cx="7"
                    cy="7"
                    r="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                    className="text-[#0284C7] dark:text-[#38BDF8] drop-shadow-[0_0_4px_rgba(56,189,248,0.5)]"
                  />
                </svg>
                <div className="text-left">
                  <div className="text-xs font-bold text-foreground dark:text-white flex items-center gap-1.5">
                    <span>Exploring (◌)</span>
                    <span className="text-[10px] font-mono text-[#0284C7] dark:text-[#38BDF8] font-bold">({counts.exploring})</span>
                  </div>
                  <p className="text-[10px] text-text-secondary dark:text-[#A3B899] font-medium leading-tight">Emerging AI Research</p>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Sector Blip List (5 cols on lg) - Modern Solid Squircle UI (No Glass) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full gap-3 max-w-[440px] w-full mx-auto lg:mx-0">
            {Object.entries(QUADRANTS).map(([qKey, config], cardIdx) => {
              const q = qKey as QuadrantKey;
              const skillList = quadrantMap[q];
              const Icon = config.icon;
              const isSelected = activeQuadrant === "All" || activeQuadrant === q;
              const isFocused = isSelected && activeQuadrant !== "All";
              const isSpotlighted = isSelected;

              return (
                <div
                  key={q}
                  style={{
                    animation: isPlaying && !reducedMotion && !animationCompleted
                      ? `card-slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${(0.9 + cardIdx * 0.15).toFixed(2)}s both`
                      : undefined,
                  }}
                  className={`group/quadrant relative rounded-2xl sm:rounded-[24px] p-3.5 sm:p-4 border transition-all duration-300 flex-1 flex flex-col justify-between overflow-hidden ${
                    isFocused
                      ? `bg-surface-card dark:bg-[#121B16] ${config.accentBorder} ${config.accentGlow} shadow-lg`
                      : isSpotlighted
                      ? "bg-surface-card dark:bg-[#121B16] border-border dark:border-white/10 shadow-md hover:border-text-tan/40"
                      : "opacity-40 border-border/40 bg-surface-card dark:bg-[#121B16]"
                  }`}
                >
                  {/* Glowing Top Accent Line for the focused card */}
                  {isFocused && (
                    <div 
                      className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none z-20" 
                      style={{
                        background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
                        boxShadow: `0 0 12px ${config.color}`,
                      }}
                    />
                  )}

                  {/* Faint, subtle ghost number (01, 02, 03, 04) - shifted inward to the left */}
                  <span 
                    className={`absolute bottom-1 right-5 sm:right-6 font-mono font-black text-4xl sm:text-5xl select-none pointer-events-none tracking-tighter leading-none z-0 transition-opacity duration-300 ${
                      isFocused
                        ? "opacity-[0.09] dark:opacity-[0.11]"
                        : "opacity-[0.035] dark:opacity-[0.045]"
                    }`}
                    style={{
                      color: isFocused ? config.color : "currentColor",
                    }}
                  >
                    {config.number}
                  </span>

                  {/* Card Header: Squircle Icon Box on Left + Card Name on the Right + Prominent Focus Button (Matching Matrix Header) */}
                  <div className="flex items-center justify-between gap-2.5 pb-2.5 mb-2.5 border-b border-border dark:border-white/10 relative z-10">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rounded squircle icon box */}
                      <div 
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border transition-all duration-300 flex-shrink-0 ${
                          isFocused
                            ? `${config.badgeBg} border-current shadow-[0_0_12px_rgba(212,176,124,0.3)]`
                            : "bg-surface-card dark:bg-white/5 border-border dark:border-white/10 shadow-inner"
                        }`}
                        style={{
                          borderColor: isFocused ? config.color : undefined,
                        }}
                      >
                        <Icon 
                          className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors ${
                            isFocused ? config.badgeText : "text-foreground dark:text-[#EDE8DC]"
                          }`} 
                        />
                      </div>

                      {/* Card Name on the right side of the logo (matching Matrix font styling) */}
                      <h4 
                        className={`font-bold text-sm sm:text-base tracking-tight transition-colors truncate ${
                          isFocused ? config.badgeText : "text-foreground dark:text-[#EDE8DC]"
                        }`}
                      >
                        {config.title}
                      </h4>
                    </div>

                    {/* Highly visible, prominent Focus / Reset button */}
                    <button
                      onClick={() => setActiveQuadrant(activeQuadrant === q ? "All" : q)}
                      className={`text-xs font-mono font-bold flex items-center gap-1 px-2.5 py-1 rounded-xl border transition-all duration-200 shadow-sm flex-shrink-0 cursor-pointer ${
                        isFocused
                          ? "bg-text-tan text-btn-text border-text-tan shadow-md font-extrabold"
                          : "bg-surface-card hover:bg-surface border-border text-foreground hover:border-text-tan hover:text-text-tan dark:bg-white/10 dark:text-[#EDE8DC] dark:hover:bg-white/15"
                      }`}
                    >
                      <span>{activeQuadrant === q ? "Reset" : "Focus"}</span>
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Skill Badges with Radar-Matched Shape Markers and Vibrant Non-White Click/Hover States */}
                  <div className="flex flex-wrap gap-2 items-center relative z-10 my-auto">
                    {skillList.map((skill) => {
                      const tier = (skill.tier || "Core").toLowerCase();
                      const isHighlighted = hoveredSkillId === skill.id || selectedSkillId === skill.id;
                      const isCore = tier === "core";
                      const isProficient = tier === "proficient";

                      let badgeStyle = "bg-surface-card border-border dark:border-white/10 text-foreground dark:text-[#EDE8DC] hover:border-text-tan/60";
                      if (isHighlighted) {
                        if (isCore) {
                          badgeStyle = "border-[#10B981] bg-[#10B981]/15 text-[#047857] dark:text-[#6EE7B7] shadow-[0_0_12px_rgba(16,185,129,0.25)] ring-1 ring-[#10B981]/40 scale-[1.04]";
                        } else if (isProficient) {
                          badgeStyle = "border-[#D97706] dark:border-[#F59E0B] bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FCD34D] shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-1 ring-[#F59E0B]/40 scale-[1.04]";
                        } else {
                          badgeStyle = "border-[#0284C7] dark:border-[#38BDF8] bg-[#0284C7]/15 text-[#0369A1] dark:text-[#7DD3FC] shadow-[0_0_12px_rgba(56,189,248,0.25)] ring-1 ring-[#38BDF8]/40 scale-[1.04]";
                        }
                      }

                      return (
                        <button
                          type="button"
                          key={skill.id}
                          title={`${skill.name} • ${skill.tier || "Core"} Tier`}
                          onClick={() => setSelectedSkillId(selectedSkillId === skill.id ? null : skill.id)}
                          onMouseEnter={() => setHoveredSkillId(skill.id)}
                          onMouseLeave={() => setHoveredSkillId(null)}
                          className={`flex items-center gap-2 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm ${badgeStyle}`}
                        >
                          {/* Exact Radar-matched shape marker */}
                          {isCore ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] dark:bg-[#6EE7B7] shadow-[0_0_6px_#10b981] dark:shadow-[0_0_6px_#6ee7b7] flex-shrink-0" />
                          ) : isProficient ? (
                            <span className="w-2.5 h-2.5 rotate-45 bg-[#D97706] dark:bg-[#F59E0B] shadow-[0_0_6px_#f59e0b] flex-shrink-0" />
                          ) : (
                            <svg className="w-2.5 h-2.5 flex-shrink-0 overflow-visible" viewBox="0 0 12 12">
                              <circle
                                cx="6"
                                cy="6"
                                r="4.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.75"
                                strokeDasharray="2.5 1.75"
                                className="text-[#0284C7] dark:text-[#38BDF8] drop-shadow-[0_0_3px_rgba(56,189,248,0.5)]"
                              />
                            </svg>
                          )}
                          <span>{skill.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* 4. MATRIX VIEW: 4 SOLID SQUIRCLE CARDS (No Glass) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {Object.entries(QUADRANTS).map(([qKey, config], cardIdx) => {
            const q = qKey as QuadrantKey;
            const skillList = quadrantMap[q];
            const Icon = config.icon;

            return (
              <div
                key={q}
                style={{
                  animation: isPlaying && !reducedMotion && !animationCompleted
                    ? `card-slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${(0.2 + cardIdx * 0.12).toFixed(2)}s both`
                    : undefined,
                }}
                className="group/card relative rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 bg-surface-card border border-border shadow-md hover:shadow-xl hover:border-text-tan/40 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[260px]"
              >
                {/* Faint, subtle ghost number (01, 02, 03, 04) */}
                <span className="absolute bottom-2 right-4 font-mono font-black text-6xl sm:text-7xl opacity-[0.035] dark:opacity-[0.045] select-none pointer-events-none tracking-tighter leading-none z-0">
                  {config.number}
                </span>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  {/* Card Header: Squircle icon box + title on the right */}
                  <div className="flex items-center gap-3 pb-3.5 mb-4 border-b border-border">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/card:scale-110 transition-transform shadow-inner ${config.badgeBg}`}>
                      <Icon className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${config.badgeText}`} />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                      {config.title}
                    </h3>
                  </div>

                  {/* Skills Grid: Clean skill tags without symbols, with rich non-white click/hover states */}
                  <div className="flex flex-wrap gap-2 my-auto">
                    {skillList.map((skill) => {
                      const tier = (skill.tier || "Core").toLowerCase();
                      const isHighlighted = hoveredSkillId === skill.id || selectedSkillId === skill.id;
                      const isCore = tier === "core";
                      const isProficient = tier === "proficient";

                      let badgeStyle = "bg-surface-card border-border hover:border-text-tan/60 text-foreground";
                      if (isHighlighted) {
                        if (isCore) {
                          badgeStyle = "border-[#10B981] bg-[#10B981]/15 text-[#047857] dark:text-[#6EE7B7] shadow-[0_0_12px_rgba(16,185,129,0.25)] ring-1 ring-[#10B981]/40 scale-[1.04]";
                        } else if (isProficient) {
                          badgeStyle = "border-[#D97706] dark:border-[#F59E0B] bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FCD34D] shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-1 ring-[#F59E0B]/40 scale-[1.04]";
                        } else {
                          badgeStyle = "border-[#0284C7] dark:border-[#38BDF8] bg-[#0284C7]/15 text-[#0369A1] dark:text-[#7DD3FC] shadow-[0_0_12px_rgba(56,189,248,0.25)] ring-1 ring-[#38BDF8]/40 scale-[1.04]";
                        }
                      }

                      return (
                        <button
                          type="button"
                          key={skill.id}
                          onClick={() => setSelectedSkillId(selectedSkillId === skill.id ? null : skill.id)}
                          onMouseEnter={() => setHoveredSkillId(skill.id)}
                          onMouseLeave={() => setHoveredSkillId(null)}
                          className={`px-2.5 py-1 rounded-xl border transition-all duration-200 shadow-sm text-xs font-bold cursor-pointer ${badgeStyle}`}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
