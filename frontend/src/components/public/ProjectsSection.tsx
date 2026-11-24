"use client";

import { useState, useEffect, useRef } from "react";
import { Project } from "@/types";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import ProjectCaseStudyModal from "./ProjectCaseStudyModal";
import ProjectFolderCard from "./ProjectFolderCard";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [isInView, setIsInView] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);

  // Scroll Entrance Observer (Option A + B)
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

  // Display top 3 featured projects on the homepage
  const displayedProjects = projects.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="pt-12 sm:pt-16 pb-12 sm:pb-16 px-4 max-w-7xl mx-auto relative scroll-mt-20"
    >
      {/* Section Header */}
      <div
        className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 transition-all duration-700 ease-out ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div>
          <div className="flex items-center gap-2 text-text-tan font-mono text-xs tracking-wider uppercase mb-2 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-text-tan animate-pulse" />
            <span>Project Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight uppercase">
            IDEAS INTO REALITY
          </h2>
          <p className="text-sm sm:text-base text-text-secondary mt-2 max-w-xl leading-relaxed">
            Every project tells a story of innovation and learning.
          </p>
        </div>

        {/* Top-Right Corner Button to navigate to full projects page */}
        <div className="flex items-center">
          <Link
            href="/projects"
            className="group/btn relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-btn-bg text-btn-text hover:bg-btn-hover font-bold text-xs sm:text-sm shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden cursor-pointer"
            title="View all projects"
          >
            {/* Shimmer sweep effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Projects Grid with Staggered Scroll Entrance & Ambient Glow */}
      {displayedProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-surface-card">
          <p className="text-text-secondary text-sm">No published projects available at this moment.</p>
        </div>
      ) : (
        <div className="relative pt-4 pb-2">
          {/* Subtle Dot Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
            style={{
              backgroundImage: "radial-gradient(var(--text-tan) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 relative z-10">
            {displayedProjects.map((project, index) => {
              const delay = index * 150;

              return (
                <div
                  key={project.id}
                  className={`transition-all duration-700 ease-out transform ${
                    isInView
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-12 scale-[0.98]"
                  } hover:scale-[1.015] hover:shadow-[0_16px_40px_rgba(122,92,48,0.2)] dark:hover:shadow-[0_16px_40px_rgba(212,176,124,0.16)] rounded-3xl transition-shadow`}
                  style={{
                    transitionDelay: isInView ? `${delay}ms` : "0ms",
                  }}
                >
                  <ProjectFolderCard
                    project={project}
                    index={index}
                    onOpenDetails={setActiveModalProject}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Project Case Study Deep-Dive Modal */}
      {activeModalProject && (
        <ProjectCaseStudyModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </section>
  );
}
