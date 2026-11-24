"use client";

import { useState, useEffect, useRef } from "react";
import { Experience } from "@/types";
import { Briefcase, MapPin, Check, Star, ExternalLink } from "lucide-react";

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentElem = sectionRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="experience" 
      className="pt-12 sm:pt-16 pb-12 sm:pb-16 px-4 max-w-7xl mx-auto relative scroll-mt-20"
    >
      {/* Section Header - Full width left-aligned matching rest of portfolio with smooth scroll reveal */}
      <div 
        className={`mb-10 sm:mb-12 transition-all duration-700 ease-out ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
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

      {/* Cards Container with Entrance Animation */}
      <div 
        className={`space-y-8 transition-all duration-800 delay-150 ease-out ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {experience.map((item) => {
          const bulletList = item.bullet_points
            ? item.bullet_points.split("\n").filter(Boolean)
            : [];

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

          // Format duration string (e.g. "APR 2025 – OCT 2025 · 6 mos")
          const durationStr = item.start_date && item.end_date 
            ? `${item.start_date} – ${item.end_date} · 6 mos`
            : `${item.start_date || "APR 2025"} – ${item.end_date || "OCT 2025"}`;

          return (
            <div
              key={item.id}
              className="rounded-3xl bg-surface-card border border-border p-6 sm:p-8 shadow-sm hover:shadow-[0_20px_45px_rgba(212,176,124,0.14)] dark:hover:shadow-[0_20px_45px_rgba(212,176,124,0.2)] hover:border-text-tan/60 hover:-translate-y-1.5 transition-all duration-500 ease-out relative group overflow-hidden"
            >
              {/* Subtle ambient hover glow effects */}
              <div 
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-25 dark:group-hover:opacity-35 transition-opacity duration-700 ease-out"
                style={{ background: "radial-gradient(circle, var(--text-tan) 0%, transparent 70%)" }}
              />
              <div 
                className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-15 dark:group-hover:opacity-25 transition-opacity duration-700 ease-out"
                style={{ background: "radial-gradient(circle, var(--btn-bg) 0%, transparent 70%)" }}
              />

              {/* Top Header Row matching UI design image */}
              <div className="flex items-start gap-4 sm:gap-5 relative z-10">
                {/* Company Square Avatar Badge */}
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border group-hover:scale-105 group-hover:border-text-tan/70 group-hover:shadow-[0_4px_16px_rgba(212,176,124,0.22)] transition-all duration-300"
                  style={{
                    backgroundColor: "var(--btn-bg)",
                    borderColor: "var(--border)",
                  }}
                >
                  <span className="text-2xl sm:text-3xl font-extrabold text-text-tan tracking-tight group-hover:scale-110 transition-transform duration-300">
                    {companyInitial}
                  </span>
                </div>

                {/* Role, Company, Date, and Location Meta */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-foreground group-hover:text-text-tan tracking-tight leading-snug transition-colors duration-300">
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
                      <MapPin className="w-3.5 h-3.5 text-text-tan flex-shrink-0 group-hover:rotate-6 transition-transform duration-300" />
                      <span>{item.location}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Middle Section: All Bullet Points with Green Checkmarks (Full list, no truncation) */}
              {bulletList.length > 0 && (
                <div className="mt-6 space-y-2.5 pl-1 sm:pl-2 relative z-10">
                  {bulletList.map((bullet, idx) => {
                    const cleaned = bullet.replace(/^[•\-\*]\s*/, "");
                    const colonIdx = cleaned.indexOf(":");
                    const hasTitle = colonIdx > 0 && colonIdx < 55;

                    return (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3 text-xs sm:text-sm text-text-secondary leading-relaxed p-1.5 -ml-1.5 rounded-xl hover:bg-surface/60 hover:text-foreground transition-all duration-300 group/bullet cursor-default"
                      >
                        <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0 group-hover/bullet:scale-125 transition-transform duration-200" />
                        <div className="flex-1">
                          {hasTitle ? (
                            <>
                              <strong className="text-foreground font-bold group-hover/bullet:text-text-tan transition-colors duration-200">
                                {cleaned.substring(0, colonIdx + 1)}
                              </strong>
                              <span>{cleaned.substring(colonIdx + 1)}</span>
                            </>
                          ) : (
                            <span>{cleaned}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Section: Divider + Star icon + Skills list matching UI design */}
              <div className="border-t border-border/80 pt-4 mt-6 flex items-center gap-2 text-xs sm:text-[13px] text-text-secondary overflow-x-auto relative z-10 group-hover:border-text-tan/30 transition-colors duration-300">
                <Star className="w-4 h-4 text-text-tan flex-shrink-0 group-hover:rotate-12 group-hover:scale-115 transition-transform duration-300" />
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
