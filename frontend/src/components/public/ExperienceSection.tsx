"use client";

import { useState } from "react";
import { Experience } from "@/types";
import { Briefcase, MapPin, Check, Star, ExternalLink } from "lucide-react";

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  // Toggle for "...see more" / "see less" on long bullet lists (matches UI design)
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const toggleExpand = (id: number) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="experience" className="py-20 sm:py-24 px-4 max-w-4xl mx-auto relative scroll-mt-20">
      {/* Section Header */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center gap-2 text-text-tan font-mono text-xs tracking-wider uppercase mb-2 font-bold">
          <Briefcase className="w-3.5 h-3.5" />
          <span>CHAPTERS OF EXPERIENCE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight uppercase">
          Internship Experience
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-2 font-mono">
          Hands-on engineering contributions, production system builds, and applied full-stack achievements.
        </p>
      </div>

      {/* Cards Container */}
      <div className="space-y-8">
        {experience.map((item) => {
          const bulletList = item.bullet_points
            ? item.bullet_points.split("\n").filter(Boolean)
            : [];

          const isExpanded = Boolean(expandedCards[item.id]);
          // If list is long, show first 2 by default, with "...see more" toggle matching image 3
          const displayedBullets = isExpanded || bulletList.length <= 2 
            ? bulletList 
            : bulletList.slice(0, 2);

          // Extract company initial for badge (e.g., 'P' for PhobosQ)
          const companyInitial = item.company ? item.company.trim().charAt(0).toUpperCase() : "P";

          // Format skills from description if provided
          let skillsLine = "";
          if (item.description && (item.description.includes("Tech Stack:") || item.description.includes("Skills:"))) {
            skillsLine = item.description
              .replace(/^(Tech Stack|Skills):\s*/i, "")
              .split(/[,·|]/)
              .map(s => s.trim())
              .filter(Boolean)
              .join(" · ");
          } else {
            skillsLine = "Python · FastAPI · Next.js · PostgreSQL · REST APIs";
          }

          // Calculate duration string (e.g. "APR 2025 – OCT 2025 · 6 mos")
          const durationStr = item.start_date && item.end_date 
            ? `${item.start_date} – ${item.end_date} · 6 mos`
            : `${item.start_date || "APR 2025"} – ${item.end_date || "OCT 2025"}`;

          return (
            <div
              key={item.id}
              className="rounded-3xl bg-surface-card border border-border p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden"
            >
              {/* Top Header Row matching UI design image 3 */}
              <div className="flex items-start gap-4 sm:gap-5">
                {/* Company Square Avatar Badge */}
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border"
                  style={{
                    backgroundColor: "var(--btn-bg)",
                    borderColor: "var(--border)",
                  }}
                >
                  <span className="text-2xl sm:text-3xl font-extrabold text-text-tan tracking-tight">
                    {companyInitial}
                  </span>
                </div>

                {/* Role, Company, Date, and Location Meta */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight leading-snug">
                      {item.role}
                    </h3>
                    {item.company_url && (
                      <a
                        href={item.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-tan hover:opacity-80 transition-opacity p-1"
                        title={`Visit ${item.company}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Company & Internship Type */}
                  <p className="text-xs sm:text-sm font-semibold text-text-secondary">
                    {item.company} · <span className="text-foreground/80 font-medium">Internship</span>
                  </p>

                  {/* Date Range & Duration */}
                  <p className="text-xs font-mono text-text-tan font-medium pt-0.5">
                    {durationStr}
                  </p>

                  {/* Location with Pin */}
                  {item.location && (
                    <p className="text-xs text-text-secondary flex items-center gap-1.5 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-text-tan flex-shrink-0" />
                      <span>{item.location}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Middle Section: Bullet Points with Green Checkmarks */}
              {bulletList.length > 0 && (
                <div className="mt-6 space-y-3.5 pl-1 sm:pl-2">
                  {displayedBullets.map((bullet, idx) => {
                    const cleaned = bullet.replace(/^[•\-\*]\s*/, "");
                    const colonIdx = cleaned.indexOf(":");
                    const hasTitle = colonIdx > 0 && colonIdx < 55;

                    return (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                        <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          {hasTitle ? (
                            <>
                              <strong className="text-foreground font-bold">
                                {cleaned.substring(0, colonIdx + 1)}
                              </strong>
                              <span>{cleaned.substring(colonIdx + 1)}</span>
                            </>
                          ) : (
                            <span>{cleaned}</span>
                          )}

                          {/* Show inline "...see more" on the second bullet if collapsed */}
                          {!isExpanded && idx === 1 && bulletList.length > 2 && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(item.id)}
                              className="ml-2 text-xs font-bold text-text-tan hover:underline cursor-pointer inline-flex items-center"
                            >
                              ...see more
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* "see less" toggle button if expanded */}
                  {isExpanded && bulletList.length > 2 && (
                    <div className="pt-1 pl-7">
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.id)}
                        className="text-xs font-bold text-text-tan hover:underline cursor-pointer"
                      >
                        see less
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Section: Divider + Star icon + Skills list matching UI design */}
              <div className="border-t border-border/80 pt-4 mt-6 flex items-center gap-2 text-xs sm:text-[13px] text-text-secondary overflow-x-auto">
                <Star className="w-4 h-4 text-text-tan flex-shrink-0" />
                <span className="font-bold text-foreground flex-shrink-0">Skills:</span>
                <span className="font-medium text-foreground/90 whitespace-nowrap">
                  {skillsLine}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
