"use client";

import { useEffect, useState } from "react";
import { Milestone } from "@/types";
import { 
  adminGetMilestones, adminCreateMilestone, 
  adminUpdateMilestone, adminDeleteMilestone 
} from "@/lib/api";
import { 
  Plus, Edit, Trash2, Milestone as MilestoneIcon, 
  X, CheckCircle2, Clock, Sparkles, ExternalLink 
} from "lucide-react";
import Link from "next/link";

export default function AdminMilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [formData, setFormData] = useState<Partial<Milestone>>({
    year: 2024,
    pct: 33.33,
    title: "",
    subtitle: "",
    period: "2024",
    status: "Completed",
    order_index: 0,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMilestones = async () => {
    try {
      setLoading(true);
      const data = await adminGetMilestones();
      setMilestones(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMilestones();
  }, []);

  const openCreateModal = () => {
    setEditingMilestone(null);
    const nextYear = 2022 + milestones.length;
    const computedPct = Math.min(100, Math.round(((nextYear - 2022) / 6) * 100 * 100) / 100);
    setFormData({
      year: nextYear,
      pct: computedPct,
      title: "",
      subtitle: "",
      period: `${nextYear}`,
      status: nextYear <= 2025 ? "Completed" : nextYear === 2026 ? "In Progress" : "Upcoming",
      order_index: milestones.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Milestone) => {
    setEditingMilestone(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this timeline milestone?")) return;
    try {
      await adminDeleteMilestone(id);
      setMilestones((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert("Failed to delete milestone: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalData = { ...formData };
      if ((!finalData.pct || finalData.pct === 0) && finalData.year && finalData.year >= 2022 && finalData.year <= 2028) {
        finalData.pct = Math.round(((finalData.year - 2022) / 6) * 100 * 100) / 100;
      }

      if (editingMilestone?.id) {
        const updated = await adminUpdateMilestone(editingMilestone.id, finalData);
        setMilestones((prev) => prev.map((m) => (m.id === editingMilestone.id ? updated : m)));
      } else {
        const created = await adminCreateMilestone(finalData);
        setMilestones((prev) => [...prev, created].sort((a, b) => a.year - b.year));
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Failed to save milestone: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-foreground">Timeline Milestones CMS</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-mono text-[11px] font-bold border border-emerald-500/25">
              Live Sync
            </span>
          </div>
          <p className="text-xs text-text-secondary font-mono mt-1">
            Manage interactive milestone popup cards that appear when hovering over years (2022 — 2028)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#education"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-text-tan" />
            <span>Preview Timeline</span>
          </Link>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* Narrative Guide Banner */}
      <div className="p-4 rounded-2xl bg-surface-card border border-border flex items-start gap-3 shadow-sm">
        <div className="p-2 rounded-xl bg-text-tan/15 text-text-tan mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-foreground">Interactive Timeline Popups</h3>
          <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
            On the public site, hovering over any year (e.g. <strong>2022</strong>, <strong>2023</strong>, <strong>2024</strong>) pops up the corresponding milestone card with your title, period, and story narrative. Click <strong>Edit</strong> on any year below to update its content anytime.
          </p>
        </div>
      </div>

      {/* Milestones Cards Grid & Table */}
      <div className="glass-panel rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface border-b border-border text-text-secondary font-mono uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Year & Position</th>
              <th className="py-3 px-4">Milestone Title</th>
              <th className="py-3 px-4">Narrative Description (Popup Content)</th>
              <th className="py-3 px-4">Period</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-text-secondary font-mono">
                  Loading timeline milestones...
                </td>
              </tr>
            ) : milestones.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-text-secondary">
                  No milestones found. Click &quot;Add Milestone&quot; to create one.
                </td>
              </tr>
            ) : (
              milestones.map((m) => (
                <tr key={m.id || m.year} className="hover:bg-surface-card-hover transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-foreground bg-surface px-2.5 py-1 rounded-lg border border-border">
                        {m.year}
                      </span>
                      <span className="font-mono text-[11px] text-text-secondary">
                        {m.pct.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {m.title}
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary max-w-sm truncate" title={m.subtitle}>
                    {m.subtitle}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-text-tan font-semibold">
                    {m.period}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        m.status === "Completed"
                          ? "bg-[#B08D5E]/20 text-[#B08D5E] border border-[#B08D5E]/30"
                          : m.status === "In Progress"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-surface-card border border-border text-text-secondary"
                      }`}
                    >
                      {m.status === "Completed" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      <span>{m.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(m)}
                        className="px-2.5 py-1.5 rounded-lg bg-surface hover:bg-surface-card border border-border text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Edit Milestone Content"
                      >
                        <Edit className="w-3.5 h-3.5 text-text-tan" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                        title="Delete Milestone"
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

      {/* Add / Edit Milestone Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface-card border border-border rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-surface text-text-secondary hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-4">
              {editingMilestone ? `Edit Milestone (${editingMilestone.year})` : "Add Timeline Milestone"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Milestone Year *</label>
                  <input
                    type="number"
                    required
                    min={2000}
                    max={2050}
                    value={formData.year}
                    onChange={(e) => {
                      const yr = parseInt(e.target.value) || 2024;
                      const autoPct = yr >= 2022 && yr <= 2028 ? Math.round(((yr - 2022) / 6) * 100 * 100) / 100 : formData.pct;
                      setFormData({ ...formData, year: yr, pct: autoPct });
                    }}
                    placeholder="e.g. 2024"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>

                <div>
                  <label className="block font-mono text-text-secondary mb-1">Track Position (% on bar)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={100}
                    value={formData.pct ?? 0}
                    onChange={(e) => setFormData({ ...formData, pct: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g. 33.33"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-text-secondary mb-1">Milestone Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Higher Secondary (HSC) Inception"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                />
              </div>

              <div>
                <label className="block font-mono text-text-secondary mb-1">Subtitle / Key Narrative (Popup Content) *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Began Mathematics with Computer Science at Perambalur Govt Model School"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Display Period Label *</label>
                  <input
                    type="text"
                    required
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="e.g. June 2022 or 2022 — 2024"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>

                <div>
                  <label className="block font-mono text-text-secondary mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs shadow-sm"
                >
                  {saving ? "Saving..." : editingMilestone ? "Save Changes" : "Create Milestone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

