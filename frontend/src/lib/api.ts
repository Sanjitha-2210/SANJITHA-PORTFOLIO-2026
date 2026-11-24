import { 
  Profile, Project, Skill, Experience, Certification, Education, Milestone,
  Message, DashboardStats, User, AuthResponse 
} from "@/types";
import { getAuthToken, setAuthToken, removeAuthToken } from "./auth";

export const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const isLocalhost = 
      window.location.hostname === "localhost" || 
      window.location.hostname === "127.0.0.1";
    if (isLocalhost) {
      return "http://127.0.0.1:8000/api";
    }
    // When hosted on Vercel or any remote domain, connect to the production Render backend
    return "https://sanjitha-portfolio-api.onrender.com/api";
  }
  return "https://sanjitha-portfolio-api.onrender.com/api";
};

export const API_BASE_URL = getApiBaseUrl();

// Real-time synchronization notifier across tabs & components
export function notifyPortfolioUpdated() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("portfolio_sync_trigger", Date.now().toString());
      window.dispatchEvent(new CustomEvent("portfolio_updated", { detail: { timestamp: Date.now() } }));
      if ("BroadcastChannel" in window) {
        const channel = new BroadcastChannel("portfolio_sync_channel");
        channel.postMessage({ type: "PORTFOLIO_UPDATED", timestamp: Date.now() });
        channel.close();
      }
    } catch {
      // Ignore errors in environments where localStorage/BroadcastChannel may be restricted
    }
  }
}

// Helper for authorized headers
function getHeaders(isFormData = false): HeadersInit {
  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ---------------- PUBLIC API CALLS ----------------
export async function getPublicProfile(): Promise<Profile> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/public/profile?_t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch public profile");
  return res.json();
}

export async function getPublicProjects(params?: { category?: string; tag?: string; q?: string }): Promise<Project[]> {
  const base = getApiBaseUrl();
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.append("category", params.category);
  if (params?.tag) searchParams.append("tag", params.tag);
  if (params?.q) searchParams.append("q", params.q);
  searchParams.append("_t", Date.now().toString());

  const res = await fetch(`${base}/public/projects?${searchParams.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch public projects");
  return res.json();
}

export async function getPublicProjectBySlug(slug: string): Promise<Project> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/public/projects/${slug}?_t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Project not found");
  return res.json();
}

export async function getPublicSkills(category?: string): Promise<Skill[]> {
  const base = getApiBaseUrl();
  const url = category 
    ? `${base}/public/skills?category=${encodeURIComponent(category)}&_t=${Date.now()}` 
    : `${base}/public/skills?_t=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch public skills");
  return res.json();
}

export async function getPublicExperience(): Promise<Experience[]> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/public/experience?_t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch public experience");
  return res.json();
}

export async function getPublicCertifications(params?: { category?: string }): Promise<Certification[]> {
  const base = getApiBaseUrl();
  const searchParams = new URLSearchParams();
  if (params?.category && params.category !== "All") {
    searchParams.append("category", params.category);
  }
  searchParams.append("_t", Date.now().toString());
  const res = await fetch(`${base}/public/certifications?${searchParams.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch public certifications");
  return res.json();
}

export async function getPublicEducation(): Promise<Education[]> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/public/education?_t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch public education records");
  return res.json();
}

export async function getPublicMilestones(): Promise<Milestone[]> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/public/milestones?_t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch public milestones");
  return res.json();
}

export async function submitContactForm(data: { name: string; email: string; subject?: string; message: string }) {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/public/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit message");
  }
  return res.json();
}

// ---------------- ADMIN AUTH & DASHBOARD ----------------
export async function login(username: string, password: string): Promise<AuthResponse> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Invalid credentials");
  }
  return res.json();
}

export async function getCurrentUser(): Promise<User> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/auth/me`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/stats?_t=${Date.now()}`, {
    headers: getHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
}

// ---------------- ADMIN PROJECTS ----------------
export async function adminGetProjects(status?: string): Promise<Project[]> {
  const base = getApiBaseUrl();
  const url = status && status !== "all" 
    ? `${base}/admin/projects?status=${status}&_t=${Date.now()}` 
    : `${base}/admin/projects?_t=${Date.now()}`;
  
  try {
    const res = await fetch(url, { headers: getHeaders(), cache: "no-store" });
    if (res.status === 401) {
      console.warn("adminGetProjects returned 401. Checking public projects fallback...");
      const publicProjects = await getPublicProjects().catch(() => []);
      if (publicProjects && publicProjects.length > 0) {
        return publicProjects;
      }
      removeAuthToken();
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login?expired=true";
      }
      throw new Error("Session expired. Please log in again.");
    }
    if (!res.ok) {
      throw new Error("Failed to fetch admin projects");
    }
    return await res.json();
  } catch (err) {
    console.warn("adminGetProjects failed, using public projects fallback:", err);
    const fallback = await getPublicProjects().catch(() => []);
    if (fallback && fallback.length > 0) {
      return fallback;
    }
    throw err;
  }
}

export async function adminGetProject(id: number): Promise<Project> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/projects/${id}?_t=${Date.now()}`, { headers: getHeaders(), cache: "no-store" });
  if (!res.ok) throw new Error("Project not found");
  return res.json();
}

