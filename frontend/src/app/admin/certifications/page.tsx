"use client";

import { useEffect, useState } from "react";
import { Certification, ContentStatus } from "@/types";
import { 
  adminGetCertifications, adminCreateCertification, 
  adminUpdateCertification, adminDeleteCertification,
  getPublicCertifications
} from "@/lib/api";
import StatusBadge from "@/components/admin/StatusBadge";
import MediaUploader from "@/components/admin/MediaUploader";
import { Plus, Edit, Trash2, Award, X, RotateCcw, Filter, FileText } from "lucide-react";
import { defaultCertifications } from "@/lib/defaultData";

const ADMIN_CERTIFICATE_CATEGORIES = [
  "Professional Learning & Certifications",
  "Technical & Programming Achievements",
  "Events & Participation",
  "Research & Publications",
  "Leadership & Professional Development"
] as const;

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>(defaultCertifications);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  
  // Clean, uncluttered form state matching user requirements
  const [formData, setFormData] = useState<Partial<Certification>>({
    title: "",
    category: "Professional Learning & Certifications",
    issuer: "",
    issue_date: "2024",
    certificate_image: "",
    description: "",
    status: "published",
    order_index: 0,
  });
  const [saving, setSaving] = useState(false);

  const loadCerts = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      let data = await adminGetCertifications();
      if (!data || data.length === 0) {
        const fallback = await getPublicCertifications().catch(() => []);
        if (fallback && fallback.length > 0) {
          data = fallback;
        } else {
          data = defaultCertifications;
        }
      }
      setCertifications(data || defaultCertifications);
    } catch (err: any) {
      console.warn("adminGetCertifications failed, attempting direct public fallback...", err);
      try {
        const fallback = await getPublicCertifications();
        if (fallback && fallback.length > 0) {
          setCertifications(fallback);
        } else {
          setCertifications(defaultCertifications);
        }
      } catch (fallbackErr: any) {
        setCertifications(defaultCertifications);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const openCreateModal = () => {
    setEditingCert(null);
    setFormData({
      title: "",
      category: "Professional Learning & Certifications",
      issuer: "",
      issue_date: "2024",
      certificate_image: "",
      description: "",
      status: "published",
      order_index: certifications.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cert: Certification) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title || "",
      category: cert.category || "Professional Learning & Certifications",
      issuer: cert.issuer || "",
      issue_date: cert.issue_date || "2024",
      certificate_image: cert.certificate_image || "",
      description: cert.description || "",
      status: cert.status || "published",
      order_index: cert.order_index ?? 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this credential?")) return;
    try {
      await adminDeleteCertification(id);
      setCertifications((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert("Failed: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCert) {
        const updated = await adminUpdateCertification(editingCert.id, formData);
        setCertifications((prev) => prev.map((c) => (c.id === editingCert.id ? updated : c)));
      } else {
        const created = await adminCreateCertification(formData);
        setCertifications((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-foreground">Accreditations & Certificates CMS</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-btn-bg text-btn-text text-[11px] font-mono font-bold">
              {certifications.length} {certifications.length === 1 ? "Credential" : "Credentials"}
            </span>
          </div>
          <p className="text-xs text-text-secondary font-mono mt-1">
            Manage public credentials, categorized badges, and details
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCerts}
            disabled={loading}
            className="p-2.5 rounded-xl bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground transition-all shadow-sm cursor-pointer"
            title="Refresh List"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin text-text-tan" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Credential</span>
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="glass-panel rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface border-b border-border text-text-secondary font-mono uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Credential</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Card Subtitle (Issuer & Date)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-text-secondary">
                  <div className="flex items-center justify-center gap-2">
                    <span 
                      className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" 
                      style={{ borderColor: "var(--text-tan)", borderTopColor: "transparent" }}
                    />
                    <span className="font-mono text-xs">Loading accreditations & certificates...</span>
                  </div>
                </td>
              </tr>
            ) : loadError && certifications.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 px-4 text-center">
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 max-w-md mx-auto space-y-2">
                    <p className="text-red-600 dark:text-red-400 font-bold text-xs">{loadError}</p>
                    <button
                      onClick={loadCerts}
                      className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-card border border-border text-foreground text-xs font-mono transition-all"
                    >
                      Retry Loading
                    </button>
                  </div>
                </td>
              </tr>
            ) : certifications.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-text-secondary">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Award className="w-8 h-8 text-text-tan/40" />
                    <p className="font-semibold text-foreground">No certifications found</p>
                    <p className="text-xs font-mono text-text-secondary">Add your first certificate or credential above.</p>
                    <button
                      onClick={openCreateModal}
                      className="mt-2 px-3 py-1.5 rounded-lg bg-btn-bg hover:bg-btn-hover text-btn-text text-xs font-bold transition-all"
                    >
                      + Add Credential
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              certifications.map((cert) => (
                <tr key={cert.id} className="hover:bg-surface-card-hover transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    <div className="flex items-center gap-3">
                      {cert.certificate_image ? (
                        <img
                          src={cert.certificate_image}
                          alt={cert.title}
                          className="w-12 h-8 object-cover rounded-md border border-border flex-shrink-0 shadow-xs"
                        />
                      ) : (
                        <div className="w-12 h-8 rounded-md bg-surface border border-border flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-text-tan" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-bold text-foreground text-xs sm:text-sm">{cert.title}</p>
                        {cert.description && (
                          <p className="text-[10px] text-text-secondary line-clamp-1 mt-0.5">
                            {cert.description.split("\n")[0]}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-tag-bg border border-tag-border text-tag-text font-mono text-[11px] font-bold whitespace-nowrap">
                      {cert.category || "Professional Learning & Certifications"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-text-secondary">
                    {cert.issuer}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={cert.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(cert)}
                        className="p-1.5 rounded-lg bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground cursor-pointer"
                        title="Edit Credential"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 cursor-pointer"
                        title="Delete Credential"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ======================================================== */}
      {/* SIMPLIFIED, UNCONGESTED ADMIN MODAL FORM                */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-surface-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-surface text-text-secondary hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-foreground">
                {editingCert ? "Edit Certification" : "Add New Credential"}
              </h2>
              <p className="text-xs text-text-secondary font-mono mt-1">
                Configure card display and complete details summary
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* 1. Title */}
              <div>
                <label className="block font-mono font-bold text-foreground mb-1.5">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. SOLSTICE - 2024 — Math Innovations Workshop"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan text-xs sm:text-sm font-semibold"
                />
              </div>

              {/* 2. Category Dropdown */}
              <div>
                <label className="block font-mono font-bold text-foreground mb-1.5">
                  Certificate Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan font-mono text-xs"
                >
                  {ADMIN_CERTIFICATE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Card Subtitle (Issuer & Date shown on card) */}
              <div>
                <label className="block font-mono font-bold text-foreground mb-1.5">
                  Card Subtitle (Issuer &amp; Date) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="e.g. SRMV College of Arts and Science • September 2024"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan text-xs"
                />
                <p className="text-[10px] text-text-secondary mt-1 font-mono">
                  This exact line is shown directly below the title on the certificate card.
                </p>
              </div>

              {/* 4. Certificate Image Upload */}
              <div className="p-4 rounded-2xl bg-surface/50 border border-border">
                <MediaUploader
                  label="Certificate Image (PNG, JPG, WebP)"
                  currentUrl={formData.certificate_image}
                  mediaType="image"
                  onUploadSuccess={(url) => setFormData({ ...formData, certificate_image: url })}
                />
              </div>

              {/* 5. Unified Details Box (Single spacious textarea) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-mono font-bold text-foreground">
                    Details Box (Full Information Summary)
                  </label>
                  <span className="text-[10px] text-text-tan font-mono">Shown when user clicks "Details"</span>
                </div>
                <textarea
                  rows={7}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={`Write or paste all details freely, e.g.:

Certificate of Participation for the one day workshop on 'Innovations in Learning Mathematics' - SOLSTICE - 2024 held on 24-09-2024.

Event: SOLSTICE - 2024
Topic: Innovations in Learning Mathematics
Date: 24 September 2024
Venue: Sri Ramakrishna Mission Vidyalaya College of Arts and Science
Department: Department of Mathematics
Affiliated to: Bharathiar University

Key Skills: Mathematical Innovation, Learning Methodologies, Workshop Participation`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan leading-relaxed font-mono text-xs custom-scrollbar"
                />
              </div>

              {/* 6. Status and Order Index */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {saving ? "Saving..." : editingCert ? "Save Changes" : "Create Credential"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
