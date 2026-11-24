"use client";

import { useEffect, useState } from "react";
import { Profile, Project, Skill, Experience, Certification, Education, Milestone } from "@/types";
import { 
  getPublicProfile, getPublicProjects, getPublicSkills, 
  getPublicExperience, getPublicCertifications, getPublicEducation,
  getPublicMilestones
} from "@/lib/api";
import { defaultCertifications } from "@/lib/defaultData";

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
  resume_url: "https://res.cloudinary.com/glpoxplc/image/upload/v1795459300/portfolio_cms/bjmpzwmjos8zad5j14nj.pdf",
  open_to_work: true,
  degree: "B.E. Computer Science Engineering (AI & ML)",
  university: "KPR Institute of Engineering and Technology, Coimbatore",
  gpa: "8.7/10",
  graduation_year: "2024 — 2028",
};

const defaultProjects: Project[] = [
  {
    id: 2,
    title: "Smart Tourist Safety System — TourEzy",
    slug: "smart-tourist-safety-system-tourezy",
    summary: "Developed an AI-powered tourist safety platform featuring real-time safety scoring, live location tracking, and predictive risk alerts.\n\nThe platform combines AI-powered assistance, Aadhaar-based identity verification, GPS geofencing, and location intelligence to provide safer travel experiences.",
    description: `<!-- meta: 2025–2026 | Generative AI System | Team -->

## Problem
Tourists frequently encounter safety challenges when travelling to unfamiliar locations.
Major challenges include lack of awareness about unsafe locations, delayed emergency responses, and limited contextual intelligence during critical incidents.

## Solution
Developed an integrated AI-powered safety platform featuring Aadhaar-based KYC verification, Gemini AI conversational guidance, GPS geofencing with unsafe-zone alerts, and Google Maps API location routing.

## Features
- Real-Time Location Safety: GPS-based tracking, geo-fenced unsafe-zone detection, and instant safety alerts.
- AI-Powered Assistant: Gemini AI multimodal integration for text and image-based queries and context-aware travel recommendations.
- Emergency Assistance: Discovery of nearby police stations and hospitals with 1-click emergency routing.
- Identity Verification: Aadhaar-based digital KYC verification for secure tourist onboarding.

## Architecture
The system follows a modular, AI-integrated architecture connecting mobile clients (Kotlin/Jetpack Compose) to FastAPI backend microservices, PostGIS geospatial database, and Gemini AI.

### Architecture Phases
Phase 01: Client Mobile App | Live GPS Telemetry & Interface | Kotlin / Jetpack Compose
Phase 02: API Gateway | Authentication & Risk Scoring | FastAPI / PostGIS
Phase 03: AI Engine | Vision & Language Travel Guidance | Gemini API / LangChain
Phase 04: Storage & Cache | Geospatial Points & Active Sessions | PostgreSQL / PostGIS / Redis
Phase 05: Emergency Dispatch | Real-Time Notifications | Firebase Cloud Messaging / MQTT

## My Contributions
- Contributed to the development of the AI-powered tourist safety platform.
- Integrated AI-based assistance and Gemini APIs for contextual safety queries.
- Developed location-based safety monitoring, geofencing, and PostGIS queries.
- Built backend REST APIs using FastAPI and integrated Google Maps SDK.

## Challenges
Challenge 1: Aadhaar KYC Integration & Data Security
Problem: Handling sensitive identity information and integrating verification securely.
Solution: Implemented token-based authentication and AES-256 encryption for sensitive identity payloads.

Challenge 2: Real-Time AI Safety Analysis
Problem: Analyzing tourist surroundings and identifying potential safety risks accurately.
Solution: Combined Gemini AI multimodal vision analysis with GPS-based location intelligence.

## Measurable Outcomes
- Successfully engineered an end-to-end tourist safety prototype.
- Sub-200ms geofence evaluation using spatial indexing in PostGIS.
- Integrated automated SOS dispatch protocols for rapid response.

## Future Scope
- Offline-first geofence caching for remote trekking zones.
- Real-time automated tourist crowd-density anomaly detection.
- Cross-border emergency consulate dispatch integrations.`,
    category: "Generative AI",
    tags: "Python, FastAPI, Kotlin, Jetpack Compose, PostgreSQL, PostGIS, Redis, Docker, LangChain, OpenAI API, Gemini API, Google Maps SDK, Firebase Cloud Messaging, MQTT, Elasticsearch, JWT",
    featured_image: "https://res.cloudinary.com/glpoxplc/image/upload/v1795362527/portfolio_cms/aavfbhkqti8swv2pdwml.jpg",
    demo_url: "",
    github_url: "https://github.com/Sanjitha-2210/TourEzy",
    video_url: "",
    is_featured: true,
    status: "published",
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "HireHub — Placement Management Portal",
    slug: "hirehub-placement-management-portal",
    summary: "Developed a full-stack web application to streamline campus placement activities, company management, job postings, student applications, interviews, and offer management.",
    description: `<!-- meta: 2026 | Full-Stack Web | Team -->

## Problem
Traditional campus placement operations rely on fragmented spreadsheets, manual email chains, and disconnected communication channels between Career Development Cells (CDC), recruiters, and students. This causes missed deadlines, difficult eligibility checks, and a lack of centralized oversight.

## Solution
Engineered HireHub as a comprehensive full-stack placement portal featuring dedicated portals for CDC administrators, company recruiters, and students. Automated candidate eligibility verification, integrated Redis caching, and built structured application management pipelines.

## Features
- Dedicated Portals: Specialized dashboards tailored for CDC administrators, company recruiters, and student applicants.
- Automated Eligibility Verification: Instant verification of candidate eligibility based on CGPA, backlogs, and departmental prerequisites.
- Structured Job Discovery & Application: 1-click job applications with real-time status tracking across interview stages.
- High-Performance Caching: Redis integration for instant retrieval of active recruitment drives during traffic surges.
- Role-Based Security: JWT-based authentication with role-based access control and token management.

## Architecture
React/TypeScript single-page applications connect to FastAPI REST services. SQLAlchemy manages structured recruitment records in PostgreSQL, while Redis provides sub-millisecond caching for high-concurrency placement seasons.

### Architecture Phases
Phase 01: Client Web Portals | Student & CDC Management UIs | React.js / TypeScript / Tailwind CSS
Phase 02: API Gateway & Auth | JWT Verification & Role-Based Access | FastAPI / Pydantic
Phase 03: Placement Logic Core | Eligibility Engine & Job Pipelines | Python / SQLAlchemy / Alembic
Phase 04: Persistence & Cache | Relational Data & Session Cache | PostgreSQL / Redis
Phase 05: Analytics & Reporting | Activity Tracking & Exporting | Background Tasks / Celery

## My Contributions
- Built RESTful APIs and backend services using FastAPI and SQLAlchemy with PostgreSQL for database management.
- Developed interactive and responsive user interfaces using React.js, TypeScript, and Tailwind CSS.
- Implemented JWT-based authentication, role-based access control, and Redis caching.
- Designed automated eligibility evaluation algorithms that slashed administrative verification time.
- Integrated automated database migration workflows using Alembic.

## Challenges
Challenge 1: High Concurrency During Campus Placement Openings
Problem: Hundreds of students submitting applications simultaneously caused database connection bottlenecks.
Solution: Implemented Redis caching for job listings and optimized connection pooling in SQLAlchemy to maintain sub-80ms response times.

Challenge 2: Complex Eligibility Rule Engine
Problem: Visiting companies required customized criteria including minimum CGPA, history of backlogs, and specific tech competencies.
Solution: Engineered a flexible rule-evaluation engine in FastAPI that evaluates candidate eligibility dynamically against company criteria.

## Measurable Outcomes
Developed a centralized platform for campus placement activities.
Established dedicated interfaces for CDC administrators and students.
Organized student, company, and recruitment information.
Simplified job eligibility verification workflows.
Enabled structured job discovery and application management.
Improved visibility into placement-related activities.
Gained practical experience in full-stack development, database management, API integration, and system testing.

## Future Scope
AI-powered job recommendations based on student profiles and skills.
Automated resume parsing and candidate profiling.
Intelligent placement analytics and predictive insights.
Automated email and notification services.
Interview scheduling and recruitment calendar integration.
Integration with external applicant tracking systems.
Advanced placement performance dashboards.
Automated recruitment reports and institutional analytics.`,
    category: "Full-Stack Web",
    tags: "FastAPI, React.js, TypeScript, PostgreSQL, SQLAlchemy, Alembic, Redis, JWT, Docker, Tailwind CSS",
    featured_image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1000&auto=format&fit=crop&q=80",
    demo_url: "",
    github_url: "https://github.com/Sanjitha-2210/HireHub",
    video_url: "",
    is_featured: true,
    status: "published",
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Personal AI Agent — Enterprise-Grade Intelligent Assistant",
    slug: "personal-ai-agent-enterprise-intelligent-assistant",
    summary: "Developed an AI agent platform featuring multi-agent orchestration, persistent memory, and Retrieval-Augmented Generation (RAG) for intelligent conversational assistance.",
    description: `<!-- meta: 2026 | Generative AI System | Lead -->

## Problem
Standard conversational bots operate in stateless isolation, lack long-term persistent memory across sessions, and cannot interact deterministically with external developer tools and enterprise knowledge bases.

## Solution
Architected an enterprise-grade agent platform using LangGraph for multi-agent state machines, ChromaDB for vector retrieval over enterprise documents, and Model Context Protocol (MCP) servers for extensible local and cloud tool execution.

## Features
- Multi-Agent Orchestration: Autonomous agent workflows using LangGraph with human-in-the-loop validation.
- Hybrid Semantic Retrieval (RAG): Dense vector search and semantic chunking powered by ChromaDB.
- Model Context Protocol (MCP): Extensible tool integration connecting local and cloud APIs seamlessly.
- Multi-LLM Execution: Seamless routing between OpenAI API, Gemini API, and local Ollama models.
- Persistent Session Memory: Redis-backed conversation cache with long-term memory persistence in PostgreSQL.

## Architecture
Interactive React canvas communicates with a FastAPI gateway. Requests pass through LangGraph agent workflows, querying ChromaDB vector stores for domain context and executing tools via MCP protocol runners.

### Architecture Phases
Phase 01: Agent UI & Chat Canvas | Interactive Interface & Stream | React / TypeScript / Tailwind CSS
Phase 02: Gateway & Session Router | WebSocket Streaming & Auth | FastAPI / WebSockets / JWT
Phase 03: Agent Orchestration Engine | Multi-Agent Graph & Tool Calling | LangGraph / LangChain
Phase 04: Vector Memory & RAG | Semantic Embeddings & Document Store | ChromaDB / SentenceTransformers
Phase 05: Model Providers & Tools | Cloud LLMs & Local Models | OpenAI / Gemini / Ollama / MCP Servers

## My Contributions
- Developed full-stack application architecture using FastAPI, React, TypeScript, PostgreSQL, and Redis with secure authentication using JWT.
- Implemented knowledge base management, document processing, and semantic retrieval using LangChain, LangGraph, and ChromaDB.
- Integrated OpenAI API, Ollama, and MCP servers to support extensible tool integration and workflow automation.
- Built real-time streaming interfaces using Server-Sent Events (SSE) and WebSockets.

## Challenges
Challenge 1: Context Window Management & Hallucination Reduction
Problem: Passing large documents into LLM context incurred high latency and occasional hallucinated citations.
Solution: Implemented semantic chunking with cross-encoder re-ranking in ChromaDB, supplying only top-k relevant snippets to the prompt context.

Challenge 2: Real-Time Bidirectional Tool Feedback
Problem: Long-running agent tool invocations froze chat UI when using synchronous HTTP requests.
Solution: Adopted Server-Sent Events (SSE) and WebSockets in FastAPI to stream agent thinking steps and tool execution progress in real-time.

## Measurable Outcomes
- Successfully deployed a production-ready agent platform supporting multi-agent collaboration.
- Reduced document lookup and synthesis latency from minutes to under 2 seconds.
- Integrated local offline LLMs (via Ollama) alongside cloud foundation models.
- Demonstrated enterprise MCP protocol integration for autonomous task execution.

## Future Scope
- Voice-driven multimodal interface with real-time audio streaming.
- Autonomous code generation sandbox with ephemeral container isolation.
- Collaborative multi-user team workspaces with role-based access.
- Self-improving agent evaluation pipelines with automated feedback loops.`,
    category: "Generative AI",
    tags: "Python, FastAPI, React, TypeScript, PostgreSQL, SQLAlchemy, Alembic, Redis, Docker, LangChain, LangGraph, OpenAI API, Ollama, ChromaDB, MCP Servers, JWT",
    featured_image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80",
    demo_url: "",
    github_url: "https://github.com/Sanjitha-2210/Personal-AI-Agent",
    video_url: "",
    is_featured: true,
    status: "published",
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    title: "DeptConnect — Department Management Platform",
    slug: "deptconnect-department-management-platform",
    summary: "Developed a responsive department website to organize and present academic information, faculty profiles, student achievements, research activities, placements, and departmental updates.",
    description: `<!-- meta: 2026 | Full-Stack Web | Lead -->

## Problem
Academic departments need a modern, maintainable portal to showcase faculty credentials, student achievements, research publications, and official announcements without relying on rigid legacy university websites.

## Solution
Engineered DeptConnect: a high-velocity department management platform featuring a responsive Next.js frontend, Cloudinary-backed digital asset storage, and an administrative CMS for real-time announcements.

## Features
- Faculty & Student Directories: Comprehensive profiles showcasing credentials, publications, and student milestones.
- Research & Publication Showcase: Curated repository of departmental publications and grants.
- Placement Highlights & Statistics: Interactive presentation of recruiter records and placement milestones.
- Administrative CMS: Intuitive portal for updating announcements and department news with instant publishing.
- Cloudinary Media Delivery: Optimized image and document uploads with CDN delivery and transformation.

## Architecture
Next.js server-rendered and client-side components connect to a FastAPI backend service. SQLAlchemy manages structured department records, while Cloudinary securely stores and serves high-resolution photos and academic documents.

### Architecture Phases
Phase 01: Department Portal Frontend | Public Academic Showcase | Next.js 15 / React / Tailwind CSS
Phase 02: Admin Content Gateway | Authentication & Role Authorization | FastAPI / Pydantic
Phase 03: Department Service Core | Faculty, Notice & Research APIs | Python / SQLAlchemy / Alembic
Phase 04: Media CDN & Asset Store | Document & Photo Optimization | Cloudinary CDN
Phase 05: Relational Database | Department Records & Audit Trails | SQLite / SQLAlchemy

## My Contributions
- Built interactive user interfaces using Next.js, React.js, TypeScript, and Tailwind CSS.
- Developed backend services using FastAPI and implemented database management using SQLite and SQLAlchemy.
- Integrated Cloudinary for image and document management and implemented administrative content management features.
- Designed responsive layout systems ensuring accessibility across mobile and desktop devices.

## Challenges
Challenge 1: Scalable Media Storage for High-Resolution Academic Documents
Problem: Storing high-resolution event photos and PDF research publications locally quickly bloated server storage.
Solution: Integrated Cloudinary CDN with automatic format optimization, on-the-fly resizing, and secure document delivery.

Challenge 2: Fast Search Across Faculty and Publication Records
Problem: Linear filtering across diverse academic archives resulted in sluggish page transitions.
Solution: Implemented indexed database queries and client-side memoized search filters for instant multi-field discovery.

## Measurable Outcomes
- Successfully delivered a centralized, responsive digital hub for the department.
- Organized academic records, faculty directories, and departmental achievements in one place.
- Streamlined notice publication workflows for administrative staff.
- Gained extensive experience in full-stack engineering, cloud media pipelines, and CMS architecture.

## Future Scope
- Automated student event registration and digital ticketing.
- Alumni networking portal with career mentorship connections.
- Integrated faculty research collaboration matchmaking.
- Push notification system for critical institutional announcements.`,
    category: "Full-Stack Web",
    tags: "Next.js, React.js, TypeScript, Tailwind CSS, Python, FastAPI, SQLite, SQLAlchemy, Alembic, Cloudinary, Git, GitHub",
    featured_image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80",
    demo_url: "",
    github_url: "https://github.com/Sanjitha-2210/DeptConnect",
    video_url: "",
    is_featured: true,
    status: "published",
    order_index: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 1,
    title: "Blog Platform",
    slug: "blog-platform",
    summary: "Developed a feature-rich blogging platform during my AI/ML Engineer Internship at PhobosQ, focusing on building a scalable and secure backend using FastAPI.\n\nThe platform enables users to create and manage blog posts, upload media, interact through comments and likes, and discover content through advanced search.",
    description: `<!-- meta: 2025 | Internship Project | Team -->

## Problem
Traditional blogging platforms can face challenges with performance, content management, security, and user engagement.

## Solution
Designed and developed a modular backend architecture to address these challenges. Implemented FastAPI-based REST APIs, integrated JWT and OAuth2 authentication, used Elasticsearch for full-text search, and integrated Celery and Redis for asynchronous operations.

## Features
- Authentication & User Management: User signup, login, OAuth2 integration, JWT authentication, and role-based access control.
- Blog Management: Create, read, update, and delete rich-content blog posts with image support.
- User Engagement: Like, bookmark, and nested threaded comments.
- Advanced Search: Elasticsearch-powered full-text search with relevance ranking.
- Asynchronous Processing: Celery and Redis for background indexing and email operations.

## Architecture
Client -> FastAPI API Layer -> Authentication & Authorization -> Service Layer -> Database / Redis / Elasticsearch / Cloud Storage. Celery Workers handle background tasks while WebSockets support real-time communication.

## My Contributions
- Developed backend APIs using FastAPI and SQLAlchemy.
- Implemented JWT authentication, OAuth2, and role-based access control.
- Integrated Elasticsearch for advanced content discovery.
- Implemented asynchronous background processing using Celery and Redis.

## Challenges
Challenge 1: Advanced Full-Text Search
Problem: Traditional database search was insufficient for advanced search requirements and ranking.
Solution: Integrated Elasticsearch with indexing, filters, and relevance scoring.

Challenge 2: Background Task Processing
Problem: Operations such as email delivery and indexing increased API response times.
Solution: Implemented Celery workers with Redis to execute time-consuming operations asynchronously.

## Measurable Outcomes
- Successfully developed a feature-rich blogging backend using FastAPI.
- Gained practical experience with scalable backend architecture.
- Strengthened knowledge of authentication, database design, and API development.

## Future Scope
- AI-powered blog recommendations.
- Automatic content categorization and tagging.
- AI-based content summarization.
- Personalized user feeds.`,
    category: "Full-Stack Web",
    tags: "Python, PostgreSQL, SQLAlchemy, Redis, Celery, Elasticsearch, JWT, OAuth2, AWS S3, Cloudinary, WebSockets, Docker",
    featured_image: "https://res.cloudinary.com/glpoxplc/image/upload/v1795331508/portfolio_cms/ekp1bdwtsokhmpn87czh.jpg",
    demo_url: "",
    github_url: "https://github.com/PhobosQ-ai/Community-page",
    video_url: "https://res.cloudinary.com/glpoxplc/video/upload/v1795332885/portfolio_cms/ic1jjjyme2ymb0irgnnb.mp4",
    is_featured: false,
    status: "published",
    order_index: 5,
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
    role: "Full Stack Developer Intern",
    company: "PhobosQ",
    company_url: "",
    location: "Coimbatore, India (Hybrid)",
    start_date: "APR 2025",
    end_date: "OCT 2025",
    is_current: false,
    description: "Tech Stack: Python, FastAPI, Next.js, PostgreSQL, REST APIs",
    bullet_points: "Full-Stack Blogging Platform Development: Developed a full-stack blogging platform using FastAPI and Next.js, integrating frontend and backend components to deliver a functional web application.\nRESTAPI Development: Designed and implemented RESTful APIs for user authentication, profile management, and blog operations using FastAPI.\nDatabase Integration: Integrated PostgreSQL to manage user accounts, blog content, and application data, ensuring efficient database operations.\nApplication Feature Development: Developed authentication, user profile, and blog management modules, enabling seamless interaction between frontend and backend components.",
    status: "published",
    order_index: 1
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
