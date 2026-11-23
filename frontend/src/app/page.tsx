"use client";

import { useEffect, useState } from "react";
import { Profile, Project, Skill, Experience, Certification, Education, Milestone } from "@/types";
import { 
  getPublicProfile, getPublicProjects, getPublicSkills, 
  getPublicExperience, getPublicCertifications, getPublicEducation,
  getPublicMilestones
} from "@/lib/api";

import AmbientAurora from "@/components/public/AmbientAurora";
import SpotlightCursor from "@/components/public/SpotlightCursor";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import EducationSection from "@/components/public/EducationSection";
import TheoryToPracticeBridge from "@/components/public/TheoryToPracticeBridge";
import SkillsSection from "@/components/public/SkillsSection";
import SkillsToProjectsSeparator from "@/components/public/SkillsToProjectsSeparator";
import ProjectsSection from "@/components/public/ProjectsSection";
import ProjectsToExperienceSeparator from "@/components/public/ProjectsToExperienceSeparator";
import ExperienceSection from "@/components/public/ExperienceSection";
import ExperienceToCertificationsSeparator from "@/components/public/ExperienceToCertificationsSeparator";
import CertificationsSection from "@/components/public/CertificationsSection";
import ContactSection from "@/components/public/ContactSection";
import TerminalHUD from "@/components/public/TerminalHUD";
import RobotChatbot from "@/components/public/RobotChatbot";
import Footer from "@/components/public/Footer";

const defaultProfile: Profile = {
  id: 1,
  full_name: "Sanjitha E",
  title: "GenAI Application Developer",
  bio: "Building intelligent solutions with Generative AI, Machine Learning and modern web technologies.",
  location: "Coimbatore, Tamil Nadu, India",
  email: "sanjitha.e.dev@gmail.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://x.com",
  website: "https://sanjitha.dev",
  avatar_url: "https://res.cloudinary.com/glpoxplc/image/upload/v1794729920/portfolio_cms/paclbowwbdjsisgvzeqt.jpg",
  resume_url: "https://example.com/resume.pdf",
  open_to_work: true,
  degree: "B.E. Computer Science Engineering (AI & ML)",
  university: "KPR Institute of Engineering and Technology, Coimbatore",
  gpa: "8.7/10",
  graduation_year: "2024 — 2028",
};

