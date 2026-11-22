"use client";

import { useState, useRef } from "react";
import { Project } from "@/types";
import { parseProjectCaseStudy } from "@/lib/projectCaseStudy";
import Link from "next/link";
import {
  X,
  ExternalLink,
  Github,
  Play,
  Layers,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Cpu,
  Boxes,
  FileCode,
  Image as ImageIcon,
  Video,
  Flame,
  TrendingUp,
  Maximize2,
  ChevronRight,
  ArrowRight,
  Terminal,
  Compass,
  ArrowLeft,
  Calendar,
  Briefcase,
  Users
} from "lucide-react";

interface ProjectCaseStudyViewProps {
  project: Project;
  isModal?: boolean;
  onClose?: () => void;
}

const SECTIONS = [
  { id: "overview", label: "Overview", icon: Layers, num: "01" },
  { id: "problem", label: "Problem", icon: AlertTriangle, num: "02" },
  { id: "tech-stack", label: "Technologies", icon: Cpu, num: "03" },
  { id: "solution", label: "Solution", icon: Lightbulb, num: "04" },
  { id: "features", label: "Features", icon: CheckCircle2, num: "05" },
  { id: "architecture", label: "Architecture", icon: Boxes, num: "06" },
  { id: "contributions", label: "Contributions", icon: FileCode, num: "07" },
  { id: "demo-video", label: "Demo Video", icon: Video, num: "08" },
  { id: "challenges", label: "Challenges", icon: Flame, num: "09" },
  { id: "outcomes", label: "Outcomes", icon: TrendingUp, num: "10" },
];

