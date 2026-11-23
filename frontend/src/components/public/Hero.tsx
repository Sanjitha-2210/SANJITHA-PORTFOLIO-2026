"use client";

import { useState } from "react";
import { Profile } from "@/types";
import { Download, ArrowRight, Sparkles, X, FileText } from "lucide-react";
import ProfileCard from "./ProfileCard";

interface HeroProps {
  profile: Profile | null;
  onOpenTerminal: () => void;
}

export default function Hero({ profile, onOpenTerminal }: HeroProps) {
  const name = profile?.full_name || "Sanjitha E";
  const title = profile?.title || "GenAI Application Developer";
  const bio =
    profile?.bio ||
    "I build GenAI applications that turn language models and data into tools people can actually use.";

  // Resume modal preview state
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const rawResumeUrl = profile?.resume_url;
  // If the resume is uploaded to Cloudinary as a PDF, generate URLs for all pages (e.g. page 1 and page 2)
  const isCloudinaryPdf = Boolean(rawResumeUrl && rawResumeUrl.includes("res.cloudinary.com") && /\.pdf(\?.*)?$/i.test(rawResumeUrl));

  const resumePages = isCloudinaryPdf
    ? [
        rawResumeUrl!.replace("/upload/", "/upload/pg_1/").replace(/\.pdf(\?.*)?$/i, ".jpg"),
        rawResumeUrl!.replace("/upload/", "/upload/pg_2/").replace(/\.pdf(\?.*)?$/i, ".jpg"),
      ]
    : rawResumeUrl
    ? [rawResumeUrl]
    : [];

  const resumeDownloadUrl = rawResumeUrl
    ? rawResumeUrl.includes("res.cloudinary.com") && /\.pdf(\?.*)?$/i.test(rawResumeUrl)
      ? rawResumeUrl.replace("/upload/", "/upload/fl_attachment:Sanjitha_Resume/")
      : rawResumeUrl
    : "";

  const isRawPdfIframe = Boolean(
    !isCloudinaryPdf &&
    rawResumeUrl &&
    /\.pdf(\?.*)?$/i.test(rawResumeUrl)
  );

  return (
    <section className="relative pt-24 sm:pt-28 pb-8 sm:pb-12 min-h-[calc(100vh-4rem)] flex items-start px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient light orbs */}
      <div 
        className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-30" 
        style={{ background: "radial-gradient(circle, var(--text-tan) 0%, transparent 70%)" }}
      />
      <div 
        className="absolute top-32 right-10 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none opacity-15 dark:opacity-25" 
        style={{ background: "radial-gradient(circle, var(--btn-bg) 0%, transparent 70%)" }}
      />

      {/* Main Grid: Left = Content, Right = Profile Card - Aligned to top */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full">
        
        {/* Left Column: Text & Assistant (Col 1 to 7) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10 space-y-5 sm:space-y-6">
          
          {/* Top Pill Badge matching image: ✧ Turning ideas into intelligent solutions | */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tag-bg border border-tag-border text-tag-text text-xs sm:text-sm font-mono backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-text-tan" />
            <span className="font-semibold tracking-wide">Turning ideas into intelligent solutions</span>
            <span className="inline-block w-0.5 h-4 bg-text-tan animate-pulse" />
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
              Hi, I&apos;m{" "}
              <span className="text-gradient-name">
                {name}
              </span>
            </h1>
            <p className="mt-2.5 text-2xl sm:text-3xl lg:text-[40px] font-extrabold text-foreground tracking-tight leading-tight">
              {title}
            </p>
            {/* Signature Accent Line */}
            <div 
              className="w-20 sm:w-24 h-2 rounded-full mt-4" 
              style={{ background: "linear-gradient(to right, var(--name-grad-from), var(--name-grad-to))" }}
            />
          </div>

          {/* Description - Value statement */}
          <p className="text-base sm:text-lg lg:text-[19px] text-text-secondary max-w-2xl leading-relaxed whitespace-pre-line">
            {bio}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            {/* Resume Button -> Opens Glass Card Preview Modal */}
            <button
              type="button"
              onClick={() => setIsResumeOpen(true)}
              className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-btn-bg text-btn-text hover:bg-btn-hover font-bold text-sm sm:text-base transition-all shadow-md flex items-center gap-2.5 group cursor-pointer"
            >
              <FileText className="w-4.5 h-4.5 transition-transform group-hover:scale-110" />
              <span>Resume</span>
            </button>

            {/* Contact Button */}
            <a
              href="#contact"
              className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-surface-card hover:bg-surface-card-hover border border-border hover:border-text-tan text-foreground font-bold text-sm sm:text-base transition-all shadow-sm flex items-center gap-2.5 group"
            >
              <span>Contact Me</span>
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Right Column: Profile Card (Col 8 to 12) - Aligned to top */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end items-start relative z-10 w-full">
          {/* Subtle ambient light glow behind card */}
          <div 
            className="absolute inset-4 rounded-3xl blur-3xl pointer-events-none opacity-20 dark:opacity-30" 
            style={{ background: "radial-gradient(circle, var(--text-tan) 0%, transparent 70%)" }}
          />

          <ProfileCard profile={profile} />
        </div>

      </div>

      {/* ======================================================== */}
      {/* RESUME PREVIEW MODAL — GLASS CARD (MATCHES CERTIFICATE)  */}
      {/* ======================================================== */}
      {isResumeOpen && (
        <div
          onClick={() => setIsResumeOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
        >
          {/* Glass Card Container (+20% wider with max-w-5xl, snug fit, comfortable scrolling) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-card-bg backdrop-blur-2xl border border-border/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
          >
            {/* Glass Card Header */}
            <div className="p-4 sm:px-6 bg-surface/80 backdrop-blur-md border-b border-border/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-text-tan" />
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  Resume Preview — {name} {resumePages.length > 1 && `(${resumePages.length} Pages)`}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsResumeOpen(false)}
                className="px-3.5 py-1 rounded-full bg-surface-card hover:bg-surface-card-hover border border-border text-xs text-foreground font-semibold transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Modal Body: Multi-page high-definition render */}
            <div className="p-4 sm:p-6 flex flex-col items-center gap-6 overflow-y-auto max-h-[76vh]">
              {resumePages.length > 0 ? (
                isRawPdfIframe ? (
                  <iframe
                    src={`${rawResumeUrl}#toolbar=0&navpanes=0`}
                    title="Resume Document"
                    className="w-full h-[72vh] rounded-2xl border border-border/60 shadow-lg bg-white"
                  />
                ) : (
                  resumePages.map((pageUrl, index) => (
                    <div key={index} className="w-full flex flex-col items-center">
                      {resumePages.length > 1 && (
                        <div className="self-start text-[11px] font-mono text-text-secondary mb-1.5 px-2">
                          Page {index + 1} of {resumePages.length}
                        </div>
                      )}
                      <img
                        src={pageUrl}
                        alt={`${name}'s Resume - Page ${index + 1}`}
                        className="w-full max-w-4xl h-auto object-contain rounded-2xl border border-border/60 shadow-lg bg-white"
                        loading="lazy"
                      />
                    </div>
                  ))
                )
              ) : (
                <div className="py-20 px-8 text-center space-y-2">
                  <FileText className="w-10 h-10 text-text-tan/60 mx-auto" />
                  <p className="text-sm font-bold text-foreground">No Resume Document Uploaded Yet</p>
                  <p className="text-xs text-text-secondary font-mono">
                    Please upload your resume in Admin → Profile.
                  </p>
                </div>
              )}
            </div>

            {/* Glass Card Footer with Download Action in the bottom right */}
            <div className="p-3.5 sm:px-6 bg-surface/80 backdrop-blur-md border-t border-border/80 flex items-center justify-end">
              {resumeDownloadUrl ? (
                <a
                  href={resumeDownloadUrl}
                  download="Sanjitha_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="px-5 py-2 rounded-xl bg-surface border border-border text-text-secondary text-xs font-bold opacity-60 cursor-not-allowed flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
