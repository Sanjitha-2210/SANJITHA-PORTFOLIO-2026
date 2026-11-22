"use client";

import { useEffect, useState } from "react";
import { Education, Milestone, ContentStatus } from "@/types";
import { 
  adminGetEducation, adminCreateEducation, 
  adminUpdateEducation, adminDeleteEducation,
  adminGetMilestones, adminCreateMilestone,
  adminUpdateMilestone, adminDeleteMilestone
} from "@/lib/api";
import StatusBadge from "@/components/admin/StatusBadge";
import { 
  Plus, Edit, Trash2, GraduationCap, BookOpen, X, Award, 
  Calendar, Layers, Milestone as MilestoneIcon, CheckCircle2, Clock
} from "lucide-react";

export default function AdminEducationPage() {
  const [activeTab, setActiveTab] = useState<"education" | "milestones">("education");

  // Education state
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducationItem, setEditingEducationItem] = useState<Education | null>(null);
  const [educationFormData, setEducationFormData] = useState<Partial<Education>>({
    degree: "",
    institution: "",
    period: "2024 — 2028",
    metrics: "CGPA: 8.7/10",
    tags: "AI & ML",
    icon: "degree",
    status: "published",
    order_index: 0,
  });

  // Milestones state
  const [milestonesList, setMilestonesList] = useState<Milestone[]>([]);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestoneItem, setEditingMilestoneItem] = useState<Milestone | null>(null);
  const [milestoneFormData, setMilestoneFormData] = useState<Partial<Milestone>>({
    year: 2024,
    pct: 33.33,
    title: "",
    subtitle: "",
    period: "2024",
    status: "Completed",
    order_index: 0,
  });

  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [eduData, msData] = await Promise.all([
        adminGetEducation().catch(() => []),
        adminGetMilestones().catch(() => []),
      ]);
      setEducationList(eduData);
      setMilestonesList(msData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ---------------- EDUCATION HANDLERS ----------------
  const openCreateEducationModal = () => {
    setEditingEducationItem(null);
    setEducationFormData({
      degree: "",
      institution: "",
      period: "2024 — 2028",
      metrics: "CGPA: 8.7/10",
      tags: "AI & ML",
      icon: "degree",
      status: "published",
      order_index: educationList.length + 1,
    });
    setIsEducationModalOpen(true);
  };

  const openEditEducationModal = (item: Education) => {
    setEditingEducationItem(item);
    setEducationFormData({ ...item });
    setIsEducationModalOpen(true);
  };

  const handleDeleteEducation = async (id: number) => {
    if (!confirm("Are you sure you want to delete this education record?")) return;
    try {
      await adminDeleteEducation(id);
      setEducationList((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleEducationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingEducationItem) {
        const updated = await adminUpdateEducation(editingEducationItem.id, educationFormData);
        setEducationList((prev) => prev.map((e) => (e.id === editingEducationItem.id ? updated : e)));
      } else {
        const created = await adminCreateEducation(educationFormData);
        setEducationList((prev) => [...prev, created]);
      }
      setIsEducationModalOpen(false);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------------- MILESTONE HANDLERS ----------------
  const openCreateMilestoneModal = () => {
    setEditingMilestoneItem(null);
    const nextYear = 2022 + milestonesList.length;
    const computedPct = Math.min(100, Math.round(((nextYear - 2022) / 6) * 100 * 100) / 100);
    setMilestoneFormData({
      year: nextYear,
      pct: computedPct,
      title: "",
      subtitle: "",
      period: `${nextYear}`,
      status: nextYear <= 2025 ? "Completed" : nextYear === 2026 ? "In Progress" : "Upcoming",
      order_index: milestonesList.length + 1,
    });
    setIsMilestoneModalOpen(true);
  };

  const openEditMilestoneModal = (item: Milestone) => {
    setEditingMilestoneItem(item);
    setMilestoneFormData({ ...item });
    setIsMilestoneModalOpen(true);
  };

  const handleDeleteMilestone = async (id?: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    try {
      await adminDeleteMilestone(id);
      setMilestonesList((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert("Failed to delete milestone: " + err.message);
    }
  };

  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Auto-compute pct if 0 and year in range
      let finalData = { ...milestoneFormData };
      if ((!finalData.pct || finalData.pct === 0) && finalData.year && finalData.year >= 2022 && finalData.year <= 2028) {
        finalData.pct = Math.round(((finalData.year - 2022) / 6) * 100 * 100) / 100;
      }

      if (editingMilestoneItem?.id) {
        const updated = await adminUpdateMilestone(editingMilestoneItem.id, finalData);
        setMilestonesList((prev) => prev.map((m) => (m.id === editingMilestoneItem.id ? updated : m)));
      } else {
        const created = await adminCreateMilestone(finalData);
        setMilestonesList((prev) => [...prev, created].sort((a, b) => a.year - b.year));
      }
      setIsMilestoneModalOpen(false);
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
          <h1 className="text-2xl font-extrabold text-foreground">Education & Timeline CMS</h1>
          <p className="text-xs text-text-secondary font-mono mt-1">
            Manage degree cards, school achievements, and interactive yearly milestones
          </p>
        </div>

        {activeTab === "education" ? (
          <button
            onClick={openCreateEducationModal}
            className="px-4 py-2.5 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Degree / School Card</span>
          </button>
        ) : (
          <button
            onClick={openCreateMilestoneModal}
            className="px-4 py-2.5 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Timeline Milestone</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-surface border border-border w-fit">
        <button
          onClick={() => setActiveTab("education")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === "education"
              ? "bg-surface-card text-foreground shadow-sm border border-border"
              : "text-text-secondary hover:text-foreground"
          }`}
        >
          <GraduationCap className="w-4 h-4 text-text-tan" />
          <span>Degrees & School Cards</span>
          <span className="px-2 py-0.5 rounded-full bg-text-tan/15 text-text-tan text-[10px]">
            {educationList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("milestones")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === "milestones"
              ? "bg-surface-card text-foreground shadow-sm border border-border"
              : "text-text-secondary hover:text-foreground"
          }`}
        >
          <MilestoneIcon className="w-4 h-4 text-emerald-500" />
          <span>Timeline Milestones (2022 — 2028)</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px]">
            {milestonesList.length}
          </span>
        </button>
      </div>

      {/* TAB 1: EDUCATION DEGREES & SCHOOL CARDS */}
      {activeTab === "education" && (
        <div className="glass-panel rounded-2xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface border-b border-border text-text-secondary font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Degree & Institution</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Score / Metric</th>
                <th className="py-3 px-4">Specialization Tags</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {educationList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-secondary">
                    No education records found. Click &quot;Add Degree / School Card&quot; above to create one.
                  </td>
                </tr>
              ) : (
                educationList.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-card-hover transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-text-tan/15 text-text-tan flex items-center justify-center flex-shrink-0">
                          {item.icon === "school" ? (
                            <BookOpen className="w-4 h-4" />
                          ) : (
                            <GraduationCap className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{item.degree}</div>
                          <div className="text-text-secondary font-mono text-[11px]">{item.institution}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-text-tan">
                      {item.period}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-btn-bg/15 text-text-tan border border-btn-bg/25">
                        <Award className="w-3 h-3" />
                        {item.metrics || "N/A"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.tags ? (
                          item.tags.split(",").map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-tag-bg border border-tag-border text-[10px] font-mono text-tag-text"
                            >
                              {t.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-text-secondary font-mono text-[10px]">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditEducationModal(item)}
                          className="p-1.5 rounded-lg bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground"
                          title="Edit Record"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEducation(item.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
                          title="Delete Record"
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
      )}

      {/* TAB 2: TIMELINE MILESTONES (2022 — 2028) */}
      {activeTab === "milestones" && (
        <div className="glass-panel rounded-2xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface border-b border-border text-text-secondary font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Year & Position</th>
                <th className="py-3 px-4">Milestone Title</th>
                <th className="py-3 px-4">Subtitle / Narrative</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {milestonesList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-secondary">
                    No timeline milestones found. Click &quot;Add Timeline Milestone&quot; above to create one.
                  </td>
                </tr>
              ) : (
                milestonesList.map((m) => (
                  <tr key={m.id || m.year} className="hover:bg-surface-card-hover transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-foreground bg-surface px-2.5 py-1 rounded-lg border border-border">
                          {m.year}
                        </span>
                        <span className="font-mono text-[11px] text-text-secondary">
                          {m.pct.toFixed(1)}% on track
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {m.title}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary max-w-xs truncate" title={m.subtitle}>
                      {m.subtitle}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-text-tan">
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
                          onClick={() => openEditMilestoneModal(m)}
                          className="p-1.5 rounded-lg bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground"
                          title="Edit Milestone"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMilestone(m.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
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
      )}

      {/* Modal 1: Education Record Modal */}
      {isEducationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface-card border border-border rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEducationModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-surface text-text-secondary hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-4">
              {editingEducationItem ? "Edit Education Record" : "Add Education Record"}
            </h2>

            <form onSubmit={handleEducationSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-text-secondary mb-1">Degree / Qualification *</label>
                <input
                  type="text"
                  required
                  value={educationFormData.degree}
                  onChange={(e) => setEducationFormData({ ...educationFormData, degree: e.target.value })}
                  placeholder="e.g. B.E. Computer Science Engineering (AI & ML)"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                />
              </div>

              <div>
                <label className="block font-mono text-text-secondary mb-1">Institution / School / College *</label>
                <input
                  type="text"
                  required
                  value={educationFormData.institution}
                  onChange={(e) => setEducationFormData({ ...educationFormData, institution: e.target.value })}
                  placeholder="e.g. KPR Institute of Engineering and Technology, Coimbatore"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Timeline / Period *</label>
                  <input
                    type="text"
                    required
                    value={educationFormData.period}
                    onChange={(e) => setEducationFormData({ ...educationFormData, period: e.target.value })}
                    placeholder="e.g. 2024 — 2028 or 2022 — 2024"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Score / CGPA / Percentage</label>
                  <input
                    type="text"
                    value={educationFormData.metrics || ""}
                    onChange={(e) => setEducationFormData({ ...educationFormData, metrics: e.target.value })}
                    placeholder="e.g. CGPA: 8.7/10 or 88.5%"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-text-secondary mb-1">Specialization Tags (comma-separated)</label>
                <input
                  type="text"
                  value={educationFormData.tags || ""}
                  onChange={(e) => setEducationFormData({ ...educationFormData, tags: e.target.value })}
                  placeholder="e.g. AI & ML or Mathematics, Computer Science"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Card Icon</label>
                  <select
                    value={educationFormData.icon || "degree"}
                    onChange={(e) => setEducationFormData({ ...educationFormData, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  >
                    <option value="degree">Graduation Cap</option>
                    <option value="school">Book / School</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-text-secondary mb-1">Status</label>
                  <select
                    value={educationFormData.status}
                    onChange={(e) => setEducationFormData({ ...educationFormData, status: e.target.value as ContentStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-text-secondary mb-1">Order Index</label>
                  <input
                    type="number"
                    value={educationFormData.order_index ?? 0}
                    onChange={(e) => setEducationFormData({ ...educationFormData, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEducationModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs shadow-sm"
                >
                  {saving ? "Saving..." : editingEducationItem ? "Save Changes" : "Create Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Timeline Milestone Modal */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface-card border border-border rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsMilestoneModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-surface text-text-secondary hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-4">
              {editingMilestoneItem ? "Edit Timeline Milestone" : "Add Timeline Milestone"}
            </h2>

            <form onSubmit={handleMilestoneSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Milestone Year *</label>
                  <input
                    type="number"
                    required
                    min={2000}
                    max={2050}
                    value={milestoneFormData.year}
                    onChange={(e) => {
                      const yr = parseInt(e.target.value) || 2024;
                      const autoPct = yr >= 2022 && yr <= 2028 ? Math.round(((yr - 2022) / 6) * 100 * 100) / 100 : milestoneFormData.pct;
                      setMilestoneFormData({ ...milestoneFormData, year: yr, pct: autoPct });
                    }}
                    placeholder="e.g. 2024"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>

                <div>
                  <label className="block font-mono text-text-secondary mb-1">Timeline Position (% on Bar)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={100}
                    value={milestoneFormData.pct ?? 0}
                    onChange={(e) => setMilestoneFormData({ ...milestoneFormData, pct: parseFloat(e.target.value) || 0 })}
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
                  value={milestoneFormData.title}
                  onChange={(e) => setMilestoneFormData({ ...milestoneFormData, title: e.target.value })}
                  placeholder="e.g. HSC 88.5% & B.E. College Entry"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                />
              </div>

              <div>
                <label className="block font-mono text-text-secondary mb-1">Subtitle / Key Narrative *</label>
                <textarea
                  required
                  rows={3}
                  value={milestoneFormData.subtitle}
                  onChange={(e) => setMilestoneFormData({ ...milestoneFormData, subtitle: e.target.value })}
                  placeholder="e.g. Joined B.E. Computer Science Engineering (AI & ML) at KPR Institute, Coimbatore"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Display Period Label *</label>
                  <input
                    type="text"
                    required
                    value={milestoneFormData.period}
                    onChange={(e) => setMilestoneFormData({ ...milestoneFormData, period: e.target.value })}
                    placeholder="e.g. June 2024 or 2024 — 2025"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>

                <div>
                  <label className="block font-mono text-text-secondary mb-1">Status</label>
                  <select
                    value={milestoneFormData.status}
                    onChange={(e) => setMilestoneFormData({ ...milestoneFormData, status: e.target.value as any })}
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
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs shadow-sm"
                >
                  {saving ? "Saving..." : editingMilestoneItem ? "Save Changes" : "Create Milestone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
