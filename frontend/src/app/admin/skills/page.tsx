"use client";

import { useEffect, useState } from "react";
import { Skill, SkillTier, ContentStatus } from "@/types";
import { 
  adminGetSkills, adminCreateSkill, 
  adminUpdateSkill, adminDeleteSkill 
} from "@/lib/api";
import StatusBadge from "@/components/admin/StatusBadge";
import { Plus, Edit, Trash2, Cpu, Star, X, Sparkles, Filter, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [activeTierFilter, setActiveTierFilter] = useState<"All" | "Core" | "Proficient" | "Exploring">("All");

  const [formData, setFormData] = useState<Partial<Skill>>({
    name: "",
    category: "AI & Machine Learning",
    tier: "Core",
    proficiency: 90,
    is_highlighted: false,
    status: "published",
    order_index: 0,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await adminGetSkills();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      category: "AI & Machine Learning",
      tier: activeTierFilter !== "All" ? activeTierFilter : "Core",
      proficiency: 90,
      is_highlighted: false,
      status: "published",
      order_index: skills.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({ ...skill });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await adminDeleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert("Failed: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSkill) {
        const updated = await adminUpdateSkill(editingSkill.id, formData);
        setSkills((prev) => prev.map((s) => (s.id === editingSkill.id ? updated : s)));
      } else {
        const created = await adminCreateSkill(formData);
        setSkills((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredSkills = skills.filter((s) => {
    if (activeTierFilter === "All") return true;
    return (s.tier || "Core").toLowerCase() === activeTierFilter.toLowerCase();
  });

  const coreCount = skills.filter((s) => (s.tier || "Core").toLowerCase() === "core").length;
  const proficientCount = skills.filter((s) => (s.tier || "").toLowerCase() === "proficient").length;
  const exploringCount = skills.filter((s) => (s.tier || "").toLowerCase() === "exploring").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-foreground">Tech Stack & Radar CMS</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-mono text-[11px] font-bold border border-emerald-500/25">
              Idea 6: Radar Tiers
            </span>
          </div>
          <p className="text-xs text-text-secondary font-mono mt-1">
            Curate your 🟢 Core, 🟡 Proficient, and 🔵 Exploring competencies
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#skills"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-text-tan" />
            <span>View Public Radar</span>
          </Link>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Technology</span>
          </button>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 rounded-2xl bg-surface border border-border w-fit">
        <button
          onClick={() => setActiveTierFilter("All")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTierFilter === "All"
              ? "bg-surface-card text-foreground shadow-sm border border-border"
              : "text-text-secondary hover:text-foreground"
          }`}
        >
          <span>All Stack</span>
          <span className="px-2 py-0.2 rounded-full bg-surface border border-border text-[10px]">
            {skills.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTierFilter("Core")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTierFilter === "Core"
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              : "text-text-secondary hover:text-foreground"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Core</span>
          <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-[10px]">
            {coreCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTierFilter("Proficient")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTierFilter === "Proficient"
              ? "bg-[#D4B07C]/15 text-[#8C6D42] dark:text-[#D4B07C] border border-[#D4B07C]/30"
              : "text-text-secondary hover:text-foreground"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#D4B07C]" />
          <span>Proficient</span>
          <span className="px-2 py-0.2 rounded-full bg-[#D4B07C]/20 text-[10px]">
            {proficientCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTierFilter("Exploring")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTierFilter === "Exploring"
              ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30"
              : "text-text-secondary hover:text-foreground"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span>Exploring</span>
          <span className="px-2 py-0.2 rounded-full bg-sky-500/20 text-[10px]">
            {exploringCount}
          </span>
        </button>
      </div>

      {/* Skills Table */}
      <div className="glass-panel rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface border-b border-border text-text-secondary font-mono uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Technology</th>
              <th className="py-3 px-4">Tier / Ring</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Proficiency</th>
              <th className="py-3 px-4">Highlight</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-text-secondary font-mono">
                  Loading skills...
                </td>
              </tr>
            ) : filteredSkills.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-text-secondary">
                  No technologies found in this tier. Click &quot;Add Technology&quot; to add one.
                </td>
              </tr>
            ) : (
              filteredSkills.map((skill) => {
                const tier = skill.tier || "Core";
                return (
                  <tr key={skill.id} className="hover:bg-surface-card-hover transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-text-tan flex-shrink-0" />
                        <span>{skill.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          tier.toLowerCase() === "core"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : tier.toLowerCase() === "proficient"
                            ? "bg-[#D4B07C]/15 text-[#8C6D42] dark:text-[#D4B07C] border border-[#D4B07C]/30"
                            : "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            tier.toLowerCase() === "core"
                              ? "bg-emerald-500"
                              : tier.toLowerCase() === "proficient"
                              ? "bg-[#D4B07C]"
                              : "bg-sky-400"
                          }`}
                        />
                        <span>{tier}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-text-secondary">
                      {skill.category}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-text-tan">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-surface overflow-hidden border border-border">
                          <div
                            className="h-full rounded-full"
                            style={{ 
                              width: `${skill.proficiency}%`,
                              backgroundColor: tier.toLowerCase() === "core" ? "#10B981" : tier.toLowerCase() === "proficient" ? "#D4B07C" : "#38BDF8"
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-bold">{skill.proficiency}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {skill.is_highlighted ? (
                        <span className="text-text-tan font-mono text-[11px] flex items-center gap-1 font-semibold">
                          <Star className="w-3 h-3 fill-current" /> Starred
                        </span>
                      ) : (
                        <span className="text-text-secondary font-mono text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={skill.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="p-1.5 rounded-lg bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground"
                          title="Edit Technology"
                        >
                          <Edit className="w-3.5 h-3.5 text-text-tan" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
                          title="Delete Technology"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-surface-card border border-border rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-surface text-text-secondary hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">
              {editingSkill ? `Edit Technology: ${editingSkill.name}` : "Add New Technology"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-text-secondary mb-1">Technology Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. PyTorch, Next.js, LangChain"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Radar Tier *</label>
                  <select
                    value={formData.tier || "Core"}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as SkillTier })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  >
                    <option value="Core">🟢 Core (Extensive)</option>
                    <option value="Proficient">🟡 Proficient (Applied)</option>
                    <option value="Exploring">🔵 Exploring (Emerging)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-text-secondary mb-1">Category Domain *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  >
                    <optgroup label="Radar Quadrants">
                      <option value="Languages">Languages (Top-Left Quadrant)</option>
                      <option value="AI & Machine Learning">AI & Machine Learning (Top-Right Quadrant)</option>
                      <option value="Web & Frameworks">Web & Frameworks (Bottom-Left Quadrant)</option>
                      <option value="Infrastructure & Tools">Infrastructure & Tools (Bottom-Right Quadrant)</option>
                    </optgroup>
                    <optgroup label="Other Categories">
                      <option value="Backend & APIs">Backend & APIs</option>
                      <option value="Databases & Storage">Databases & Storage</option>
                      <option value="Tools & DevOps">Tools & DevOps</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between font-mono text-text-secondary mb-1">
                  <span>Proficiency Rating</span>
                  <span className="font-bold text-foreground">{formData.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                  className="w-full accent-btn-bg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-text-secondary mb-1">Publishing Status</label>
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
                  <label className="block font-mono text-text-secondary mb-1">Order Index</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_highlighted"
                  checked={formData.is_highlighted}
                  onChange={(e) => setFormData({ ...formData, is_highlighted: e.target.checked })}
                  className="rounded bg-surface border-border text-btn-bg focus:ring-0"
                />
                <label htmlFor="is_highlighted" className="font-mono text-foreground cursor-pointer">
                  Star as Top Competency (Featured Badge)
                </label>
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
                  {saving ? "Saving..." : editingSkill ? "Save Changes" : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
