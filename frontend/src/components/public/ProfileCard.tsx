"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/types";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

interface ProfileCardProps {
  profile?: Profile | null;
  className?: string;
}

export default function ProfileCard({ profile, className = "" }: ProfileCardProps) {
  const name = profile?.full_name || "Sanjitha E";
  const location = profile?.location || "Coimbatore, Tamil Nadu, India";
  const education = profile?.degree || "B.E. Computer Science & Engineering (AI & ML)";
  const bio =
    profile?.bio ||
    "Building intelligent solutions with Generative AI, Machine Learning and modern web technologies.";
  const avatar = profile?.avatar_url || "/sanjitha-card-forest.png";

  // Count-up animation states
  const [problemsCount, setProblemsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);

  // Mouse spotlight state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease-out quad
      const easeProgress = 1 - (1 - progress) * (1 - progress);

      setProblemsCount(Math.floor(easeProgress * 500));
      setProjectsCount(Math.floor(easeProgress * 10));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setProblemsCount(500);
        setProjectsCount(10);
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const coreInterests = [
    "Generative AI",
    "AI Agents",
    "LLMs",
    "RAG",
    "Python",
    "FastAPI",
    "Machine Learning",
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group/card relative w-full max-w-[480px] lg:max-w-[510px] rounded-3xl p-5 sm:p-5.5 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl backdrop-blur-xl ${className}
        bg-[#16221D] text-[#EDE8DC] border-[rgba(237,232,220,0.18)]
        dark:bg-[#F3EFE6] dark:text-[#1F2A24] dark:border-[#D6CFBF]`}
      style={{
        boxShadow: isHovered 
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 25px 0 rgba(176, 141, 94, 0.15)"
          : "0 10px 30px -10px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Subtle dynamic mouse spotlight glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 overflow-hidden"
        style={{
          background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(176, 141, 94, 0.12), transparent 70%)`,
        }}
      />

      {/* Top Profile Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-4.5">
        {/* Warm-Toned Portrait (150 x 180px with 22px rounded corners) */}
        <div className="group/avatar w-[140px] sm:w-[150px] h-[168px] sm:h-[180px] rounded-[22px] overflow-hidden flex-shrink-0 border-2 border-[rgba(237,232,220,0.25)] dark:border-[#D6CFBF] shadow-lg relative bg-[#182D24] transition-all duration-500">
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105 group-hover/avatar:scale-110"
            style={{ objectPosition: "46% top" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/sanjitha-portrait.png";
            }}
          />
          {/* Active status green dot on avatar corner */}
          <span 
            className="absolute bottom-2.5 right-2.5 w-4 h-4 rounded-full bg-[#1E6B42] border-2 border-[#16221D] dark:border-[#F3EFE6] shadow-sm flex items-center justify-center z-10"
            title="Online"
          >
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
          </span>
          {/* Subtle gradient vignette on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 text-center sm:text-left pt-1">
          <h2 className="text-2xl sm:text-[25px] font-extrabold tracking-tight text-[#EDE8DC] dark:text-[#1F2A24] truncate">
            {name}
          </h2>

          {/* Status Pill: Available for opportunities */}
          <div className="mt-1.5 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-105 cursor-default shadow-xs
            bg-[rgba(30,107,66,0.3)] border border-[rgba(74,222,128,0.4)] text-[#A7F3D0]
            dark:bg-[#E2ECE5] dark:border-[#B8D5C2] dark:text-[#1E6B42]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] dark:bg-[#1E6B42] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80] dark:bg-[#1E6B42]" />
            </span>
            <span>{profile?.open_to_work !== false ? "Available for opportunities" : "Currently engaged"}</span>
          </div>

          {/* Location & Degree */}
          <div className="mt-2.5 space-y-0.5 text-xs sm:text-[13px] text-[#BDB7A8] dark:text-[#5A5E55] leading-snug">
            <p className="font-medium text-[#BDB7A8] dark:text-[#5A5E55]">{location}</p>
            <p className="font-normal text-[#BDB7A8]/90 dark:text-[#5A5E55]/90">{education}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 h-[1px] w-full my-3 sm:my-3.5 bg-[rgba(237,232,220,0.12)] dark:bg-[#D6CFBF]/70" />

      {/* Section: A little about me */}
      <div className="relative z-10">
        <h3 className="text-xs sm:text-[14px] font-bold text-[#EDE8DC] dark:text-[#1F2A24] tracking-tight uppercase tracking-wider text-opacity-90">
          A little about me
        </h3>
        <p className="text-[13px] sm:text-[14px] text-[#BDB7A8] dark:text-[#5A5E55] mt-1 leading-relaxed font-normal">
          {bio}
        </p>
      </div>

      {/* Divider */}
      <div className="relative z-10 h-[1px] w-full my-3 sm:my-3.5 bg-[rgba(237,232,220,0.12)] dark:bg-[#D6CFBF]/70" />

      {/* Section: Quick highlights */}
      <div className="relative z-10">
        <h3 className="text-xs sm:text-[14px] font-bold text-[#EDE8DC] dark:text-[#1F2A24] tracking-tight uppercase tracking-wider text-opacity-90">
          Quick highlights
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-2 text-left">
          {/* 500+ Problems solved -> CodeChef */}
          <a
            href={profile?.codechef || "https://www.codechef.com/users/kpr24am047"}
            target="_blank"
            rel="noopener noreferrer"
            className="group/stat block space-y-0.5 p-1.5 sm:p-2 rounded-xl border border-transparent hover:border-[rgba(237,232,220,0.2)] dark:hover:border-[#D6CFBF] hover:bg-[rgba(237,232,220,0.06)] dark:hover:bg-[#EAE4D7]/60 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
            title="View CodeChef Profile"
          >
            <div className="text-xl sm:text-2xl font-extrabold text-[#D4B07C] dark:text-[#7A5C30] tracking-tight flex items-center gap-0.5">
              <span>{problemsCount}+</span>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4B07C] dark:text-[#7A5C30] transition-transform duration-300 group-hover/stat:translate-x-0.5 group-hover/stat:-translate-y-0.5" />
            </div>
            <div className="text-[11px] sm:text-xs text-[#BDB7A8] dark:text-[#5A5E55] font-medium group-hover/stat:text-[#EDE8DC] dark:group-hover/stat:text-[#1F2A24] transition-colors">
              Problems solved
            </div>
          </a>

          {/* 10+ Projects -> #projects section */}
          <a
            href="#projects"
            className="group/stat block space-y-0.5 p-1.5 sm:p-2 rounded-xl border border-transparent hover:border-[rgba(237,232,220,0.2)] dark:hover:border-[#D6CFBF] hover:bg-[rgba(237,232,220,0.06)] dark:hover:bg-[#EAE4D7]/60 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
            title="Jump to Projects"
          >
            <div className="text-xl sm:text-2xl font-extrabold text-[#D4B07C] dark:text-[#7A5C30] tracking-tight flex items-center gap-0.5">
              <span>{projectsCount}+</span>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4B07C] dark:text-[#7A5C30] transition-transform duration-300 group-hover/stat:translate-x-0.5 group-hover/stat:-translate-y-0.5" />
            </div>
            <div className="text-[11px] sm:text-xs text-[#BDB7A8] dark:text-[#5A5E55] font-medium group-hover/stat:text-[#EDE8DC] dark:group-hover/stat:text-[#1F2A24] transition-colors">
              Projects
            </div>
          </a>

          {/* AI/ML Specialization -> #skills section */}
          <a
            href="#skills"
            className="group/stat block space-y-0.5 p-1.5 sm:p-2 rounded-xl border border-transparent hover:border-[rgba(237,232,220,0.2)] dark:hover:border-[#D6CFBF] hover:bg-[rgba(237,232,220,0.06)] dark:hover:bg-[#EAE4D7]/60 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
            title="Jump to Skills"
          >
            <div className="text-xl sm:text-2xl font-extrabold text-[#D4B07C] dark:text-[#7A5C30] tracking-tight flex items-center gap-0.5">
              <span>AI/ML</span>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4B07C] dark:text-[#7A5C30] transition-transform duration-300 group-hover/stat:translate-x-0.5 group-hover/stat:-translate-y-0.5" />
            </div>
            <div className="text-[11px] sm:text-xs text-[#BDB7A8] dark:text-[#5A5E55] font-medium group-hover/stat:text-[#EDE8DC] dark:group-hover/stat:text-[#1F2A24] transition-colors">
              Specialization
            </div>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 h-[1px] w-full my-3 sm:my-3.5 bg-[rgba(237,232,220,0.12)] dark:bg-[#D6CFBF]/70" />

      {/* Section: Core interests */}
      <div className="relative z-10">
        <h3 className="text-xs sm:text-[14px] font-bold text-[#EDE8DC] dark:text-[#1F2A24] tracking-tight uppercase tracking-wider text-opacity-90">
          Core interests
        </h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
          {coreInterests.map((interest, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 cursor-pointer shadow-xs select-none hover:scale-105 hover:-translate-y-0.5
                bg-[rgba(237,232,220,0.08)] border border-[rgba(237,232,220,0.18)] text-[#EDE8DC] hover:border-[#D4B07C] hover:text-[#D4B07C]
                dark:bg-[#EAE4D7] dark:border-[#D6CFBF] dark:text-[#1F2A24] dark:hover:border-[#7A5C30] dark:hover:text-[#7A5C30]"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Bar / Footer inside Card */}
      <div className="relative z-10 border-t border-[rgba(237,232,220,0.12)] dark:border-[#D6CFBF]/70 pt-3 sm:pt-3.5 mt-3 sm:mt-3.5 flex items-center justify-between">
        {/* Slogan */}
        <span className="text-xs sm:text-sm font-bold text-[#EDE8DC] dark:text-[#1F2A24] tracking-wide hover:text-[#D4B07C] dark:hover:text-[#7A5C30] transition-colors cursor-default">
          Dream · Build · Innovate
        </span>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          <a
            href={profile?.github || "https://github.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EDE8DC]/80 dark:text-[#1F2A24]/85 hover:text-[#D4B07C] dark:hover:text-[#7A5C30] hover:-translate-y-1 hover:scale-115 transition-all duration-200 p-0.5"
            title="GitHub Profile"
          >
            <Github className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </a>
          <a
            href={profile?.linkedin || "https://linkedin.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EDE8DC]/80 dark:text-[#1F2A24]/85 hover:text-[#D4B07C] dark:hover:text-[#7A5C30] hover:-translate-y-1 hover:scale-115 transition-all duration-200 p-0.5"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </a>
          <a
            href={`mailto:${profile?.email || "sanjitha.e.dev@gmail.com"}`}
            className="text-[#EDE8DC]/80 dark:text-[#1F2A24]/85 hover:text-[#D4B07C] dark:hover:text-[#7A5C30] hover:-translate-y-1 hover:scale-115 transition-all duration-200 p-0.5"
            title="Send Email"
          >
            <Mail className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </a>
        </div>
      </div>
    </div>
  );
}