const defaultProjects: Project[] = [
  {
    id: 1,
    title: "AuraSphere: AI-Powered Autonomous Cloud Orchestrator",
    slug: "aurasphere-autonomous-orchestrator",
    summary: "A next-gen cluster management and dynamic autoscaling system leveraging predictive ML models to slash cloud costs by 42%.",
    description: "### Architectural Highlights\n- **Real-Time Stream Processing**: Ingests telemetry metrics over gRPC and Kafka at 150k events/sec.\n- **Predictive Autoscaling**: Pre-allocates spot instances based on recurrent neural network traffic forecasts.\n- **Zero-Downtime Canary Rollouts**: Automated health checks, circuit breaking, and progressive traffic shifting.\n- **Tech Stack**: Rust, Go, Python (FastAPI), Kubernetes, Next.js 15, TimescaleDB, Tailwind CSS.",
    category: "Distributed Systems",
    tags: "Rust,FastAPI,Kubernetes,Next.js,Kafka,Docker",
    featured_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
    demo_url: "https://demo.aurasphere.example.com",
    github_url: "https://github.com/example/aurasphere",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    is_featured: true,
    status: "published",
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "HyperPulse: Ultra Low-Latency Financial Visualizer",
    slug: "hyperpulse-low-latency-visualizer",
    summary: "Sub-millisecond order-book visualizer and algorithmic trading dashboard with WebGL canvas rendering.",
    description: "### System Features\n- **High-Frequency Visualization**: Renders 10,000+ real-time bid/ask tick updates per second using custom WebGL shaders.\n- **Reactive State Architecture**: Built on zero-allocation circular buffer data structures in TypeScript.\n- **Cross-Exchange Aggregation**: Real-time WebSocket multiplexing across 6 major global financial hubs.",
    category: "FinTech & WebGL",
    tags: "Next.js,TypeScript,WebGL,WebSockets,High-Frequency",
    featured_image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1000&auto=format&fit=crop&q=80",
    demo_url: "https://hyperpulse.example.com",
    github_url: "https://github.com/example/hyperpulse",
    is_featured: true,
    status: "published",
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "CogniFlow: Multimodal Agentic Workflow Engine",
    slug: "cogniflow-agentic-workflow-engine",
    summary: "Enterprise agentic system allowing teams to deploy autonomous AI swarms with human-in-the-loop guardrails.",
    description: "### Engineering Overview\n- **Hierarchical Agent Planning**: Multi-agent consensus mechanism with dynamic tool evaluation.\n- **Vector Memory Core**: Hybrid dense and sparse lexical search over 20M+ enterprise documents.\n- **Sandboxed Execution**: Ephemeral containerized runners for generated Python, SQL, and Bash code.",
    category: "AI / Machine Learning",
    tags: "FastAPI,Python,PyTorch,Next.js,PostgreSQL,LangChain",
    featured_image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80",
    demo_url: "https://cogniflow.example.com",
    github_url: "https://github.com/example/cogniflow",
    is_featured: true,
    status: "published",
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "VeloceDB: Embedded In-Memory LSM-Tree Storage Engine",
    slug: "velocedb-lsm-storage-engine",
    summary: "Lightweight, crash-safe, write-optimized key-value store crafted for edge computing and local caching.",
    description: "Compaction algorithms, bloom filters for fast negative lookups, and Write-Ahead Logging (WAL) for durability.",
    category: "Systems & Databases",
    tags: "C++,Go,Systems Programming,LSM-Tree,Benchmarking",
    featured_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80",
    github_url: "https://github.com/example/velocedb",
    is_featured: false,
    status: "published",
    order_index: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const defaultSkills: Skill[] = [
  // --- QUADRANT 1: Languages (4) ---
  { id: 1, name: "Python", category: "Languages", tier: "Core", proficiency: 95, is_highlighted: true, status: "published", order_index: 1 },
  { id: 2, name: "Java", category: "Languages", tier: "Core", proficiency: 90, is_highlighted: true, status: "published", order_index: 2 },
  { id: 3, name: "TypeScript", category: "Languages", tier: "Core", proficiency: 92, is_highlighted: true, status: "published", order_index: 3 },
  { id: 4, name: "JavaScript", category: "Languages", tier: "Core", proficiency: 94, is_highlighted: false, status: "published", order_index: 4 },

  // --- QUADRANT 2: AI & Machine Learning (6) ---
  { id: 5, name: "Generative AI", category: "AI & Machine Learning", tier: "Proficient", proficiency: 92, is_highlighted: true, status: "published", order_index: 5 },
  { id: 6, name: "Large Language Models (LLMs)", category: "AI & Machine Learning", tier: "Proficient", proficiency: 94, is_highlighted: true, status: "published", order_index: 6 },
  { id: 7, name: "Retrieval-Augmented Generation (RAG)", category: "AI & Machine Learning", tier: "Proficient", proficiency: 92, is_highlighted: true, status: "published", order_index: 7 },
  { id: 8, name: "PyTorch", category: "AI & Machine Learning", tier: "Exploring", proficiency: 85, is_highlighted: false, status: "published", order_index: 8 },
  { id: 9, name: "LangChain", category: "AI & Machine Learning", tier: "Exploring", proficiency: 86, is_highlighted: false, status: "published", order_index: 9 },
  { id: 10, name: "Agentic AI", category: "AI & Machine Learning", tier: "Exploring", proficiency: 88, is_highlighted: true, status: "published", order_index: 10 },

  // --- QUADRANT 3: Web & Frameworks (5) ---
  { id: 11, name: "Next.js 15", category: "Web & Frameworks", tier: "Core", proficiency: 95, is_highlighted: true, status: "published", order_index: 11 },
  { id: 12, name: "React", category: "Web & Frameworks", tier: "Core", proficiency: 94, is_highlighted: true, status: "published", order_index: 12 },
  { id: 13, name: "FastAPI", category: "Web & Frameworks", tier: "Core", proficiency: 92, is_highlighted: true, status: "published", order_index: 13 },
  { id: 14, name: "Tailwind CSS", category: "Web & Frameworks", tier: "Proficient", proficiency: 94, is_highlighted: false, status: "published", order_index: 14 },
  { id: 15, name: "Streamlit", category: "Web & Frameworks", tier: "Proficient", proficiency: 88, is_highlighted: false, status: "published", order_index: 15 },

  // --- QUADRANT 4: Infrastructure & Tools (8) ---
  { id: 16, name: "Redis", category: "Infrastructure & Tools", tier: "Proficient", proficiency: 88, is_highlighted: false, status: "published", order_index: 16 },
  { id: 17, name: "Celery", category: "Infrastructure & Tools", tier: "Proficient", proficiency: 88, is_highlighted: false, status: "published", order_index: 17 },
  { id: 18, name: "Docker", category: "Infrastructure & Tools", tier: "Exploring", proficiency: 88, is_highlighted: false, status: "published", order_index: 18 },
  { id: 19, name: "Git & GitHub", category: "Infrastructure & Tools", tier: "Core", proficiency: 95, is_highlighted: false, status: "published", order_index: 19 },
  { id: 20, name: "Linux", category: "Infrastructure & Tools", tier: "Core", proficiency: 90, is_highlighted: false, status: "published", order_index: 20 },
  { id: 21, name: "SQLite", category: "Infrastructure & Tools", tier: "Proficient", proficiency: 90, is_highlighted: false, status: "published", order_index: 21 },
  { id: 22, name: "PostgreSQL", category: "Infrastructure & Tools", tier: "Proficient", proficiency: 92, is_highlighted: false, status: "published", order_index: 22 },
  { id: 23, name: "Cloud & AI Deployment", category: "Infrastructure & Tools", tier: "Exploring", proficiency: 85, is_highlighted: false, status: "published", order_index: 23 },
];

const defaultExperience: Experience[] = [
  {
    id: 1,
    role: "Principal Solutions Architect",
    company: "Apex Distributed Labs",
    company_url: "https://example.com",
    location: "San Francisco, CA",
    start_date: "2023",
    end_date: "Present",
    is_current: true,
    description: "Leading architecture for multi-tenant microservices serving 10M+ daily active developers.",
    bullet_points: "Architected high-throughput ingestion pipelines handling 50k RPS with sub-30ms latency.\nSpearheaded migration to Next.js enterprise micro-frontends, improving Core Web Vitals score to 99/100.\nMentored 18 senior engineers across distributed systems and UI design token systems.",
    status: "published",
    order_index: 1
  },
  {
    id: 2,
    role: "Senior Full-Stack Engineer",
    company: "Vortex Cloud Systems",
    company_url: "https://example.com",
    location: "Seattle, WA",
    start_date: "2021",
    end_date: "2023",
    is_current: false,
    description: "Designed and delivered cloud monitoring dashboard and real-time incident automation tools.",
    bullet_points: "Built real-time telemetry visualizer reducing MTTR by 35%.\nImplemented secure JWT role-based access control and OAuth2 SSO across 12 internal portals.",
    status: "published",
    order_index: 2
  }
];

const defaultCertifications: Certification[] = [
  {
    id: 1,
    title: "VYUHA TECH 2.0 — National Level Hackathon",
    issuer: "CMR Institute of Technology • 2025",
    issue_date: "2025",
    credential_id: "VYUHA-2025-081",
    certificate_image: "/certificates/cert-vyuha-tech.jpg",
    category: "Events & Participation",
    description: "Participated in the 24-Hour National Level Hackathon VYUHA TECH 2.0 conducted by CMR Institute of Technology. Collaborated with a competitive engineering team in developing innovative tech solutions solving real-world challenges.",
    status: "published",
    order_index: 1
  },
  {
    id: 2,
    title: "AWS Fundamentals for Cloud Practitioners",
    issuer: "Nminds Academy, Erode • August 2025",
    issue_date: "August 2025",
    credential_id: "10699282",
    certificate_image: "/certificates/cert-aws-fundamentals.jpg",
    category: "Professional Learning & Certifications",
    description: "Successfully completed a One Credit Course on AWS Cloud Fundamentals with practical training in core cloud services and real-time application deployment. Gained hands-on experience with AWS EC2, Route 53, and Elastic Load Balancer, along with deploying a web server in a live cloud environment.\n\nThis training strengthened my understanding of cloud infrastructure, scalability, load balancing, and basic cloud security concepts.",
    status: "published",
    order_index: 2
  },
  {
    id: 3,
    title: "Certificate of Appreciation — Third Topper",
    issuer: "KPR Institute of Engineering and Technology • 2025",
    issue_date: "2025",
    credential_id: "KPR-TOP03-2025",
    certificate_image: "/certificates/cert-appreciation-topper.jpg",
    category: "Leadership & Professional Development",
    description: "Awarded Certificate of Appreciation as Third Topper during the Even Semester of the Academic Year in recognition of sincere academic efforts, dedicated service, commitment, and active leadership in engineering studies.",
    status: "published",
    order_index: 3
  },
  {
    id: 4,
    title: "SOLSTICE - 2024 — Math Innovations Workshop",
    issuer: "SRMV College of Arts and Science • September 2024",
    issue_date: "September 2024",
    credential_id: "SOLSTICE-2024",
    certificate_image: "/certificates/cert-solstice-2024.jpg",
    category: "Events & Participation",
    description: `Certificate of Participation for the one day workshop on 'Innovations in Learning Mathematics' - SOLSTICE - 2024 held on 24-09-2024.

Event: SOLSTICE - 2024
Topic: Innovations in Learning Mathematics
Date: 24 September 2024
Venue: Sri Ramakrishna Mission Vidyalaya College of Arts and Science, Coimbatore-641 020
Department: Department of Mathematics
Affiliated to: Bharathiar University

Authorized by:
Dr. A.K. Abdul Hakeem - Co-ordinator
Dr. K. Kanagarajan - HoD
Dr. A. Muthusamy - Principal

Key Skills: Mathematical Innovation, Learning Methodologies, Workshop Participation, Intercollegiate Meet`,
    status: "published",
    order_index: 4
  }
];

const defaultEducation: Education[] = [
  {
    id: 1,
    degree: "B.E. Computer Science Engineering (AI & ML)",
    institution: "KPR Institute of Engineering and Technology, Coimbatore",
    period: "2024 — 2028",
    metrics: "CGPA: 8.7/10",
    tags: "AI & ML",
    icon: "degree",
    status: "published",
    order_index: 1,
  },
  {
    id: 2,
    degree: "HSC — Mathematics with Computer Science",
    institution: "Perambalur Govt Model School, Perambalur",
    period: "2022 — 2024",
    metrics: "88.5%",
    tags: "Mathematics, Computer Science",
    icon: "school",
    status: "published",
    order_index: 2,
  },
];

export default function PublicHomePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [education, setEducation] = useState<Education[]>(defaultEducation);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [experience, setExperience] = useState<Experience[]>(defaultExperience);
  const [certifications, setCertifications] = useState<Certification[]>(defaultCertifications);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Hydrate instantly from cache if available to prevent any avatar or text jumping
    try {
      const cached = localStorage.getItem("portfolio_cached_profile");
      if (cached) {
        setProfile(JSON.parse(cached));
      }
    } catch {}

    async function loadPortfolioData() {
      try {
        const [profData, projData, skillData, eduData, expData, certData, msData] = await Promise.all([
          getPublicProfile().catch(() => null),
          getPublicProjects().catch(() => null),
          getPublicSkills().catch(() => null),
          getPublicEducation().catch(() => null),
          getPublicExperience().catch(() => null),
          getPublicCertifications().catch(() => null),
          getPublicMilestones().catch(() => null),
        ]);

        if (!isMounted) return;

        if (profData) {
          setProfile(profData);
          try {
            localStorage.setItem("portfolio_cached_profile", JSON.stringify(profData));
          } catch {}
        }
        if (projData !== null && Array.isArray(projData) && projData.length > 0) setProjects(projData);
        if (skillData !== null && Array.isArray(skillData) && skillData.length > 0) setSkills(skillData);
        if (eduData !== null && Array.isArray(eduData) && eduData.length > 0) setEducation(eduData);
        if (expData !== null && Array.isArray(expData) && expData.length > 0) setExperience(expData);
        if (certData !== null && Array.isArray(certData) && certData.length > 0) setCertifications(certData);
        if (msData !== null && Array.isArray(msData) && msData.length > 0) setMilestones(msData);
      } catch (err) {
        console.error("Failed to load portfolio data", err);
      }
    }

    // Initial load
    loadPortfolioData();

    // 1. BroadcastChannel real-time sync across browser tabs/windows
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("portfolio_sync_channel");
      channel.onmessage = (event) => {
        if (event.data?.type === "PORTFOLIO_UPDATED") {
          loadPortfolioData();
        }
      };
    }

    // 2. CustomEvent on same window
    const handleCustomUpdate = () => {
      loadPortfolioData();
    };
    window.addEventListener("portfolio_updated", handleCustomUpdate);

    // 3. Storage event for cross-tab sync without BroadcastChannel support
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "portfolio_sync_trigger") {
        loadPortfolioData();
      }
    };
    window.addEventListener("storage", handleStorage);

    // 4. Revalidate when tab becomes focused or visible
    const handleFocus = () => {
      loadPortfolioData();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadPortfolioData();
      }
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    // 5. Periodic polling heartbeat (every 5 seconds) to catch direct database or API updates
    const intervalId = setInterval(loadPortfolioData, 5000);

    // Keyboard shortcut '~' or '`' to open Terminal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "~" || e.key === "`") {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      isMounted = false;
      if (channel) channel.close();
      window.removeEventListener("portfolio_updated", handleCustomUpdate);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background bg-ambient-aurora text-foreground flex flex-col justify-between transition-colors duration-300">
      <AmbientAurora />
      <SpotlightCursor />

      <Navbar
        profile={profile}
        onOpenTerminal={() => setIsTerminalOpen(true)}
      />

      <main className="flex-1">
        <Hero
          profile={profile}
          onOpenTerminal={() => setIsTerminalOpen(true)}
        />

        <EducationSection education={education} milestones={milestones} />
        <TheoryToPracticeBridge />
        <SkillsSection skills={skills} />
        <SkillsToProjectsSeparator />
        <ProjectsSection projects={projects} />
        <ProjectsToExperienceSeparator />
        <ExperienceSection experience={experience} />
        <ExperienceToCertificationsSeparator />
        <CertificationsSection certifications={certifications} />
        <ContactSection />
      </main>

      <Footer />

      <RobotChatbot
        profile={profile}
        projects={projects}
        skills={skills}
        education={education}
        experience={experience}
        certifications={certifications}
      />

      <TerminalHUD
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        profile={profile}
        projects={projects}
        skills={skills}
        experience={experience}
        certifications={certifications}
        education={education}
      />
    </div>
  );
}