export default function ProjectCaseStudyView({
  project,
  isModal = false,
  onClose
}: ProjectCaseStudyViewProps) {
  const data = parseProjectCaseStudy(project);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`case-study-sec-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const allTags = project.tags
    ? project.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : ["FastAPI", "Next.js", "TypeScript", "PostgreSQL", "Docker"];

  // Split problem narrative into bullet points if formatted with bullets or newlines
  const problemBullets = data.problem
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-") || l.startsWith("•") || l.startsWith("*") || /^\d+\./.test(l))
    .map((l) => l.replace(/^[-•*]|\d+\.\s*/, "").trim());

  const yearString = project.created_at ? new Date(project.created_at).getFullYear() : "2025";

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col text-foreground transition-colors ${
        isModal
          ? "max-w-5xl max-h-[94vh] overflow-y-auto bg-surface-card border border-border rounded-3xl shadow-2xl custom-scrollbar"
          : "max-w-5xl mx-auto"
      }`}
    >
      {/* Sticky Header with Stepper Navigation */}
      <div className="sticky top-0 z-30 bg-surface-card/95 backdrop-blur-md border-b border-border p-4 sm:px-6 flex flex-col gap-3 shadow-sm rounded-t-3xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {!isModal ? (
              <Link
                href="/#projects"
                className="p-2 rounded-xl bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground transition-all mr-1"
                title="Back to Projects"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            ) : null}
            <div className="p-2 rounded-xl bg-btn-bg text-btn-text">
              <Compass className="w-4 h-4 text-text-tan" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase text-text-tan tracking-wider">
                Engineering Case Study
              </span>
              <h2 className="text-base sm:text-lg font-bold text-foreground truncate">
                {project.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isModal && (
              <Link
                href={`/projects/${project.slug}`}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-card border border-border text-xs font-semibold text-text-secondary hover:text-foreground transition-all"
                title="Open Dedicated Full Page"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full Page</span>
              </Link>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground transition-colors"
                title="View GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground transition-colors"
                aria-label="Close Case Study"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Stepper / Breadcrumbs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none no-scrollbar">
          {SECTIONS.map((sec, idx) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-btn-bg text-btn-text border-text-tan/40 font-bold shadow-sm"
                    : "bg-surface/70 hover:bg-surface border-border text-text-secondary hover:text-foreground"
                }`}
              >
                <span className="opacity-60 text-[10px]">{sec.num}</span>
                <Icon className="w-3 h-3" />
                <span>{sec.label}</span>
                {idx < SECTIONS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-text-secondary opacity-40 ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Case Study Content Body: Stacked Bento-Cards matching reference image */}
      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 text-sm leading-relaxed">
        {/* CARD 1: TOP HERO BANNER CARD */}
        <section
          id="case-study-sec-overview"
          className="group/topic relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface border border-border shadow-sm p-6 sm:p-8 space-y-4 scroll-mt-28 transition-all duration-300 hover:border-text-tan/40 hover:shadow-md before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-text-tan/0 hover:before:via-text-tan/60 before:transition-all before:duration-300"
        >
          {/* Subtle accent glow in corner */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-text-tan/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="inline-block px-3 py-1 rounded-md bg-tag-bg border border-tag-border text-tag-text text-xs font-mono mb-3">
              {project.category}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
              {project.title}
            </h1>
            <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed max-w-3xl">
              {project.summary}
            </p>
          </div>

          <div className="border-t border-border/80 pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono text-foreground font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-text-tan" />
              <span>{data.meta.year}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-text-tan" />
              <span>{data.meta.projectType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-text-tan" />
              <span>{data.meta.role}</span>
            </div>
            {project.is_featured && (
              <span className="px-2.5 py-0.5 rounded-full bg-btn-bg text-btn-text text-[10px] font-bold">
                ★ FEATURED
              </span>
            )}
          </div>
        </section>

        {/* CARD 2: PROJECT OVERVIEW CARD */}
        <section className="group/topic relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface border border-border shadow-sm p-6 sm:p-8 space-y-4 transition-all duration-300 hover:border-text-tan/40 hover:shadow-md before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-text-tan/0 hover:before:via-text-tan/60 before:transition-all before:duration-300">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 rounded-full bg-text-tan group-hover/topic:h-6 transition-all duration-300" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Project Overview</h3>
          </div>

          <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed whitespace-pre-line">
            {data.overview}
          </p>
        </section>

        {/* CARD 3: PROBLEM STATEMENT CARD */}
        <section
          id="case-study-sec-problem"
          className="group/topic relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface border border-border shadow-sm p-6 sm:p-8 space-y-4 scroll-mt-28 transition-all duration-300 hover:border-amber-500/40 hover:shadow-md before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-amber-500/0 hover:before:via-amber-500/60 before:transition-all before:duration-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 rounded-full bg-amber-500 group-hover/topic:h-6 transition-all duration-300" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Problem Statement</h3>
          </div>

          <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed whitespace-pre-line">
            {data.problem}
          </p>

          {/* Problem Bulleted Points if present */}
          {problemBullets.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-mono text-foreground uppercase tracking-wider mb-3 font-semibold">
                Key Friction & Bottlenecks Addressed:
              </p>
              <ul className="space-y-2 text-sm text-foreground font-medium">
                {problemBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* CARD 4: TECHNOLOGIES USED CARD (Grid of Pill Boxes Matching Reference Image) */}
        <section
          id="case-study-sec-tech-stack"
          className="group/topic relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface border border-border shadow-sm p-6 sm:p-8 space-y-4 scroll-mt-28 transition-all duration-300 hover:border-text-tan/40 hover:shadow-md before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-text-tan/0 hover:before:via-text-tan/60 before:transition-all before:duration-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 rounded-full bg-text-tan group-hover/topic:h-6 transition-all duration-300" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Technologies Used</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
            {allTags.map((tech) => (
              <div
                key={tech}
                className="p-3.5 rounded-xl bg-surface-card hover:bg-surface-card-hover border border-border hover:border-text-tan/60 text-center font-mono text-xs sm:text-sm text-foreground transition-all shadow-sm flex items-center justify-center font-semibold hover:-translate-y-0.5 duration-200"
              >
                {tech}
              </div>
            ))}
          </div>
        </section>

        {/* CARD 5: ARCHITECTURAL SOLUTION CARD */}
        <section
          id="case-study-sec-solution"
          className="group/topic relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface border border-border shadow-sm p-6 sm:p-8 space-y-4 scroll-mt-28 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-md before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-emerald-500/0 hover:before:via-emerald-500/60 before:transition-all before:duration-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 rounded-full bg-emerald-500 group-hover/topic:h-6 transition-all duration-300" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Architectural Solution</h3>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300 text-sm mb-2">
              Core Design Breakthrough
            </h4>
            <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed whitespace-pre-line">
              {data.solution}
            </p>
          </div>
        </section>

        {/* CARD 6: FEATURES & SYSTEM CAPABILITIES CARD */}
        <section
          id="case-study-sec-features"
          className="group/topic relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface border border-border shadow-sm p-6 sm:p-8 space-y-4 scroll-mt-28 transition-all duration-300 hover:border-text-tan/40 hover:shadow-md before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-text-tan/0 hover:before:via-text-tan/60 before:transition-all before:duration-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 rounded-full bg-text-tan group-hover/topic:h-6 transition-all duration-300" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Key Capabilities & Features</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {data.features.map((feature, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-surface-card border border-border hover:border-text-tan/50 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-2 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-text-tan/10 text-text-tan font-mono text-xs font-bold">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-foreground text-sm">
                    {feature.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed pl-8">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CARD 7: SYSTEM ARCHITECTURE & DATA FLOW (WITH UPLOADED DIAGRAM) */}
        <section
          id="case-study-sec-architecture"
          className="group/topic relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface border border-border shadow-sm p-6 sm:p-8 space-y-6 scroll-mt-28 transition-all duration-300 hover:border-text-tan/40 hover:shadow-md before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-text-tan/0 hover:before:via-text-tan/60 before:transition-all before:duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-5 rounded-full bg-text-tan group-hover/topic:h-6 transition-all duration-300" />
              <h3 className="text-lg sm:text-xl font-bold text-foreground">System Architecture & Data Flow</h3>
            </div>
            {data.architecture.image && (
              <span className="px-2.5 py-1 rounded-md bg-tag-bg border border-tag-border text-tag-text text-xs font-mono font-bold">
                Diagram Verified
              </span>
            )}
          </div>

          <p className="text-sm text-foreground font-medium leading-relaxed">
            {data.architecture.summary}
          </p>

          {/* Uploaded Architecture Diagram from Cloudinary/Local (Compact Edge-to-Edge Container) */}
          {data.architecture.image && (
            <div className="rounded-2xl overflow-hidden border border-border bg-[#0b0f14] shadow-md">
              <div className="px-4 py-2.5 bg-surface/95 border-b border-border flex items-center justify-between text-xs font-mono text-text-tan">
                <span className="flex items-center gap-2 font-semibold">
                  <Boxes className="w-3.5 h-3.5" />
                  <span>Architecture Specification Topology</span>
                </span>
                <span className="text-[11px] opacity-70">Click to Zoom</span>
              </div>
              <div 
                onClick={() => setExpandedImage(data.architecture.image!)}
                className="w-full bg-[#0b0f14] flex items-center justify-center p-1 sm:p-2 cursor-zoom-in group/arch overflow-hidden"
                title="Click to view full size"
              >
                <img
                  src={data.architecture.image}
                  alt={`${project.title} System Architecture`}
                  className="w-full h-auto max-h-[720px] object-contain rounded-xl transition-transform duration-300 group-hover/arch:scale-[1.01]"
                />
              </div>
            </div>
          )}

          {/* Data Flow Pipeline Phases */}
          {data.architecture.nodes && data.architecture.nodes.length > 0 && (
            <div className="relative pl-6 border-l-2 border-border/80 space-y-5 ml-2 pt-2">
              <p className="text-[11px] font-mono uppercase tracking-wider text-text-tan font-bold">
                Architecture Flow Pipeline ({data.architecture.nodes.length} Phases):
              </p>
              {data.architecture.nodes.map((node, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-text-tan group-hover:scale-125 transition-transform" />
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span className="text-xs font-mono text-text-tan font-bold">
                      Phase {node.step}:
                    </span>
                    <h5 className="font-bold text-foreground text-sm">
                      {node.name}
                    </h5>
                  </div>
                  <p className="text-xs text-foreground font-medium mt-1">
                    {node.role} — <span className="font-mono text-text-tan font-semibold">{node.tech}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CARD 8: MY CONTRIBUTIONS */}
        <section
          id="case-study-sec-contributions"
          className="group/topic relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface border border-border shadow-sm p-6 sm:p-8 space-y-4 scroll-mt-28 transition-all duration-300 hover:border-text-tan/40 hover:shadow-md before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-text-tan/0 hover:before:via-text-tan/60 before:transition-all before:duration-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 rounded-full bg-text-tan group-hover/topic:h-6 transition-all duration-300" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">My Contributions & Code Ownership</h3>
          </div>

          <div className="space-y-3">
            {data.myContributions.map((contrib, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-card border border-border hover:border-text-tan/40 transition-all duration-200">
                <Terminal className="w-4 h-4 text-text-tan mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                  {contrib}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CARD 9: PROJECT DEMO VIDEO & LIVE WALKTHROUGH */}
        <section
          id="case-study-sec-demo-video"
          className="group/topic relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface border border-border shadow-sm p-6 sm:p-8 space-y-4 scroll-mt-28 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-md before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-emerald-500/0 hover:before:via-emerald-500/60 before:transition-all before:duration-300"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-5 rounded-full bg-emerald-500 group-hover/topic:h-6 transition-all duration-300" />
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Live Demonstration Video</h3>
            </div>
            {project.video_url && (
              <span className="px-2.5 py-1 rounded-md bg-tag-bg text-tag-text border border-tag-border text-[10px] font-mono font-bold">
                HD Interactive Stream
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
            Full end-to-end system walkthrough demonstrating real-time data flows, user workflows, and core architecture execution.
          </p>

          {project.video_url ? (
            <div className="rounded-2xl overflow-hidden border border-border bg-black shadow-lg">
              <div className="px-4 py-2 bg-surface/95 border-b border-border flex items-center justify-between text-xs font-mono text-text-tan">
                <span className="flex items-center gap-2 font-semibold">
                  <Video className="w-4 h-4 text-emerald-500" />
                  <span>{project.title} — Demonstration Video</span>
                </span>
                <span className="text-[11px] opacity-70">Cloudinary CDN Stream</span>
              </div>
              <div className="relative w-full bg-black flex items-center justify-center">
                <video
                  src={project.video_url}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full max-h-[580px] bg-black object-contain mx-auto"
                />
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-surface-card border border-dashed border-border text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto text-text-tan">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-foreground text-sm">Demo Video Available Upon Request</h5>
                <p className="text-xs text-foreground max-w-md mx-auto mt-1 leading-relaxed font-medium">
                  You can upload a live demo recording (.mp4, .webm, .mov) directly in the Admin project manager, and it will be streamed here via Cloudinary CDN.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* CARD 10: TECHNICAL CHALLENGES & RESOLUTIONS */}
        <section
          id="case-study-sec-challenges"
          className="group/topic relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface border border-border shadow-sm p-6 sm:p-8 space-y-4 scroll-mt-28 transition-all duration-300 hover:border-amber-500/40 hover:shadow-md before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-amber-500/0 hover:before:via-amber-500/60 before:transition-all before:duration-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 rounded-full bg-amber-500 group-hover/topic:h-6 transition-all duration-300" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Technical Challenges & Trade-Offs</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.challenges.map((c, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-surface-card border border-border shadow-sm space-y-3 hover:border-amber-500/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {c.title}
                </h4>
                <div className="text-xs space-y-2">
                  <p className="text-foreground font-medium leading-relaxed">
                    <strong className="text-foreground font-bold">Obstacle: </strong>
                    {c.obstacle}
                  </p>
                  <p className="p-3 rounded-lg bg-surface border border-border text-foreground leading-relaxed font-medium">
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Resolution: </strong>
                    {c.resolution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CARD 11: MEASURABLE OUTCOMES & FUTURE SCOPE */}
        <section
          id="case-study-sec-outcomes"
          className="group/topic relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface border border-border shadow-sm p-6 sm:p-8 space-y-6 scroll-mt-28 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-md before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-emerald-500/0 hover:before:via-emerald-500/60 before:transition-all before:duration-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 rounded-full bg-emerald-500 group-hover/topic:h-6 transition-all duration-300" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Measurable Outcomes & Future Scope</h3>
          </div>

          <div>
            <h4 className="font-bold text-foreground text-sm mb-2">Production Impact</h4>
            <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
              {data.outcomes.summary}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-text-tan text-xs font-mono uppercase tracking-wider mb-3">
              Future Roadmap & Expansion
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {data.outcomes.futureScope.map((scope, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-card border border-border text-xs text-foreground hover:border-text-tan/40 transition-all duration-200 font-semibold"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-text-tan flex-shrink-0" />
                  <span>{scope}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Modal Bottom Footer Quick Bar */}
      {isModal && (
        <div className="sticky bottom-0 bg-surface-card/95 backdrop-blur-md border-t border-border p-4 px-6 flex flex-wrap items-center justify-between gap-3 shadow-lg rounded-b-3xl">
          <div className="text-xs text-text-secondary font-mono">
            <span>Engineering Case Study</span> • <span>{project.title}</span>
          </div>

          <div className="flex items-center gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-card border border-border text-foreground font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repo</span>
              </a>
            )}

            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground font-semibold text-xs transition-all"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Fullscreen Image Modal */}
      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in cursor-zoom-out"
        >
          <div className="relative max-w-6xl max-h-[92vh] w-full flex flex-col items-center justify-center">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-12 right-0 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <X className="w-4 h-4" />
              <span>Close View</span>
            </button>
            <img
              src={expandedImage}
              alt="Architecture view full scale"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