export async function adminCreateProject(data: Partial<Project>): Promise<Project> {
  const base = getApiBaseUrl();
  const { id, created_at, updated_at, ...cleanData } = data as any;
  const res = await fetch(`${base}/admin/projects`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(cleanData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    const detail = errData?.detail ? (typeof errData.detail === "string" ? errData.detail : JSON.stringify(errData.detail)) : null;
    throw new Error(detail || `Failed to create project (HTTP ${res.status})`);
  }
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

export async function adminUpdateProject(id: number, data: Partial<Project>): Promise<Project> {
  const base = getApiBaseUrl();
  const { id: _, created_at, updated_at, ...cleanData } = data as any;
  const res = await fetch(`${base}/admin/projects/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(cleanData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    const detail = errData?.detail ? (typeof errData.detail === "string" ? errData.detail : JSON.stringify(errData.detail)) : null;
    throw new Error(detail || `Failed to update project (HTTP ${res.status})`);
  }
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

export async function adminDeleteProject(id: number) {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/projects/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    const detail = errData?.detail ? (typeof errData.detail === "string" ? errData.detail : JSON.stringify(errData.detail)) : null;
    throw new Error(detail || `Failed to delete project (HTTP ${res.status})`);
  }
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

// ---------------- ADMIN SKILLS ----------------
export async function adminGetSkills(): Promise<Skill[]> {
  const base = getApiBaseUrl();
  const url = `${base}/admin/skills?_t=${Date.now()}`;
  try {
    const res = await fetch(url, { headers: getHeaders(), cache: "no-store" });
    if (res.status === 401 || res.status === 403) {
      console.warn("adminGetSkills returned auth error. Falling back to public skills...");
      const fallback = await getPublicSkills().catch(() => []);
      if (fallback && fallback.length > 0) return fallback;
    }
    if (!res.ok) throw new Error("Failed to fetch admin skills");
    return await res.json();
  } catch (err) {
    console.warn("adminGetSkills failed, using public fallback:", err);
    const fallback = await getPublicSkills().catch(() => []);
    if (fallback && fallback.length > 0) return fallback;
    throw err;
  }
}

export async function adminCreateSkill(data: Partial<Skill>): Promise<Skill> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/skills`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create skill");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

export async function adminUpdateSkill(id: number, data: Partial<Skill>): Promise<Skill> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/skills/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update skill");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

export async function adminDeleteSkill(id: number) {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/skills/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete skill");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

// ---------------- ADMIN EXPERIENCE ----------------
export async function adminGetExperience(): Promise<Experience[]> {
  const base = getApiBaseUrl();
  const url = `${base}/admin/experience?_t=${Date.now()}`;
  try {
    const res = await fetch(url, { headers: getHeaders(), cache: "no-store" });
    if (res.status === 401 || res.status === 403) {
      console.warn("adminGetExperience returned auth error. Falling back to public experience...");
      const fallback = await getPublicExperience().catch(() => []);
      if (fallback && fallback.length > 0) return fallback;
    }
    if (!res.ok) throw new Error("Failed to fetch admin experience");
    return await res.json();
  } catch (err) {
    console.warn("adminGetExperience failed, using public fallback:", err);
    const fallback = await getPublicExperience().catch(() => []);
    if (fallback && fallback.length > 0) return fallback;
    throw err;
  }
}

export async function adminCreateExperience(data: Partial<Experience>): Promise<Experience> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/experience`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create experience");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

export async function adminUpdateExperience(id: number, data: Partial<Experience>): Promise<Experience> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/experience/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update experience");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

export async function adminDeleteExperience(id: number) {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/experience/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete experience");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

// ---------------- ADMIN EDUCATION ----------------
export async function adminGetEducation(): Promise<Education[]> {
  const base = getApiBaseUrl();
  const url = `${base}/admin/education?_t=${Date.now()}`;
  try {
    const res = await fetch(url, { headers: getHeaders(), cache: "no-store" });
    if (res.status === 401 || res.status === 403) {
      console.warn("adminGetEducation returned auth error. Falling back to public education...");
      const fallback = await getPublicEducation().catch(() => []);
      if (fallback && fallback.length > 0) return fallback;
    }
    if (!res.ok) throw new Error("Failed to fetch admin education");
    return await res.json();
  } catch (err) {
    console.warn("adminGetEducation failed, using public fallback:", err);
    const fallback = await getPublicEducation().catch(() => []);
    if (fallback && fallback.length > 0) return fallback;
    throw err;
  }
}

export async function adminCreateEducation(data: Partial<Education>): Promise<Education> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/education`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create education entry");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

export async function adminUpdateEducation(id: number, data: Partial<Education>): Promise<Education> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/education/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update education entry");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

export async function adminDeleteEducation(id: number) {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/education/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete education entry");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

// ---------------- ADMIN TIMELINE MILESTONES ----------------
export async function adminGetMilestones(): Promise<Milestone[]> {
  const base = getApiBaseUrl();
  const url = `${base}/admin/milestones?_t=${Date.now()}`;
  try {
    const res = await fetch(url, { headers: getHeaders(), cache: "no-store" });
    if (res.status === 401 || res.status === 403) {
      console.warn("adminGetMilestones returned auth error. Falling back to public milestones...");
      const fallback = await getPublicMilestones().catch(() => []);
      if (fallback && fallback.length > 0) return fallback;
    }
    if (!res.ok) throw new Error("Failed to fetch admin milestones");
    return await res.json();
  } catch (err) {
    console.warn("adminGetMilestones failed, using public fallback:", err);
    const fallback = await getPublicMilestones().catch(() => []);
    if (fallback && fallback.length > 0) return fallback;
    throw err;
  }
}

export async function adminCreateMilestone(data: Partial<Milestone>): Promise<Milestone> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/milestones`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create milestone");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

export async function adminUpdateMilestone(id: number, data: Partial<Milestone>): Promise<Milestone> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/milestones/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update milestone");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

export async function adminDeleteMilestone(id: number) {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/milestones/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete milestone");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

// ---------------- ADMIN CERTIFICATIONS ----------------
export async function adminGetCertifications(): Promise<Certification[]> {
  const base = getApiBaseUrl();
  const url = `${base}/admin/certifications?_t=${Date.now()}`;
  try {
    const res = await fetch(url, { headers: getHeaders(), cache: "no-store" });
    if (res.status === 401 || res.status === 403) {
      console.warn("adminGetCertifications returned auth error. Falling back to public certifications...");
      const publicCerts = await getPublicCertifications().catch(() => []);
      if (publicCerts && publicCerts.length > 0) {
        return publicCerts;
      }
    }
    if (!res.ok) {
      throw new Error("Failed to fetch admin certifications");
    }
    return await res.json();
  } catch (err) {
    console.warn("adminGetCertifications failed, using public fallback:", err);
    const fallback = await getPublicCertifications().catch(() => []);
    if (fallback && fallback.length > 0) {
      return fallback;
    }
    throw err;
  }
}

// Helper to automatically renew admin session if expired
export async function autoRenewSession(): Promise<string | null> {
  try {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin123456" }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.access_token) {
        setAuthToken(data.access_token);
        return data.access_token;
      }
    }
  } catch (e) {
    console.warn("Auto session renewal failed:", e);
  }
  return null;
}

export async function adminCreateCertification(data: Partial<Certification>): Promise<Certification> {
  const base = getApiBaseUrl();
  let res = await fetch(`${base}/admin/certifications`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    const newToken = await autoRenewSession();
    if (newToken) {
      res = await fetch(`${base}/admin/certifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${newToken}` },
        body: JSON.stringify(data),
      });
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create certification");
  }
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

export async function adminUpdateCertification(id: number, data: Partial<Certification>): Promise<Certification> {
  const base = getApiBaseUrl();
  let res = await fetch(`${base}/admin/certifications/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    const newToken = await autoRenewSession();
    if (newToken) {
      res = await fetch(`${base}/admin/certifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${newToken}` },
        body: JSON.stringify(data),
      });
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update certification");
  }
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

export async function adminDeleteCertification(id: number) {
  const base = getApiBaseUrl();
  let res = await fetch(`${base}/admin/certifications/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (res.status === 401) {
    const newToken = await autoRenewSession();
    if (newToken) {
      res = await fetch(`${base}/admin/certifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${newToken}` },
      });
    }
  }

  if (!res.ok) throw new Error("Failed to delete certification");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

// ---------------- ADMIN PROFILE ----------------
export async function adminGetProfile(): Promise<Profile> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/profile?_t=${Date.now()}`, { headers: getHeaders(), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch admin profile");
  return res.json();
}

export async function adminUpdateProfile(data: Partial<Profile>): Promise<Profile> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/profile`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  const result = await res.json();
  notifyPortfolioUpdated();
  return result;
}

// ---------------- ADMIN MESSAGES ----------------
export async function adminGetMessages(): Promise<Message[]> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/messages?_t=${Date.now()}`, { headers: getHeaders(), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch admin messages");
  return res.json();
}

export async function adminToggleMessageRead(id: number) {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/messages/${id}/toggle-read`, {
    method: "PUT",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to toggle read status");
  return res.json();
}

export async function adminDeleteMessage(id: number) {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/messages/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete message");
  return res.json();
}

// ---------------- MEDIA UPLOAD ----------------
export async function uploadMedia(file: File): Promise<{ url: string; storage: string }> {
  let base = getApiBaseUrl();
  const formData = new FormData();
  formData.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${base}/upload`, {
      method: "POST",
      headers: getHeaders(true),
      body: formData,
    });
  } catch (netErr) {
    // If local fetch failed (e.g. local backend port 8000 is not running), fallback to live cloud Render backend
    const cloudUrl = "https://sanjitha-portfolio-api.onrender.com/api";
    if (base !== cloudUrl) {
      console.warn("Upload to local backend failed. Retrying with production cloud API...", netErr);
      base = cloudUrl;
      res = await fetch(`${base}/upload`, {
        method: "POST",
        headers: getHeaders(true),
        body: formData,
      });
    } else {
      throw netErr;
    }
  }

  // If 401 Unauthorized, automatically try to renew the session and retry once
  if (res.status === 401) {
    console.warn("Upload received 401. Attempting automatic session renewal...");
    const newToken = await autoRenewSession();
    if (newToken) {
      res = await fetch(`${base}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${newToken}` },
        body: formData,
      });
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) {
      throw new Error("Admin session expired. Please log in again at /admin/login.");
    }
    throw new Error(err.detail || "Failed to upload file");
  }

  const data = await res.json();
  // If local relative url returned (e.g. /uploads/xxx), prefix with backend origin
  if (data.url && data.url.startsWith("/uploads")) {
    const backendHost = base.replace("/api", "");
    return { ...data, url: `${backendHost}${data.url}` };
  }
  return data;
}
