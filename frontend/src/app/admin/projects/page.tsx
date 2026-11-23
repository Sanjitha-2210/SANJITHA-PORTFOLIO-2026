"use client";

import { useEffect, useState } from "react";
import { Project, ContentStatus } from "@/types";
import { 
  adminGetProjects, adminCreateProject, 
  adminUpdateProject, adminDeleteProject 
} from "@/lib/api";
import StatusBadge from "@/components/admin/StatusBadge";
import MediaUploader from "@/components/admin/MediaUploader";
import ProjectFolderCard from "@/components/public/ProjectFolderCard";
import ProjectCaseStudyModal from "@/components/public/ProjectCaseStudyModal";
import { 
  parseDescriptionIntoSections, 
  assembleSectionsIntoDescription, 
  ProjectSections,
  ArchitectureNode,
  ChallengeItem
} from "@/lib/projectCaseStudy";
import { 
  Plus, Edit, Trash2, Search, X, AlertCircle, Sparkles, 
  Eye, ExternalLink, LayoutGrid, List, Star, 
  AlertTriangle, Lightbulb, CheckCircle2, Boxes, FileCode, Flame, TrendingUp, Compass, ImageIcon, Video,
  Calendar, Briefcase, Users
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "folders">("table");

  // Case Study Live Preview in Admin
  const [activePreviewProject, setActivePreviewProject] = useState<Project | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showLivePreviewInModal, setShowLivePreviewInModal] = useState(false);

  // General Form Data
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    slug: "",
    summary: "",
    category: "Full-Stack",
    tags: "",
    featured_image: "",
    demo_url: "",
    github_url: "",
    video_url: "",
    is_featured: false,
    status: "published",
    order_index: 0,
  });

  // Separate Section Boxes requested by user
  const [caseSections, setCaseSections] = useState<ProjectSections>({
    year: "2025",
    projectType: "Internship Project",
    teamRole: "Team",
    problem: "",
    solution: "",
    features: "",
    architecture: "",
    architectureImage: "",
    architecturePhases: [],
    contributions: "",
    challenges: "",
    outcomes: "",
    futureScope: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminGetProjects();
      setProjects(data || []);
    } catch (err: any) {
      console.error("Failed to load projects in admin:", err);
      setLoadError(err.message || "Failed to load projects from backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAddPhase = () => {
    const currentPhases = caseSections.architecturePhases || [];
    const nextStepNum = String(currentPhases.length + 1).padStart(2, "0");
    setCaseSections({
      ...caseSections,
      architecturePhases: [
        ...currentPhases,
        {
          step: nextStepNum,
          name: "",
          role: "",
          tech: "",
        },
      ],
    });
  };

  const handleUpdatePhase = (index: number, field: keyof ArchitectureNode, value: string) => {
    const currentPhases = [...(caseSections.architecturePhases || [])];
    if (currentPhases[index]) {
      currentPhases[index] = { ...currentPhases[index], [field]: value };
      setCaseSections({ ...caseSections, architecturePhases: currentPhases });
    }
  };

  const handleRemovePhase = (index: number) => {
    const currentPhases = (caseSections.architecturePhases || []).filter((_, i) => i !== index);
    const renumbered = currentPhases.map((p, i) => ({
      ...p,
      step: String(i + 1).padStart(2, "0"),
    }));
    setCaseSections({ ...caseSections, architecturePhases: renumbered });
  };

  const handleResetDefaultPhases = () => {
    setCaseSections({
      ...caseSections,
      architecturePhases: [
        { step: "01", name: "Client & Edge Ingress", role: "Interface & WebSocket Stream", tech: "Next.js / WebGL / REST" },
        { step: "02", name: "API Gateway & Router", role: "Authentication & Rate Limiting", tech: "FastAPI / Reverse Proxy" },
        { step: "03", name: "Execution / Model Engine", role: "Workload Processing & Inference", tech: formData.tags?.split(",")[0]?.trim() || "Python Core" },
        { step: "04", name: "Persistence & Cache", role: "ACID Storage & Memory Cache", tech: "PostgreSQL / Redis / SQLite" },
        { step: "05", name: "Telemetry & Observer", role: "Monitoring, Health & Auditing", tech: "Structured Logging / Metrics" },
      ],
    });
  };

  const handleClearAllPhases = () => {
    setCaseSections({
      ...caseSections,
      architecturePhases: [],
    });
  };

  const handleAddChallenge = () => {
    const currentChallenges = caseSections.challengeItems || [];
    setCaseSections({
      ...caseSections,
      challengeItems: [
        ...currentChallenges,
        {
          title: `Challenge ${currentChallenges.length + 1}`,
          obstacle: "",
          resolution: "",
        },
      ],
    });
  };

  const handleUpdateChallenge = (index: number, field: keyof ChallengeItem, value: string) => {
    const currentChallenges = [...(caseSections.challengeItems || [])];
    if (currentChallenges[index]) {
      currentChallenges[index] = { ...currentChallenges[index], [field]: value };
      setCaseSections({ ...caseSections, challengeItems: currentChallenges });
    }
  };

  const handleRemoveChallenge = (index: number) => {
    const currentChallenges = (caseSections.challengeItems || []).filter((_, i) => i !== index);
    setCaseSections({ ...caseSections, challengeItems: currentChallenges });
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      summary: "",
      category: "Generative AI",
      tags: "FastAPI,Next.js,LangChain,PyTorch",
      featured_image: "",
      demo_url: "",
      github_url: "",
      video_url: "",
      is_featured: false,
      status: "published",
      order_index: projects.length,
    });

    setCaseSections({
      year: "2025",
      projectType: "Internship Project",
      teamRole: "Team",
      problem: "Traditional systems suffer from excessive latency bottlenecks, high operational compute expenses, and fragmented developer tooling during traffic surges.",
      solution: "Engineered an autonomous architecture utilizing low-overhead streaming pipelines, predictive machine learning models, and modular isolation.",
      features: "- Real-Time Stream Ingestion: Ingests telemetry metrics with sub-50ms latency.\n- Predictive Resource Autoscaling: Pre-allocates spot instances based on forecast models.\n- Zero-Downtime Canary Rollouts: Automated circuit breaking and progressive traffic shifting.\n- Modular Service Mesh: Decoupled service layers allowing independent horizontal scaling.",
      architecture: "Client traffic passes through a secure reverse proxy gateway, dispatched to stateless microservices, and persisted across a distributed storage cluster with real-time WebSocket state broadcasting.",
      architectureImage: "",
      architecturePhases: [
        { step: "01", name: "Client & Edge Ingress", role: "Interface & WebSocket Stream", tech: "Next.js / WebGL / REST" },
        { step: "02", name: "API Gateway & Router", role: "Authentication & Rate Limiting", tech: "FastAPI / Reverse Proxy" },
        { step: "03", name: "Execution / Model Engine", role: "Workload Processing & Inference", tech: "Python / PyTorch" },
        { step: "04", name: "Persistence & Cache", role: "ACID Storage & Memory Cache", tech: "PostgreSQL / Redis / SQLite" },
        { step: "05", name: "Telemetry & Observer", role: "Monitoring, Health & Auditing", tech: "Structured Logging / Metrics" },
      ],
      contributions: "- Designed and authored the core backend services and asynchronous workers.\n- Engineered high-throughput database indexing strategies, reducing query latency by 45%.\n- Implemented comprehensive automated test pipelines and CI/CD workflows.",
      challenges: "",
      challengeItems: [
        {
          title: "Advanced Full-Text Search",
          obstacle: "Traditional database search was insufficient for advanced search requirements and relevance-based ranking.",
          resolution: "Integrated Elasticsearch with indexing, filters, and relevance scoring for efficient content discovery."
        },
        {
          title: "Background Task Processing",
          obstacle: "Operations such as email delivery, analytics, and search indexing could increase API response times.",
          resolution: "Implemented Celery workers with Redis to execute time-consuming operations asynchronously."
        }
      ],
      outcomes: "- Slashed production cloud infrastructure expenditures by 42%.\n- Maintained 99.99% service uptime during synthetic 10x traffic spikes.",
      futureScope: "- Multi-cloud federation across AWS, GCP, and bare-metal nodes.\n- AI-driven predictive anomaly detection and auto-remediation.",
    });

    setError(null);
    setShowLivePreviewInModal(false);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({ ...project });

    // Parse the project's existing description into the separate boxes
    const parsed = parseDescriptionIntoSections(project.description || "");
    setCaseSections({
      ...parsed,
      year: parsed.year || (project.created_at ? new Date(project.created_at).getFullYear().toString() : "2025"),
      projectType: parsed.projectType || `${project.category} System`,
      teamRole: parsed.teamRole || "Team",
      architecturePhases: parsed.architecturePhases || [],
      challengeItems: parsed.challengeItems || [],
      futureScope: parsed.futureScope || "",
    });

    setError(null);
    setShowLivePreviewInModal(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await adminDeleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  const handleStatusQuickToggle = async (project: Project, newStatus: ContentStatus) => {
    try {
      const updated = await adminUpdateProject(project.id, { status: newStatus });
      setProjects(projects.map((p) => (p.id === project.id ? updated : p)));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const updated = await adminUpdateProject(project.id, { is_featured: !project.is_featured });
      setProjects(projects.map((p) => (p.id === project.id ? updated : p)));
    } catch (err) {
      alert("Failed to toggle featured status");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Assemble all separate boxes into unified markdown description
    const assembledDescription = assembleSectionsIntoDescription(caseSections);

    const payload: Partial<Project> = {
      ...formData,
      description: assembledDescription,
    };

    try {
      if (editingProject) {
        const updated = await adminUpdateProject(editingProject.id, payload);
        setProjects(projects.map((p) => (p.id === editingProject.id ? updated : p)));
      } else {
        const created = await adminCreateProject(payload);
        setProjects([created, ...projects]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  // Filtered list with defensive null checks
  const filteredProjects = (projects || []).filter((p) => {
    if (!p) return false;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const q = (searchQuery || "").toLowerCase().trim();
    const matchesSearch =
      !q ||
      Boolean(p.title && p.title.toLowerCase().includes(q)) ||
      Boolean(p.summary && p.summary.toLowerCase().includes(q)) ||
      Boolean(p.tags && p.tags.toLowerCase().includes(q)) ||
      Boolean(p.category && p.category.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  // Mock project object for live preview in the edit/create modal
  const livePreviewProject: Project = {
    id: editingProject?.id || 999,
    title: formData.title || "Project Title Preview",
    slug: formData.slug || "project-preview",
    summary: formData.summary || "One-to-two sentence architectural overview of this project.",
    description: assembleSectionsIntoDescription(caseSections),
    category: formData.category || "Full-Stack",
    tags: formData.tags || "FastAPI, Next.js, TypeScript",
    featured_image: formData.featured_image || "",
    demo_url: formData.demo_url || "",
    github_url: formData.github_url || "",
    video_url: formData.video_url || "",
    is_featured: formData.is_featured ?? false,
    status: (formData.status as ContentStatus) || "published",
    order_index: formData.order_index ?? 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Project Showcase CMS</h1>
          <p className="text-xs text-text-secondary font-mono mt-1">
            Manage folder cards, architecture image uploads, and individual case study sections
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="p-1 rounded-xl bg-surface border border-border flex items-center gap-1 shadow-sm">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                viewMode === "table"
                  ? "bg-surface-card border border-border text-foreground font-bold shadow-sm"
                  : "text-text-secondary hover:text-foreground"
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode("folders")}
              className={`p-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                viewMode === "folders"
                  ? "bg-surface-card border border-border text-foreground font-bold shadow-sm"
                  : "text-text-secondary hover:text-foreground"
              }`}
              title="Folder Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Folder Cards</span>
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2">
          {["all", "published", "draft", "archived"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? "bg-btn-bg text-btn-text shadow-sm"
                  : "bg-surface-card hover:bg-surface-card-hover border border-border text-text-secondary hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-card border border-border text-xs text-foreground placeholder-text-secondary focus:outline-none focus:border-text-tan shadow-sm"
          />
        </div>
      </div>

      {/* Error / Connection Notice */}
      {loadError && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{loadError} Ensure the backend server is running on port 8000.</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={loadProjects}
              className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-card border border-border text-foreground transition-all font-mono font-semibold"
            >
              Retry
            </button>
            <a
              href="/admin/login"
              className="px-3 py-1.5 rounded-lg bg-btn-bg text-btn-text hover:bg-btn-hover transition-all font-mono font-semibold"
            >
              Sign In Again
            </a>
          </div>
        </div>
      )}

      {/* VIEW 1: TABLE VIEW */}
      {viewMode === "table" ? (
        <div className="glass-panel rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-border text-text-secondary font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Quick Publish</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-text-secondary">
                      No projects found for current criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-surface-card-hover transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {project.featured_image ? (
                            <img
                              src={project.featured_image}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-surface border border-border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary font-mono text-[10px]">
                              N/A
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-foreground flex items-center gap-2">
                              <span>{project.title}</span>
                              <button
                                onClick={() => handleToggleFeatured(project)}
                                title={project.is_featured ? "Featured Project" : "Click to Feature"}
                                className={`p-0.5 rounded transition-colors ${
                                  project.is_featured
                                    ? "text-text-tan"
                                    : "text-text-secondary/40 hover:text-text-tan"
                                }`}
                              >
                                <Star className={`w-3.5 h-3.5 ${project.is_featured ? "fill-text-tan" : ""}`} />
                              </button>
                            </div>
                            <div className="text-[11px] text-text-secondary font-mono line-clamp-1">
                              /{project.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-text-secondary">
                        {project.category}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={project.status} />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStatusQuickToggle(project, "published")}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                              project.status === "published"
                                ? "bg-btn-bg/20 text-text-tan border border-btn-bg/40 font-bold"
                                : "text-text-secondary hover:text-text-tan"
                            }`}
                          >
                            Pub
                          </button>
                          <button
                            onClick={() => handleStatusQuickToggle(project, "draft")}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                              project.status === "draft"
                                ? "bg-btn-bg/20 text-text-tan border border-btn-bg/40 font-bold"
                                : "text-text-secondary hover:text-text-tan"
                            }`}
                          >
                            Draft
                          </button>
                          <button
                            onClick={() => handleStatusQuickToggle(project, "archived")}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                              project.status === "archived"
                                ? "bg-surface text-foreground border border-border"
                                : "text-text-secondary hover:text-foreground"
                            }`}
                          >
                            Arch
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Case Study Preview */}
                          <button
                            onClick={() => setActivePreviewProject(project)}
                            className="p-1.5 rounded-lg bg-surface-card hover:bg-surface-card-hover border border-border text-text-secondary hover:text-text-tan shadow-sm"
                            title="Preview 11-Stage Case Study"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Public URL Link */}
                          <a
                            href={`/projects/${project.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-surface-card hover:bg-surface-card-hover border border-border text-text-secondary hover:text-foreground shadow-sm"
                            title="Open Public Case Study Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => openEditModal(project)}
                            className="p-1.5 rounded-lg bg-surface-card hover:bg-surface-card-hover border border-border text-text-secondary hover:text-foreground shadow-sm"
                            title="Edit Project"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-400"
                            title="Delete Project"
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
        </div>
      ) : (
        /* VIEW 2: LIVE FOLDER CARDS SHOWCASE VIEW */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-text-secondary">
            <span>Displaying {filteredProjects.length} Folder Cards as rendered on public website</span>
            <span>Click any card to launch its 11-Stage Case Study</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pt-4">
            {filteredProjects.map((project, idx) => (
              <div key={project.id} className="relative group/admin-card">
                <ProjectFolderCard
                  project={project}
                  index={idx}
                  onOpenDetails={setActivePreviewProject}
                />

                {/* Admin Quick Action Floating Bar above the folder card */}
                <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-surface/90 backdrop-blur-md p-1.5 rounded-xl border border-border shadow-md opacity-0 group-hover/admin-card:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(project);
                    }}
                    className="p-1.5 rounded-lg bg-surface hover:bg-surface-card border border-border text-text-secondary hover:text-foreground"
                    title="Edit Specifications"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
                    }}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Case Study Modal Preview in Admin */}
      {activePreviewProject && (
        <ProjectCaseStudyModal
          project={activePreviewProject}
          onClose={() => setActivePreviewProject(null)}
        />
      )}

      {/* CREATE / EDIT MODAL WITH SEPARATE BOXES FOR EVERY SECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-surface-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl relative custom-scrollbar">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-surface border border-border text-text-secondary hover:text-foreground transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between gap-4 mb-6 pr-10">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {editingProject ? "Edit Project Specifications" : "Create New Project Entry"}
                </h2>
                <p className="text-xs text-text-secondary font-mono mt-0.5">
                  Separate input boxes for Problem, Solution, Features, Architecture, Contributions, Challenges & Outcomes
                </p>
              </div>

              {/* Live Preview Toggle Button */}
              <button
                type="button"
                onClick={() => setShowLivePreviewInModal(!showLivePreviewInModal)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
                  showLivePreviewInModal
                    ? "bg-btn-bg text-btn-text border-text-tan shadow-sm"
                    : "bg-surface border-border text-text-secondary hover:text-foreground"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showLivePreviewInModal ? "Hide Preview" : "Live Folder Preview"}</span>
              </button>
            </div>

            {/* Embedded Live Folder Preview if toggled */}
            {showLivePreviewInModal && (
              <div className="mb-6 p-6 rounded-2xl bg-surface border border-border space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-text-tan">
                  <span>Live Folder Card Preview:</span>
                  <span className="opacity-70">Synchronized with separate section inputs</span>
                </div>
                <div className="max-w-sm mx-auto pt-4">
                  <ProjectFolderCard
                    project={livePreviewProject}
                    index={formData.order_index ?? 0}
                    onOpenDetails={() => {}}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs mb-6 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6 text-xs">
              {/* SECTION GROUP 1: CORE SPECIFICATIONS */}
              <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-text-tan" />
                  <span>1. Core Specifications & Folder Front Tab</span>
                </h3>

                <div>
                  <label className="block font-mono text-text-secondary mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., CampusSync: BLE Geofenced Attendance System"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border text-foreground focus:outline-none focus:border-text-tan shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-text-secondary mb-1">Slug (URL Parameter)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="campussync-ble-attendance"
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border text-foreground focus:outline-none focus:border-text-tan font-mono shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-text-secondary mb-1">Category (Folder Tab)</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Full-Stack / Distributed Systems / AI"
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border text-foreground focus:outline-none focus:border-text-tan shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-text-secondary mb-1">Tech Stack Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="BLE, React Native, FastAPI, PostgreSQL, Docker"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border text-foreground focus:outline-none focus:border-text-tan font-mono shadow-sm"
                  />
                </div>

                {/* Cover Media: Uploads to Cloudinary */}
                <MediaUploader
                  label="Folder Inset Cover Media (Cloudinary CDN / Local Storage)"
                  currentUrl={formData.featured_image}
                  onUploadSuccess={(url) => setFormData({ ...formData, featured_image: url })}
                />

                {/* PROJECT CASE STUDY META PILLS (Year, Project Context, Team Role) */}
                <div className="p-4 rounded-xl bg-surface-card border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-xs flex items-center gap-2">
                      <span className="w-1.5 h-3.5 rounded-full bg-text-tan" />
                      <span>Project Header Badges (Case Study Hero Metadata)</span>
                    </span>
                    <span className="text-[10px] font-mono text-text-tan opacity-80">
                      e.g. 2025 • Internship Project • Team
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-text-tan" />
                        <span>Timeline / Year</span>
                      </label>
                      <input
                        type="text"
                        value={caseSections.year || ""}
                        onChange={(e) => setCaseSections({ ...caseSections, year: e.target.value })}
                        placeholder="2025"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:outline-none focus:border-text-tan shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1 flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 text-text-tan" />
                        <span>Project Context / Type</span>
                      </label>
                      <input
                        type="text"
                        value={caseSections.projectType || ""}
                        onChange={(e) => setCaseSections({ ...caseSections, projectType: e.target.value })}
                        placeholder="Internship Project"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:outline-none focus:border-text-tan shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1 flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-text-tan" />
                        <span>Team / Collaboration</span>
                      </label>
                      <input
                        type="text"
                        value={caseSections.teamRole || ""}
                        onChange={(e) => setCaseSections({ ...caseSections, teamRole: e.target.value })}
                        placeholder="Team"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:outline-none focus:border-text-tan shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-text-secondary mb-1">Summary (Short Overview on Folder & Header) *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="One-to-two sentence architectural overview displayed on folder cards and overview section..."
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border text-foreground focus:outline-none focus:border-text-tan shadow-sm"
                  />
                </div>
              </div>

              {/* SECTION GROUP 2: INDIVIDUAL CASE STUDY SECTIONS (SEPARATE BOXES) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>2. Individual Case Study Sections (Separate Input Boxes)</span>
                  </h3>
                  <span className="text-[11px] font-mono text-text-tan">
                    Automatically connected to Cloud & Public Showcase
                  </span>
                </div>

                {/* BOX 1: PROBLEM */}
                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>+ Problem Statement Box</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Describe the core pain points, architectural bottlenecks, legacy limitations, and developer friction.
                  </p>
                  <textarea
                    rows={3}
                    value={caseSections.problem}
                    onChange={(e) => setCaseSections({ ...caseSections, problem: e.target.value })}
                    placeholder="e.g. Modern workloads experience severe scaling inefficiencies, high execution latency, and unpredictable resource costs under peak traffic..."
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-amber-500/30 text-foreground focus:outline-none focus:border-amber-500 shadow-sm leading-relaxed"
                  />
                </div>

                {/* BOX 2: SOLUTION */}
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs uppercase font-bold">
                    <Lightbulb className="w-4 h-4" />
                    <span>+ Architectural Solution Box</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Explain the core engineering breakthrough, algorithmic design, and architectural approach.
                  </p>
                  <textarea
                    rows={3}
                    value={caseSections.solution}
                    onChange={(e) => setCaseSections({ ...caseSections, solution: e.target.value })}
                    placeholder="e.g. Architected an end-to-end autonomous system featuring low-overhead streaming pipelines, predictive optimization, and modular isolation..."
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-emerald-500/30 text-foreground focus:outline-none focus:border-emerald-500 shadow-sm leading-relaxed"
                  />
                </div>

                {/* BOX 3: FEATURES */}
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-text-tan font-mono text-xs uppercase font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>+ Features & Capabilities Box</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Add bulleted capabilities (e.g. <code>- Feature Name: Short description of capability.</code>).
                  </p>
                  <textarea
                    rows={4}
                    value={caseSections.features}
                    onChange={(e) => setCaseSections({ ...caseSections, features: e.target.value })}
                    placeholder="- Real-Time Stream Ingestion: Ingests telemetry metrics with sub-50ms latency.&#10;- Predictive Resource Autoscaling: Pre-allocates spot instances based on forecast models.&#10;- Zero-Downtime Rollouts: Automated circuit breaking and canary deployments."
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border text-foreground focus:outline-none focus:border-text-tan shadow-sm font-mono leading-relaxed"
                  />
                </div>

                {/* BOX 4: ARCHITECTURE (TEXT + IMAGE UPLOADER + PIPELINE PHASES) */}
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-text-tan font-mono text-xs uppercase font-bold">
                      <Boxes className="w-4 h-4" />
                      <span>+ Architecture Box (Narrative + Diagram + Pipeline Phases)</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-tag-bg text-tag-text border border-tag-border">
                      Image &amp; Phases Enabled
                    </span>
                  </div>

                  <p className="text-[11px] text-text-secondary">
                    Describe the system topology, microservices interaction, and data lifecycle from client ingress to database.
                  </p>

                  <textarea
                    rows={3}
                    value={caseSections.architecture}
                    onChange={(e) => setCaseSections({ ...caseSections, architecture: e.target.value })}
                    placeholder="e.g. Telemetry metrics flow from edge daemons to an asynchronous Kafka pipeline, evaluated in real time by the inference scheduler..."
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border text-foreground focus:outline-none focus:border-text-tan shadow-sm leading-relaxed"
                  />

                  {/* Architecture Diagram Image Uploader */}
                  <div className="pt-2 border-t border-border">
                    <MediaUploader
                      label="Upload Architecture Specification Diagram (Cloudinary CDN / Local Storage)"
                      currentUrl={caseSections.architectureImage}
                      onUploadSuccess={(url) => setCaseSections({ ...caseSections, architectureImage: url })}
                    />
                    {caseSections.architectureImage && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-border bg-[#0b0f14] shadow-sm">
                        <div className="p-2.5 bg-surface border-b border-border flex items-center justify-between text-xs font-mono text-text-tan">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <ImageIcon className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate text-[11px]">{caseSections.architectureImage}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCaseSections({ ...caseSections, architectureImage: "" })}
                            className="text-[11px] text-red-500 hover:underline ml-2 flex-shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="p-2 flex items-center justify-center bg-[#0b0f14]">
                          <img
                            src={caseSections.architectureImage}
                            alt="Architecture Preview"
                            className="w-full h-auto max-h-56 object-contain rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ARCHITECTURE FLOW PIPELINE (PHASES) */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-foreground text-xs flex items-center gap-2">
                          <span className="w-1.5 h-4 rounded-full bg-text-tan" />
                          <span>Architecture Flow Pipeline (Phase 01, Phase 02, ...)</span>
                        </h4>
                        <p className="text-[10px] text-text-secondary mt-0.5">
                          Configure each phase (Title, Role/Subtitle, and Tech Stack) shown in the public case study timeline.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {caseSections.architecturePhases && caseSections.architecturePhases.length > 0 ? (
                          <button
                            type="button"
                            onClick={handleClearAllPhases}
                            className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[10px] font-mono text-red-400 hover:text-red-500 hover:bg-surface-card transition-all"
                          >
                            Clear Phases
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResetDefaultPhases}
                            className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[10px] font-mono text-text-tan hover:bg-surface-card transition-all"
                          >
                            Load 5 Default Phases
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleAddPhase}
                          className="px-2.5 py-1 rounded-lg bg-btn-bg text-btn-text text-[10px] font-bold font-mono hover:bg-btn-hover transition-all flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Phase</span>
                        </button>
                      </div>
                    </div>

                    {/* Phases List */}
                    {caseSections.architecturePhases && caseSections.architecturePhases.length > 0 ? (
                      <div className="space-y-2.5 pt-1">
                        {caseSections.architecturePhases.map((phase, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-surface-card border border-border/80 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 group"
                          >
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="px-2 py-1 rounded-md bg-surface border border-border text-[10px] font-mono font-bold text-text-tan">
                                Phase {phase.step || String(idx + 1).padStart(2, "0")}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 w-full">
                              <div>
                                <label className="block text-[9px] font-mono text-text-secondary uppercase mb-0.5">
                                  Phase Name
                                </label>
                                <input
                                  type="text"
                                  value={phase.name}
                                  onChange={(e) => handleUpdatePhase(idx, "name", e.target.value)}
                                  placeholder="e.g. Client & Edge Ingress"
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-foreground text-xs focus:outline-none focus:border-text-tan"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-mono text-text-secondary uppercase mb-0.5">
                                  Role / Subtitle
                                </label>
                                <input
                                  type="text"
                                  value={phase.role}
                                  onChange={(e) => handleUpdatePhase(idx, "role", e.target.value)}
                                  placeholder="e.g. Interface & WebSocket Stream"
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-foreground text-xs focus:outline-none focus:border-text-tan"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-mono text-text-secondary uppercase mb-0.5">
                                  Tech Stack
                                </label>
                                <input
                                  type="text"
                                  value={phase.tech}
                                  onChange={(e) => handleUpdatePhase(idx, "tech", e.target.value)}
                                  placeholder="e.g. Next.js / WebGL / REST"
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-text-tan"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemovePhase(idx)}
                              className="p-1.5 rounded-lg text-text-secondary hover:text-red-500 hover:bg-surface border border-transparent hover:border-red-500/20 transition-all flex-shrink-0"
                              title="Delete this phase"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-surface-card/60 border border-dashed border-border text-center text-text-secondary text-[11px]">
                        No pipeline phases configured. The public case study will only show your architecture diagram &amp; narrative.
                        <button
                          type="button"
                          onClick={handleResetDefaultPhases}
                          className="text-text-tan font-bold ml-1.5 hover:underline"
                        >
                          Click to load standard phases
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOX 5: CONTRIBUTIONS */}
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-text-tan font-mono text-xs uppercase font-bold">
                    <FileCode className="w-4 h-4" />
                    <span>+ My Contributions & Code Ownership Box</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Detail what you personally architected, built, optimized, benchmarked, and deployed.
                  </p>
                  <textarea
                    rows={3}
                    value={caseSections.contributions}
                    onChange={(e) => setCaseSections({ ...caseSections, contributions: e.target.value })}
                    placeholder="- Designed and authored the core backend services and asynchronous workers.&#10;- Engineered high-throughput database indexing strategies, reducing query latency by 45%.&#10;- Authored test suites achieving 94% coverage."
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border text-foreground focus:outline-none focus:border-text-tan shadow-sm font-mono leading-relaxed"
                  />
                </div>

                {/* BOX 6: CHALLENGES */}
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase font-bold">
                      <Flame className="w-4 h-4" />
                      <span>Technical Challenges & Trade-Offs</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold">
                        {(caseSections.challengeItems || []).length} Challenges
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddChallenge}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Challenge</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-text-secondary">
                    Add discrete engineering challenges with the obstacle encountered and the technical resolution implemented.
                  </p>

                  <div className="space-y-3">
                    {(caseSections.challengeItems || []).map((challenge, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-surface-card border border-border shadow-sm space-y-3 relative group/challenge"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={challenge.title}
                              onChange={(e) => handleUpdateChallenge(idx, "title", e.target.value)}
                              placeholder="e.g. Advanced Full-Text Search"
                              className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-foreground font-bold text-xs focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveChallenge(idx)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-400 transition-colors"
                            title="Remove Challenge"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-text-secondary uppercase font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Problem / Obstacle
                            </label>
                            <textarea
                              rows={2}
                              value={challenge.obstacle}
                              onChange={(e) => handleUpdateChallenge(idx, "obstacle", e.target.value)}
                              placeholder="Describe the technical bottleneck, limitation, or constraint..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-foreground text-xs focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Solution / Resolution
                            </label>
                            <textarea
                              rows={2}
                              value={challenge.resolution}
                              onChange={(e) => handleUpdateChallenge(idx, "resolution", e.target.value)}
                              placeholder="Describe the architectural fix, tool, algorithm, or pattern used..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!caseSections.challengeItems || caseSections.challengeItems.length === 0) && (
                      <div className="p-4 rounded-xl border border-dashed border-border text-center space-y-2 bg-surface-card/50">
                        <p className="text-xs text-text-secondary">No challenges added yet.</p>
                        <button
                          type="button"
                          onClick={handleAddChallenge}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add First Challenge</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOX 7: MEASURABLE OUTCOMES / PRODUCTION IMPACT */}
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs uppercase font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>+ Measurable Outcomes & Production Impact Box</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Enter key quantifiable outcomes, metric improvements, performance benchmarks, and practical achievements (one item per line or paragraph).
                  </p>
                  <textarea
                    rows={4}
                    value={caseSections.outcomes}
                    onChange={(e) => setCaseSections({ ...caseSections, outcomes: e.target.value })}
                    placeholder="Developed a centralized platform for campus placement activities.&#10;Organized student, company, and recruitment information.&#10;Simplified job eligibility verification workflows."
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border text-foreground focus:outline-none focus:border-text-tan shadow-sm font-mono text-xs leading-relaxed"
                  />
                </div>

                {/* BOX 8: FUTURE SCOPE / ROADMAP & EXPANSION */}
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-text-tan font-mono text-xs uppercase font-bold">
                    <Compass className="w-4 h-4" />
                    <span>+ Future Scope & Roadmap Expansion Box</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Enter future roadmap milestones, expansion plans, and planned capabilities. Each line will automatically become an interactive bullet card in the public case study.
                  </p>
                  <textarea
                    rows={4}
                    value={caseSections.futureScope || ""}
                    onChange={(e) => setCaseSections({ ...caseSections, futureScope: e.target.value })}
                    placeholder="AI-powered job recommendations based on student profiles and skills.&#10;Automated resume parsing and candidate profiling.&#10;Intelligent placement analytics and predictive insights."
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border text-foreground focus:outline-none focus:border-text-tan shadow-sm font-mono text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* SECTION GROUP 3: DEMO VIDEO, REPOSITORIES & CONTROLS */}
              <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>3. Project Demo Video, GitHub Repository &amp; Publishing Status</span>
                </h3>

                {/* Dedicated Demo Video Upload Box */}
                <div className="p-4 rounded-xl bg-surface-card border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                      <Video className="w-4 h-4 text-emerald-500" />
                      <span>Project Demonstration Video (Cloudinary CDN Stream)</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-tag-bg text-tag-text border border-tag-border">
                      MP4, WebM, MOV, MKV
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Upload your project demo recording (.mp4, .webm, .mov). It will be securely stored in Cloudinary and streamed in full quality inside the public case study.
                  </p>

                  <MediaUploader
                    label="Upload Demo Video File"
                    mediaType="video"
                    currentUrl={formData.video_url || ""}
                    onUploadSuccess={(url) => setFormData({ ...formData, video_url: url })}
                  />

                  {formData.video_url && (
                    <div className="pt-2 border-t border-border space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-text-tan">
                        <span className="truncate max-w-md">{formData.video_url}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, video_url: "" })}
                          className="text-[11px] text-red-500 hover:underline flex-shrink-0 ml-2"
                        >
                          Remove Video
                        </button>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-border bg-black max-w-md">
                        <video
                          src={formData.video_url}
                          controls
                          playsInline
                          className="w-full max-h-48 object-contain bg-black"
                        />
                      </div>
                    </div>
                  )}

                  {/* Optional Direct Stream URL input */}
                  <div className="pt-1">
                    <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">
                      Or paste Cloudinary / Stream URL directly:
                    </label>
                    <input
                      type="url"
                      value={formData.video_url || ""}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://res.cloudinary.com/... or https://..."
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs focus:outline-none focus:border-text-tan shadow-sm"
                    />
                  </div>
                </div>

                {/* GitHub Repo URL */}
                <div>
                  <label className="block font-mono text-text-secondary mb-1">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={formData.github_url || ""}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 rounded-xl bg-surface-card border border-border text-foreground focus:outline-none focus:border-text-tan shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block font-mono text-text-secondary mb-1">Publishing Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-card border border-border text-foreground focus:outline-none focus:border-text-tan shadow-sm"
                    >
                      <option value="published">Published (Visible Publicly)</option>
                      <option value="draft">Draft (Hidden from Public)</option>
                      <option value="archived">Archived (Hidden from Public)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-text-secondary mb-1">Order Index (Display Position)</label>
                    <input
                      type="number"
                      value={formData.order_index ?? 0}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-card border border-border text-foreground focus:outline-none focus:border-text-tan shadow-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured ?? false}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded bg-surface border-border text-btn-bg focus:ring-0"
                    />
                    <label htmlFor="is_featured" className="font-mono text-foreground cursor-pointer flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-text-tan" />
                      <span>Feature on Showcase</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Action Footer */}
              <div className="pt-6 border-t border-border flex items-center justify-end gap-3">
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
                  className="px-6 py-2.5 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  {saving ? "Saving to Cloud..." : editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
