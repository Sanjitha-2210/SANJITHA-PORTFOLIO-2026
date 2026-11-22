"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/types";
import { adminGetProfile, adminUpdateProfile } from "@/lib/api";
import MediaUploader from "@/components/admin/MediaUploader";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminProfilePage() {
  const [formData, setFormData] = useState<Partial<Profile>>({
    full_name: "",
    title: "",
    bio: "",
    location: "",
    email: "",
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
    avatar_url: "",
    resume_url: "",
    open_to_work: true,
    degree: "",
    university: "",
    gpa: "",
    graduation_year: "",
    leetcode: "",
    codechef: "",
    codeforces: "",
    about_markdown: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetProfile()
      .then((data) => setFormData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const updated = await adminUpdateProfile(formData);
      setFormData(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-extrabold text-foreground">Profile & Identity CMS</h1>
        <p className="text-xs text-text-secondary font-mono mt-1">
          Update public biography, job availability status, and social destinations
        </p>
      </div>

      {success && (
        <div 
          className="p-3.5 rounded-xl border text-xs flex items-center gap-2"
          style={{ backgroundColor: "var(--tag-bg)", borderColor: "var(--tag-border)", color: "var(--foreground)" }}
        >
          <CheckCircle2 className="w-4 h-4 text-text-tan" />
          <span>Profile configuration saved and updated across public templates!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-border space-y-5 text-xs shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-text-secondary mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.full_name || ""}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
          <div>
            <label className="block font-mono text-text-secondary mb-1">Professional Title *</label>
            <input
              type="text"
              required
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-text-secondary mb-1">Public Bio (Headline Paragraph)</label>
          <textarea
            rows={3}
            value={formData.bio || ""}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-text-secondary mb-1">Location</label>
            <input
              type="text"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Bengaluru, India"
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
          <div>
            <label className="block font-mono text-text-secondary mb-1">Direct Contact Email</label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-mono text-text-secondary mb-1">GitHub URL</label>
            <input
              type="url"
              value={formData.github || ""}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
          <div>
            <label className="block font-mono text-text-secondary mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedin || ""}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
          <div>
            <label className="block font-mono text-text-secondary mb-1">Twitter / X URL</label>
            <input
              type="url"
              value={formData.twitter || ""}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-text-secondary mb-1">Personal Website URL</label>
            <input
              type="url"
              value={formData.website || ""}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
          <div>
            <label className="block font-mono text-text-secondary mb-1">Resume Download Link (PDF / Cloudinary URL)</label>
            <input
              type="url"
              value={formData.resume_url || ""}
              onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-text-secondary mb-1">Degree / Academic Program</label>
            <input
              type="text"
              value={formData.degree || ""}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              placeholder="e.g. B.E. Computer Science & Engineering (AI & ML)"
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
          <div>
            <label className="block font-mono text-text-secondary mb-1">University / Institution</label>
            <input
              type="text"
              value={formData.university || ""}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              placeholder="e.g. Department of Computer Science & Engineering"
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-mono text-text-secondary mb-1">LeetCode URL</label>
            <input
              type="url"
              value={formData.leetcode || ""}
              onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
              placeholder="https://leetcode.com/username"
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
          <div>
            <label className="block font-mono text-text-secondary mb-1">CodeChef URL</label>
            <input
              type="url"
              value={formData.codechef || ""}
              onChange={(e) => setFormData({ ...formData, codechef: e.target.value })}
              placeholder="https://codechef.com/users/username"
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
          <div>
            <label className="block font-mono text-text-secondary mb-1">CGPA / Performance</label>
            <input
              type="text"
              value={formData.gpa || ""}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              placeholder="e.g. 9.24 / 10.0"
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-text-tan"
            />
          </div>
        </div>

        {/* Media Uploader for Avatar */}
        <MediaUploader
          label="Avatar Photo (Cloudinary / Local)"
          currentUrl={formData.avatar_url}
          onUploadSuccess={(url) => setFormData({ ...formData, avatar_url: url })}
        />

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="open_to_work"
            checked={formData.open_to_work ?? true}
            onChange={(e) => setFormData({ ...formData, open_to_work: e.target.checked })}
            className="rounded bg-surface border-border text-btn-bg focus:ring-0"
          />
          <label htmlFor="open_to_work" className="font-mono text-foreground cursor-pointer">
            Display &quot;Available for high-impact roles&quot; badge
          </label>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-end">
          <button
            type="submit"
            disabled={saving || loading}
            className="px-6 py-2.5 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs shadow-sm"
          >
            {saving ? "Saving Changes..." : "Save Profile Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}
