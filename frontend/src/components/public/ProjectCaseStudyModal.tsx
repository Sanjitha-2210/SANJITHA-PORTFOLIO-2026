"use client";

import { useEffect } from "react";
import { Project } from "@/types";
import ProjectCaseStudyView from "./ProjectCaseStudyView";

interface ProjectCaseStudyModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectCaseStudyModal({ project, onClose }: ProjectCaseStudyModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      <ProjectCaseStudyView project={project} isModal={true} onClose={onClose} />
    </div>
  );
}
