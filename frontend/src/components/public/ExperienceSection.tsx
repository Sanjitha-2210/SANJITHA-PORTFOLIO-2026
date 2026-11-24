"use client";

import { Experience } from "@/types";
import { Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-24 px-4 max-w-7xl mx-auto relative">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-text-tan font-mono text-xs tracking-wider uppercase mb-2">
          <Briefcase className="w-3.5 h-3.5" />
          <span>CHAPTERS OF EXPERIENCE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight uppercase">
          Internship Experience
        </h2>
        <p className="text-sm text-text-secondary mt-2 max-w-xl">
          Every opportunity bringing new skills, challenges, and perspectives.
        </p>
      </div>

      <div className="relative border-l border-border ml-4 md:ml-8 pl-6 md:pl-10 space-y-12">
        {experience.map((item) => {
          const bulletList = item.bullet_points
            ? item.bullet_points.split("\n").filter(Boolean)
            : [];

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Indicator Dot */}
              <div
                className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 border-background transition-colors"
                style={{
                  backgroundColor: item.is_current ? "var(--btn-bg)" : "var(--text-secondary)",
                  boxShadow: item.is_current ? "0 0 12px var(--text-tan)" : "none"
                }}
              />

              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-border space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-text-tan transition-colors">
                      {item.role}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
                      <span>{item.company}</span>
                      {item.company_url && (
                        <a
                          href={item.company_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-tan hover:opacity-80 transition-opacity"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-text-tan">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.start_date} – {item.end_date || "Present"}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1 text-text-secondary">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {item.description && (
                  <div className="pt-1">
                    {item.description.startsWith("Tech Stack:") ? (
                      <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-xl bg-tag-bg border border-tag-border text-tag-text text-xs font-mono font-medium">
                        <span className="font-bold text-text-tan">Tech Stack:</span>
                        <span>{item.description.replace(/^Tech Stack:\s*/i, "")}</span>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}

                {bulletList.length > 0 && (
                  <ul className="space-y-2.5 pt-2 border-t border-border">
                    {bulletList.map((bullet, idx) => (
                      <li key={idx} className="text-xs sm:text-[13px] text-text-secondary flex items-start gap-2.5 leading-relaxed">
                        <span 
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" 
                          style={{ backgroundColor: "var(--text-tan)" }}
                        />
                        <span>{bullet.replace(/^[•\-\*]\s*/, "")}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
