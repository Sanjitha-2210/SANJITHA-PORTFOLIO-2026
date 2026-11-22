"use client";

import { useEffect, useState } from "react";
import { Experience, ContentStatus } from "@/types";
import { 
  adminGetExperience, adminCreateExperience, 
  adminUpdateExperience, adminDeleteExperience 
} from "@/lib/api";
import StatusBadge from "@/components/admin/StatusBadge";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function AdminExperiencePage() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({
    role: "",
    company: "",
    company_url: "",
    location: "Bengaluru, India",
    start_date: "2024",
    end_date: "",
    is_current: true,
    description: "",
    bullet_points: "",
    status: "published",
    order_index: 0,
  });
  const [saving, setSaving] = useState(false);

  const loadExperience = async () => {
    try {
      const data = await adminGetExperience();
      setExperience(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadExperience();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      role: "",
      company: "",
      company_url: "",
      location: "Bengaluru, India",
      start_date: "2024",
      end_date: "",
      is_current: true,
      description: "",
      bullet_points: "",
      status: "published",
      order_index: experience.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Experience) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience record?")) return;
    try {
      await adminDeleteExperience(id);
      setExperience((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert("Failed: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        const updated = await adminUpdateExperience(editingItem.id, formData);
        setExperience((prev) => prev.map((e) => (e.id === editingItem.id ? updated : e)));
      } else {
        const created = await adminCreateExperience(formData);
        setExperience((prev) => [...prev, created]);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Work Experience CMS</h1>
          <p className="text-xs text-text-secondary font-mono mt-1">
            Chronological engineering roles, team milestones, and accomplishments
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface border-b border-border text-text-secondary font-mono uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Role & Company</th>
              <th className="py-3 px-4">Timeline</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {experience.map((item) => (
              <tr key={item.id} className="hover:bg-surface-card-hover transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-foreground">{item.role}</div>
                  <div className="text-text-secondary font-mono text-[11px]">{item.company}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-text-tan">
                  {item.start_date} – {item.end_date || "Present"}
                  {item.is_current && (
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-btn-bg/20 text-text-tan border border-btn-bg/30 text-[10px] font-bold">
                      Current
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-text-secondary">{item.location || "Remote"}</td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
              {editingItem ? "Edit Experience Entry" : "Add Experience Entry"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. GenAI Engineer"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. AI Innovations Lab"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Company URL</label>
                  <input
                    type="url"
                    value={formData.company_url || ""}
                    onChange={(e) => setFormData({ ...formData, company_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bengaluru / Remote"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Start Date *</label>
                  <input
                    type="text"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    placeholder="e.g. 2024 or Jan 2024"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>
                <div>
                  <label className="block font-mono text-text-secondary mb-1">End Date</label>
                  <input
                    type="text"
                    value={formData.end_date || ""}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    placeholder="e.g. Present"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-text-secondary mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="High-level overview of role and impact..."
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                />
              </div>

              <div>
                <label className="block font-mono text-text-secondary mb-1">Bullet Points (one per line)</label>
                <textarea
                  rows={3}
                  value={formData.bullet_points || ""}
                  onChange={(e) => setFormData({ ...formData, bullet_points: e.target.value })}
                  placeholder="Architected LLM RAG pipelines serving 10k requests/min&#10;Reduced hallucination by 35% with fine-tuned embedding models"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_current"
                    checked={formData.is_current}
                    onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                    className="rounded bg-surface border-border text-btn-bg focus:ring-0"
                  />
                  <label htmlFor="is_current" className="font-mono text-foreground cursor-pointer">
                    Current Position
                  </label>
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
                  className="px-5 py-2 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs"
                >
                  {saving ? "Saving..." : editingItem ? "Save Changes" : "Create Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
