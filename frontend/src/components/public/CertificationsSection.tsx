"use client";

import { useState } from "react";
import { Certification } from "@/types";
import { Award, Eye, Download, X, ArrowRight, FileText, Sparkles, Filter } from "lucide-react";
import Link from "next/link";
import { sortCertificatesByDate } from "@/lib/utils";

interface CertificationsSectionProps {
  certifications: Certification[];
}

export const CERTIFICATE_CATEGORIES = [
  "All",
  "Professional Learning & Certifications",
  "Technical & Programming Achievements",
  "Events & Participation",
  "Research & Publications",
  "Leadership & Professional Development"
] as const;

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [previewCert, setPreviewCert] = useState<Certification | null>(null);
  const [detailsCert, setDetailsCert] = useState<Certification | null>(null);

  // Sort chronologically: newest/most recent certificate first
  const sortedCerts = sortCertificatesByDate(certifications);

  // Filter by category
  const filteredCerts = selectedCategory === "All"
    ? sortedCerts
    : sortedCerts.filter((c) => (c.category || "Professional Learning & Certifications") === selectedCategory);

  // Display top 3 certificates on the home showcase
  const displayedCerts = filteredCerts.slice(0, 3);

  return (
    <section id="certifications" className="py-20 sm:py-24 px-4 max-w-7xl mx-auto relative scroll-mt-20">
      {/* Section Header with Top-Right View All Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 text-text-tan font-mono text-xs tracking-wider uppercase mb-2 font-bold">
            <Award className="w-4 h-4 text-text-tan" />
            <span>Accreditations & Recognitions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight uppercase">
            Certifications
          </h2>
          <p className="text-sm sm:text-base text-text-secondary mt-2 max-w-2xl leading-relaxed">
            Verified academic honors, national hackathons, and technical cloud accreditations.
          </p>
        </div>

        {/* Top-Right Corner Button to navigate to full certificates page */}
        <div className="flex items-center">
          <Link
            href="/certificates"
            className="group/btn relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-btn-bg text-btn-text hover:bg-btn-hover font-bold text-xs sm:text-sm shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden cursor-pointer"
            title="View all certificates"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
        {CERTIFICATE_CATEGORIES.map((cat) => {
          const count = cat === "All"
            ? certifications.length
            : certifications.filter((c) => (c.category || "Professional Learning & Certifications") === cat).length;
          
          if (cat !== "All" && count === 0) return null;

          const isActive = selectedCategory === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                isActive
                  ? "bg-btn-bg text-btn-text shadow-sm scale-105"
                  : "bg-surface-card hover:bg-surface text-foreground border border-border hover:border-text-tan/60"
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isActive ? "bg-white/20 text-btn-text" : "bg-surface text-text-secondary"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Certifications 3-Card Grid */}
      {displayedCerts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-surface-card">
          <Award className="w-10 h-10 text-text-tan/40 mx-auto mb-3" />
          <p className="text-foreground font-bold text-sm">No certificates found in this category</p>
          <p className="text-xs text-text-secondary font-mono mt-1">Select another category or view all certificates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {displayedCerts.map((cert) => (
            <div
              key={cert.id}
              className="rounded-3xl bg-surface-card border border-border p-5 flex flex-col justify-between group shadow-sm hover:border-text-tan/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div>
                {/* Certificate Image Frame (Clean, without hover preview overlay) */}
                <div
                  className="relative h-44 sm:h-48 w-full rounded-2xl bg-surface border border-border/80 overflow-hidden flex items-center justify-center p-2"
                >
                  {cert.certificate_image ? (
                    <img
                      src={cert.certificate_image}
                      alt={cert.title}
                      className="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="text-xs font-mono text-text-secondary flex flex-col items-center gap-2">
                      <Award className="w-8 h-8 text-text-tan/60" />
                      <span>Verified Credential</span>
                    </div>
                  )}
                </div>

                {/* Title & Issuer Subtitle */}
                <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-text-tan transition-colors mt-4 mb-1.5 leading-snug line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-xs text-text-secondary font-mono mb-4">
                  {cert.issuer}
                </p>
              </div>

              {/* Bottom Action Pill Buttons: Preview & Details */}
              <div className="flex items-center gap-2.5 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setPreviewCert(cert)}
                  className="px-4 py-1.5 rounded-full border border-border hover:border-text-tan text-xs font-semibold bg-surface hover:bg-surface-card-hover text-foreground transition-all flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-text-tan" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDetailsCert(cert)}
                  className="px-4 py-1.5 rounded-full border border-border hover:border-text-tan text-xs font-semibold bg-surface hover:bg-surface-card-hover text-foreground transition-all flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-text-tan" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. PREVIEW MODAL — GLASS CARD WITH SEAMLESS FIT          */}
      {/* ======================================================== */}
      {previewCert && (
        <div
          onClick={() => setPreviewCert(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
        >
          {/* Glass Card Container (Snug fit to image without black letterbox sidebars) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-auto max-w-4xl bg-card-bg backdrop-blur-2xl border border-border/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
          >
            {/* Glass Card Header */}
            <div className="p-4 sm:px-6 bg-surface/80 backdrop-blur-md border-b border-border/80 flex items-center justify-between gap-4">
              <h4 className="text-xs sm:text-sm font-bold text-foreground truncate pr-4">
                Preview — {previewCert.title}
              </h4>
              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                className="px-3.5 py-1 rounded-full bg-surface-card hover:bg-surface-card-hover border border-border text-xs text-foreground font-semibold transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Modal Body: Clean Certificate Render (No black bars) */}
            <div className="p-3 sm:p-5 flex items-center justify-center overflow-auto">
              {previewCert.certificate_image ? (
                <img
                  src={previewCert.certificate_image}
                  alt={previewCert.title}
                  className="max-h-[72vh] w-auto h-auto max-w-full object-contain rounded-2xl border border-border/60 shadow-lg"
                />
              ) : (
                <div className="py-16 text-center text-xs font-mono text-text-secondary">
                  Certificate image not available
                </div>
              )}
            </div>

            {/* Glass Card Footer with Download Action */}
            <div className="p-3.5 sm:px-6 bg-surface/80 backdrop-blur-md border-t border-border/80 flex items-center justify-end">
              {previewCert.certificate_image && (
                <a
                  href={previewCert.certificate_image}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. DETAILS MODAL — SOLID CARD WITH DETAIL SUMMARY BOX    */}
      {/* ======================================================== */}
      {detailsCert && (
        <div
          onClick={() => setDetailsCert(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
        >
          {/* Solid Card Container (Not glass) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-surface-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Details</h3>
              <button
                type="button"
                onClick={() => setDetailsCert(null)}
                className="px-3.5 py-1 rounded-full bg-surface hover:bg-surface-card-hover border border-border text-xs text-foreground font-semibold transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground leading-snug">
                {detailsCert.title}
              </h2>
              <p className="text-xs sm:text-sm font-mono text-text-tan font-bold mt-1.5">
                {detailsCert.issuer}
              </p>
            </div>

            {/* Unified Detail Box: Free-form complete summary */}
            <div className="p-5 rounded-2xl bg-surface border border-border text-foreground font-medium text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs">
              {detailsCert.description || (
                "Certificate of participation and evaluation validating technical coursework and engineering excellence."
              )}
            </div>

            {/* Optional Verification Link if available */}
            {detailsCert.credential_url && (
              <div className="pt-2 flex justify-end">
                <a
                  href={detailsCert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text text-xs font-bold transition-all shadow-xs"
                >
                  <span>Verify Credential Online</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
