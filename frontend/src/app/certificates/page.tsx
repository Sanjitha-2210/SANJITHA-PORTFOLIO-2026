"use client";

import { useEffect, useState } from "react";
import { Certification } from "@/types";
import { getPublicCertifications } from "@/lib/api";
import { Award, Eye, Download, X, ArrowLeft, FileText, Search } from "lucide-react";
import Link from "next/link";
import AmbientAurora from "@/components/public/AmbientAurora";
import SpotlightCursor from "@/components/public/SpotlightCursor";
import { CERTIFICATE_CATEGORIES } from "@/components/public/CertificationsSection";

export default function AllCertificatesPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewCert, setPreviewCert] = useState<Certification | null>(null);
  const [detailsCert, setDetailsCert] = useState<Certification | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = () => {
      getPublicCertifications()
        .then((data) => {
          if (isMounted) setCertifications(data);
        })
        .catch((err) => {
          console.error("Failed to load certificates", err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    };

    loadData();

    // Real-time live synchronization (without page reloading)
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("portfolio_sync_channel");
      channel.onmessage = (event) => {
        if (event.data?.type === "PORTFOLIO_UPDATED") {
          loadData();
        }
      };
    }

    const handleCustomUpdate = () => loadData();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "portfolio_sync_trigger") loadData();
    };

    window.addEventListener("portfolio_updated", handleCustomUpdate);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", loadData);

    const intervalId = setInterval(loadData, 5000);

    return () => {
      isMounted = false;
      if (channel) channel.close();
      window.removeEventListener("portfolio_updated", handleCustomUpdate);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", loadData);
      clearInterval(intervalId);
    };
  }, []);

  const filtered = certifications.filter((cert) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (cert.category || "Professional Learning & Certifications") === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === "" ||
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.description && cert.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-background bg-ambient-aurora text-foreground py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <AmbientAurora />
      <SpotlightCursor />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/80">
          <div>
            <Link
              href="/#certifications"
              className="inline-flex items-center gap-2 text-xs font-mono text-text-tan hover:text-foreground transition-colors mb-3 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Portfolio</span>
            </Link>
            <div className="flex items-center gap-2.5">
              <Award className="w-6 h-6 text-text-tan" />
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                All Certifications & Accreditations
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 font-mono">
              Comprehensive registry of verified credentials, workshop participations, and honors.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, issuer, topic..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-card border border-border text-foreground text-xs focus:outline-none focus:border-text-tan transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {CERTIFICATE_CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? certifications.length
                : certifications.filter(
                    (c) => (c.category || "Professional Learning & Certifications") === cat
                  ).length;

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
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-btn-text" : "bg-surface text-text-secondary"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="py-24 text-center">
            <div
              className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: "var(--text-tan)", borderTopColor: "transparent" }}
            />
            <p className="text-xs font-mono text-text-secondary">Loading credentials registry...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center rounded-3xl border border-dashed border-border bg-surface-card max-w-xl mx-auto p-8">
            <Award className="w-12 h-12 text-text-tan/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-foreground">No certifications match your criteria</h3>
            <p className="text-xs text-text-secondary mt-1 font-mono">
              Try switching category or clearing the search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-btn-bg text-btn-text text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* All Certificates Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((cert) => (
              <div
                key={cert.id}
                className="rounded-3xl bg-surface-card border border-border p-5 flex flex-col justify-between group shadow-sm hover:border-text-tan/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
              >
                <div>
                  {/* Category Pill Tag */}
                  <div className="mb-3">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-tag-bg border border-tag-border text-tag-text font-bold">
                      {cert.category || "Professional Learning & Certifications"}
                    </span>
                  </div>

                  {/* Certificate Image Frame */}
                  <div className="relative h-44 sm:h-48 w-full rounded-2xl bg-surface border border-border/80 overflow-hidden flex items-center justify-center p-2">
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

                  {/* Title & Subtitle */}
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
      </div>

      {/* 1. PREVIEW MODAL — GLASS CARD WITH SEAMLESS FIT */}
      {previewCert && (
        <div
          onClick={() => setPreviewCert(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-auto max-w-4xl bg-card-bg backdrop-blur-2xl border border-border/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
          >
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

      {/* 2. DETAILS MODAL — SOLID CARD WITH DETAIL SUMMARY BOX */}
      {detailsCert && (
        <div
          onClick={() => setDetailsCert(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-surface-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
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

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground leading-snug">
                {detailsCert.title}
              </h2>
              <p className="text-xs sm:text-sm font-mono text-text-tan font-bold mt-1.5">
                {detailsCert.issuer}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border text-foreground font-medium text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs">
              {detailsCert.description || (
                "Certificate of participation and evaluation validating technical coursework and engineering excellence."
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
