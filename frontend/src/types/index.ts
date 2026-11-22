export type ContentStatus = "published" | "draft" | "archived";

export interface Profile {
  id: number;
  full_name: string;
  title: string;
  bio?: string;
  location?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  avatar_url?: string;
  resume_url?: string;
  open_to_work: boolean;
  degree?: string;
  university?: string;
  leetcode?: string;
  codechef?: string;
  codeforces?: string;
  about_markdown?: string;
  gpa?: string;
  graduation_year?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  category: string;
  tags: string;
  featured_image?: string;
  demo_url?: string;
  github_url?: string;
  video_url?: string;
  is_featured: boolean;
  status: ContentStatus;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type SkillTier = "Core" | "Proficient" | "Exploring";

export interface Skill {
  id: number;
  name: string;
  category: string;
  tier?: SkillTier | string;
  proficiency: number;
  icon?: string;
  is_highlighted: boolean;
  status: ContentStatus;
  order_index: number;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  company_url?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  bullet_points?: string;
  status: ContentStatus;
  order_index: number;
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  certificate_image?: string;
  category?: string;
  description?: string;
  duration?: string;
  skills?: string;
  status: ContentStatus;
  order_index: number;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  metrics?: string;
  tags: string;
  icon?: "degree" | "school" | string;
  status: ContentStatus;
  order_index: number;
}

export interface Milestone {
  id?: number;
  year: number;
  pct: number;
  title: string;
  subtitle: string;
  period: string;
  status: "Completed" | "In Progress" | "Upcoming";
  order_index?: number;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_projects: number;
  published_projects: number;
  draft_projects: number;
  archived_projects: number;
  total_skills: number;
  total_experience: number;
  total_certifications: number;
  unread_messages: number;
  total_messages: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

