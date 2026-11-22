"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Project } from "@/types";
import { getPublicProjectBySlug } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Play, ShieldAlert } from "lucide-react";
import SpotlightCursor from "@/components/public/SpotlightCursor";
import AmbientAurora from "@/components/public/AmbientAurora";
import RobotChatbot from "@/components/public/RobotChatbot";
import ProjectCaseStudyView from "@/components/public/ProjectCaseStudyView";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    const loadProject = () => {
      getPublicProjectBySlug(slug)
        .then((data) => {
          if (isMounted) setProject(data);
        })
        .catch((err) => {
          if (isMounted) setError(err.message || "Project not found or not published");
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    };

    loadProject();

    // Cross-tab and local real-time sync
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("portfolio_sync_channel");
      channel.onmessage = (event) => {
        if (event.data?.type === "PORTFOLIO_UPDATED") {
          loadProject();
        }
      };
    }

    const handleUpdate = () => loadProject();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "portfolio_sync_trigger") loadProject();
    };

    window.addEventListener("portfolio_updated", handleUpdate);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleUpdate);

    return () => {
      isMounted = false;
      if (channel) channel.close();
      window.removeEventListener("portfolio_updated", handleUpdate);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleUpdate);
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text-secondary font-mono text-sm">
        <span 
          className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin mr-3"
          style={{ borderColor: "var(--text-tan)", borderTopColor: "transparent" }}
        />
        Resolving system architecture...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4 transition-colors">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Access Restricted or Not Found</h1>
        <p className="text-sm text-text-secondary max-w-md mb-6">
          This system specification is either draft, archived, or does not exist in the public repository.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-surface-card border border-border text-foreground hover:border-text-tan text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Showcase</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background bg-ambient-aurora text-foreground py-12 px-4 transition-colors">
      <AmbientAurora />
      <SpotlightCursor />

      <div className="max-w-5xl mx-auto">
        <ProjectCaseStudyView project={project} isModal={false} />
      </div>

      <RobotChatbot profile={null} projects={project ? [project] : []} />
    </div>
  );
}
