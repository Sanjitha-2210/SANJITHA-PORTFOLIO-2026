"use client";

import { useEffect, useState, useMemo } from "react";
import { Project } from "@/types";
import { getPublicProjects } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Search, Sparkles, FolderGit2 } from "lucide-react";
import SpotlightCursor from "@/components/public/SpotlightCursor";
import AmbientAurora from "@/components/public/AmbientAurora";
import ProjectFolderCard from "@/components/public/ProjectFolderCard";
import ProjectCaseStudyModal from "@/components/public/ProjectCaseStudyModal";
import Footer from "@/components/public/Footer";

export default function AllProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const loadProjects = () => {
    getPublicProjects()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load projects:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProjects();

    // Cross-tab and real-time sync with CMS Admin
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("portfolio_sync_channel");
      channel.onmessage = (event) => {
        if (event.data?.type === "PORTFOLIO_UPDATED") {
          loadProjects();
        }
      };
    }

    const handleUpdate = () => loadProjects();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "portfolio_sync_trigger") loadProjects();
    };

    window.addEventListener("portfolio_updated", handleUpdate);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleUpdate);

    const intervalId = setInterval(loadProjects, 5000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("portfolio_updated", handleUpdate);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleUpdate);
      clearInterval(intervalId);
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return projects;
    return projects.filter((project) => {
      return (
        project.title.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.tags.toLowerCase().includes(q) ||
        (project.category && project.category.toLowerCase().includes(q))
      );
    });
  }, [projects, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-text-tan selection:text-white">
      {/* Background Lighting & Particles */}
      <AmbientAurora />
      <SpotlightCursor />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-surface/80 dark:bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-card hover:bg-surface-card-hover border border-border hover:border-text-tan text-foreground text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-text-tan" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-text-tan font-bold">
            <FolderGit2 className="w-4 h-4" />
            <span>All Projects ({projects.length})</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-text-tan font-mono text-xs tracking-wider uppercase mb-2 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-text-tan animate-pulse" />
              <span>Project Journey • Complete Archive</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight uppercase">
              IDEAS INTO REALITY
            </h1>
            <p className="text-sm sm:text-base text-text-secondary mt-2 max-w-2xl leading-relaxed">
              Every project tells a story of innovation and learning. Explore the full catalog of full-stack systems, AI architectures, and engineering breakthroughs.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search all projects, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-card border border-border focus:border-text-tan text-foreground placeholder-text-secondary text-sm focus:outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-text-tan border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-mono text-text-secondary">Loading project showcase...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-16 text-center rounded-2xl border border-dashed border-border bg-surface-card space-y-3">
            <p className="text-text-secondary text-sm">No published projects match your search criteria.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-mono text-text-tan font-bold hover:underline"
              >
                Clear Search Query
              </button>
            )}
          </div>
        ) : (
          <div className="relative pt-4 pb-12">
            {/* Subtle Dot Grid Background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
              style={{
                backgroundImage: "radial-gradient(var(--text-tan) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 relative z-10">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="hover:scale-[1.015] hover:shadow-[0_16px_40px_rgba(122,92,48,0.2)] dark:hover:shadow-[0_16px_40px_rgba(212,176,124,0.16)] rounded-3xl transition-all duration-300"
                >
                  <ProjectFolderCard
                    project={project}
                    index={index}
                    onOpenDetails={setActiveModalProject}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Case Study Deep-Dive Modal */}
      {activeModalProject && (
        <ProjectCaseStudyModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </div>
  );
}
