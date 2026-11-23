"use client";

import { useState } from "react";
import { Project } from "@/types";
import { ArrowRight, Github, Video, Sparkles } from "lucide-react";

interface ProjectFolderCardProps {
  project: Project;
  index: number;
  onOpenDetails: (project: Project) => void;
}

// Universal function to extract the project's brand name / short title
function getProjectAcronym(project: Project): string {
  // 1. If title contains a separator like " — ", " - ", or ":", extract the project brand name
  // E.g. "Smart Tourist Safety System — TourEzy" -> "TOUREZY"
  const parts = project.title.split(/\s*[—–:\-]\s*/);
  if (parts.length > 1 && parts[1].trim()) {
    const secondPart = parts[1].trim().replace(/[^A-Za-z0-9 ]/g, "").toUpperCase();
    if (secondPart.length <= 14) {
      return secondPart;
    }
  }

  // 2. Otherwise take the first 1-2 words of the title (e.g. "Blog Platform" -> "BLOG PLATFORM")
  const words = project.title.trim().split(/\s+/);
  if (words.length >= 2 && (words[0].length + words[1].length <= 14)) {
    return `${words[0]} ${words[1]}`.toUpperCase();
  }
  return words[0].toUpperCase();
}

// Universal function to extract a clean subtitle or category for any project
function getProjectSubtitle(project: Project): string {
  // If title has a descriptive front part (e.g. "Smart Tourist Safety System — TourEzy"), use the front part
  const parts = project.title.split(/\s*[—–:\-]\s*/);
  if (parts.length > 1 && parts[0].trim()) {
    return parts[0].trim().toLowerCase();
  }

  // Otherwise, use the category
  if (project.category) {
    return project.category.toLowerCase();
  }

  // Fallback to first few words of summary
  const words = project.summary.replace(/^(developed|built|created|engineered|designed)\s+(a\s+)?/i, "").split(/\s+/);
  return words.slice(0, 4).join(" ").toLowerCase();
}

export default function ProjectFolderCard({
  project,
  index,
  onOpenDetails,
}: ProjectFolderCardProps) {
  const acronym = getProjectAcronym(project);
  const subtitle = getProjectSubtitle(project);
  const formattedIndex = String(index + 1).padStart(2, "0");

  const tags = project.tags
    ? project.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div
      onClick={() => onOpenDetails(project)}
      className="group relative cursor-pointer select-none transition-all duration-300"
      style={{ minHeight: "360px" }}
    >
      {/* 1. BACK FOLDER TAB & SLEEVE (Earthy Warm Kraft/Tan Backing) */}
      <div className="absolute inset-0 rounded-3xl bg-[#8c6b4b] dark:bg-[#433423] transition-transform duration-300 group-hover:-translate-y-1 shadow-md overflow-hidden">
        {/* Subtle decorative folder spine/tab accent on top edge */}
        <div className="absolute top-0 right-0 w-32 h-6 bg-[#785b3e] dark:bg-[#34281b] rounded-bl-xl opacity-60" />
      </div>

      {/* 2. INNER FILE SHEET (Slides UP when folder is hovered) */}
      <div className="absolute top-2 left-2.5 right-2.5 bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 shadow-lg border border-black/5 dark:border-white/10 transition-transform duration-400 ease-out group-hover:-translate-y-9">
        {/* Sheet Top Header: Bold Acronym + Subtitle */}
        <div className="flex items-baseline gap-2.5 mb-3">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#163323] dark:text-emerald-400 font-mono">
            {acronym}
          </span>
          <span className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 lowercase truncate">
            {subtitle}
          </span>
        </div>

        {/* Sheet Content Preview: Inset Screenshot / Media Box */}
        <div className="relative h-28 sm:h-32 w-full rounded-xl overflow-hidden bg-[#e5ded2]/70 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/50 flex items-center justify-center">
          {project.featured_image ? (
            <img
              src={project.featured_image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              [ architecture preview ]
            </span>
          )}

          {/* Featured Ribbon if featured */}
          {project.is_featured && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-btn-bg text-btn-text text-[10px] font-mono font-bold flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-text-tan" />
              <span>CORE</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. FRONT FOLDER FLAP (With the Iconic Tabbed Cut-Out Silhouette) */}
      <div className="absolute bottom-0 left-0 right-0 h-[215px] sm:h-[225px] z-10 filter drop-shadow-xl">
        {/* SVG Folder Flap Shape with Asymmetrical Top Tab */}
        <svg
          viewBox="0 0 400 225"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full text-[#fbf9f5] dark:text-[#18211c]"
        >
          {/* Defined Path: High tab on the left (0 to 160), smooth S-curve down, lower right tab (230 to 400) */}
          <path
            d="M 0,26 A 26,26 0 0,1 26,0 L 155,0 C 190,0 200,44 235,44 L 374,44 A 26,26 0 0,1 400,70 L 400,199 A 26,26 0 0,1 374,225 L 26,225 A 26,26 0 0,1 0,199 Z"
            fill="currentColor"
            className="transition-colors duration-300"
          />
          {/* Subtle Border Stroke */}
          <path
            d="M 0,26 A 26,26 0 0,1 26,0 L 155,0 C 190,0 200,44 235,44 L 374,44 A 26,26 0 0,1 400,70 L 400,199 A 26,26 0 0,1 374,225 L 26,225 A 26,26 0 0,1 0,199 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-border opacity-70"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Front Flap Content: Title, Category • Index, Tags, & Action Pebble */}
        <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-between pt-10 sm:pt-12">
          {/* Title & Metadata */}
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight group-hover:text-text-tan transition-colors line-clamp-1 mb-1.5">
              {project.title.split(/:\s*|\s*-\s*/)[0]}
            </h3>

            <div className="flex items-center gap-2 text-xs font-mono text-text-secondary tracking-wider uppercase mb-2">
              <span>{project.category}</span>
              <span className="opacity-50">•</span>
              <span className="font-bold text-foreground">{formattedIndex}</span>
            </div>

            {/* Tags Pills */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-tag-bg border border-tag-border text-[10px] font-mono text-tag-text"
                  >
                    #{tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-[10px] font-mono text-text-secondary opacity-70 self-center">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Row: External Links + Dark Pebble Arrow Button */}
          <div className="flex items-center justify-between pt-2">
            {/* Quick Repository & Video Demo Indicator */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground transition-colors shadow-sm"
                  title="View GitHub Repository"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.video_url && (
                <button
                  type="button"
                  onClick={() => onOpenDetails(project)}
                  className="p-2 rounded-xl bg-surface hover:bg-surface-card border border-border text-emerald-500 hover:text-emerald-400 transition-colors shadow-sm flex items-center gap-1"
                  title="Watch Project Demo Video"
                >
                  <Video className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dark Pebble Button with Arrow (Matches Reference Image) */}
            <div
              className="w-12 h-12 rounded-2xl bg-[#14231b] dark:bg-white text-white dark:text-[#14231b] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-text-tan group-hover:text-black"
              title="Open Project Case Study"
            >
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
