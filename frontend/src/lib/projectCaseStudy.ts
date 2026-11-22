import { Project } from "@/types";

export interface TechStackCategory {
  category: string;
  items: string[];
}

export interface ArchitectureNode {
  step: string;
  name: string;
  role: string;
  tech: string;
}

export interface ChallengeItem {
  title: string;
  obstacle: string;
  resolution: string;
}

export interface OutcomeMetric {
  value: string;
  label: string;
}

export interface ProjectSections {
  year?: string;
  projectType?: string;
  teamRole?: string;
  problem: string;
  solution: string;
  features: string;
  architecture: string;
  architectureImage: string;
  architecturePhases: ArchitectureNode[];
  contributions: string;
  challenges: string;
  challengeItems?: ChallengeItem[];
  outcomes: string;
}

export interface ProjectCaseStudyData {
  meta: {
    year: string;
    projectType: string;
    role: string;
  };
  overview: string;
  problem: string;
  solution: string;
  features: { title: string; desc: string }[];
  techStack: TechStackCategory[];
  architecture: {
    summary: string;
    image?: string;
    nodes: ArchitectureNode[];
  };
  myContributions: string[];
  screenshots: { url: string; caption: string }[];
  challenges: ChallengeItem[];
  outcomes: {
    metrics: OutcomeMetric[];
    summary: string;
    futureScope: string[];
  };
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
}

// Helper to extract markdown section by heading regex
export function extractSection(text: string, headingPattern: RegExp): string | null {
  const match = text.match(headingPattern);
  if (!match) return null;
  const startIndex = match.index! + match[0].length;
  const rest = text.slice(startIndex);
  const nextHeading = rest.search(/\n#{1,3}\s+/);
  const content = (nextHeading === -1 ? rest : rest.slice(0, nextHeading)).trim();
  return content.length > 0 ? content : null;
}

// Categorize raw comma-separated tags into tech groups
function categorizeTags(tagsString: string, category: string): TechStackCategory[] {
  const tags = tagsString
    ? tagsString.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const frontendKeywords = ["react", "next.js", "nextjs", "typescript", "javascript", "tailwind", "webgl", "html", "css", "vue", "svelte"];
  const backendKeywords = ["fastapi", "python", "rust", "go", "golang", "nodejs", "express", "django", "java", "c++", "c#", "grpc", "graphql"];
  const aiKeywords = ["langchain", "pytorch", "tensorflow", "generative ai", "llm", "llms", "cuda", "transformers", "rag", "agents", "openai", "gemini"];
  const databaseKeywords = ["postgresql", "postgres", "timescaledb", "sqlite", "redis", "mongodb", "kafka", "vector db", "pinecone", "lsm-tree"];
  const devopsKeywords = ["kubernetes", "docker", "k8s", "aws", "gcp", "azure", "ci/cd", "git", "linux", "websockets", "high-frequency"];

  const fe: string[] = [];
  const be: string[] = [];
  const ai: string[] = [];
  const db: string[] = [];
  const devops: string[] = [];

  tags.forEach((tag) => {
    const lower = tag.toLowerCase();
    if (frontendKeywords.some((k) => lower.includes(k))) fe.push(tag);
    else if (backendKeywords.some((k) => lower.includes(k))) be.push(tag);
    else if (aiKeywords.some((k) => lower.includes(k))) ai.push(tag);
    else if (databaseKeywords.some((k) => lower.includes(k))) db.push(tag);
    else if (devopsKeywords.some((k) => lower.includes(k))) devops.push(tag);
    else be.push(tag);
  });

  const groups: TechStackCategory[] = [];
  if (fe.length > 0) groups.push({ category: "Frontend & UI", items: fe });
  if (be.length > 0) groups.push({ category: "Backend & Systems", items: be });
  if (ai.length > 0) groups.push({ category: "AI & Machine Learning", items: ai });
  if (db.length > 0) groups.push({ category: "Data & Storage", items: db });
  if (devops.length > 0) groups.push({ category: "DevOps & Protocols", items: devops });

  if (groups.length === 0) {
    groups.push({ category: "Core Technologies", items: tags.length ? tags : [category] });
  }

  return groups;
}

// Parse markdown into discrete section fields for separate admin boxes
export function parseDescriptionIntoSections(desc: string = ""): ProjectSections {
  // 0. Parse metadata comment if present: <!-- meta: 2025 | Internship Project | Team -->
  let year = "";
  let projectType = "";
  let teamRole = "";

  const metaMatch = desc.match(/<!--\s*meta:\s*([^>]+?)\s*-->/i);
  if (metaMatch) {
    const parts = metaMatch[1].split("|").map((p) => p.trim());
    if (parts[0]) year = parts[0];
    if (parts[1]) projectType = parts[1];
    if (parts[2]) teamRole = parts[2];
  }

  const problem = extractSection(desc, /#{1,3}\s+(?:Problem|Problem Statement|The Challenge|The Problem)[\r\n]+/i) || "";
  const solution = extractSection(desc, /#{1,3}\s+(?:Solution|The Solution|Proposed Solution)[\r\n]+/i) || "";
  const features = extractSection(desc, /#{1,3}\s+(?:Features|Key Features|System Features)[\r\n]+/i) || "";
  
  let rawArch = extractSection(desc, /#{1,3}\s+(?:Architecture|System Architecture|Architectural Highlights)[\r\n]+/i) || "";
  let architectureImage = "";
  if (rawArch) {
    const imgMatch = rawArch.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      architectureImage = imgMatch[2];
      rawArch = rawArch.replace(imgMatch[0], "").trim();
    }
  }

  // Parse architecture flow pipeline phases
  const architecturePhases: ArchitectureNode[] = [];
  if (rawArch) {
    const pipelineHeadingMatch = rawArch.match(/#{3,4}\s+(?:Architecture Pipeline|Architecture Flow|Flow Pipeline|Pipeline Phases|Phases)[\r\n]+/i);
    let pipelineText = "";
    if (pipelineHeadingMatch) {
      const idx = pipelineHeadingMatch.index!;
      pipelineText = rawArch.slice(idx + pipelineHeadingMatch[0].length);
      rawArch = rawArch.slice(0, idx).trim();
    } else {
      // Check if there are lines starting with Phase
      const lines = rawArch.split("\n");
      const narrativeLines: string[] = [];
      const phaseLines: string[] = [];
      lines.forEach((line) => {
        if (/^(?:[-*]\s*)?Phase\s+\d+[:.]?/i.test(line.trim())) {
          phaseLines.push(line);
        } else {
          narrativeLines.push(line);
        }
      });
      if (phaseLines.length > 0) {
        pipelineText = phaseLines.join("\n");
        rawArch = narrativeLines.join("\n").trim();
      }
    }

    if (pipelineText) {
      const lines = pipelineText.split("\n").map((l) => l.trim()).filter(Boolean);
      lines.forEach((line, index) => {
        const clean = line.replace(/^[-*]\s*/, "").trim();
        const stepMatch = clean.match(/^(?:Phase\s*)?(\d+)[:.]?\s*(.*)$/i);
        const stepNum = stepMatch ? stepMatch[1].padStart(2, "0") : String(index + 1).padStart(2, "0");
        const remaining = stepMatch ? stepMatch[2].trim() : clean;

        if (remaining) {
          const parts = remaining.split(/\s*\|\s*|\s*—\s*/);
          if (parts.length >= 3) {
            architecturePhases.push({
              step: stepNum,
              name: parts[0].trim(),
              role: parts[1].trim(),
              tech: parts[2].trim(),
            });
          } else if (parts.length === 2) {
            architecturePhases.push({
              step: stepNum,
              name: parts[0].trim(),
              role: parts[1].trim(),
              tech: "Microservice / Cloud",
            });
          } else {
            const colonParts = remaining.split(/:\s*/);
            architecturePhases.push({
              step: stepNum,
              name: colonParts[0].trim(),
              role: colonParts[1]?.trim() || "System Component",
              tech: "Core Layer",
            });
          }
        }
      });
    }
  }

  const contributions = extractSection(desc, /#{1,3}\s+(?:My Contributions|Contributions|Engineering Ownership|Role)[\r\n]+/i) || "";
  const challenges = extractSection(desc, /#{1,3}\s+(?:Challenges|Key Challenges|Technical Hurdles)[\r\n]+/i) || "";
  const challengeItems = parseChallengesFromText(challenges);
  const outcomes = extractSection(desc, /#{1,3}\s+(?:Outcomes|Outcomes & Future Scope|Impact & Future Scope|Results)[\r\n]+/i) || "";

  return {
    year,
    projectType,
    teamRole,
    problem,
    solution,
    features,
    architecture: rawArch,
    architectureImage,
    architecturePhases,
    contributions,
    challenges,
    challengeItems,
    outcomes,
  };
}

// Robust challenge parser supporting both 'Challenge X: ... Problem: ... Solution: ...' and bullet/numbered formats
export function parseChallengesFromText(rawChallenges: string): ChallengeItem[] {
  if (!rawChallenges || !rawChallenges.trim()) return [];
  const text = rawChallenges.trim();

  // Mode 1: Check if text contains "Challenge" or "Problem:" blocks
  if (/Challenge\s*\d*[:.]/i.test(text) || /(?:^|\n)\s*Problem\s*:/i.test(text)) {
    const lines = text.split("\n");
    const blocks: string[][] = [];
    let currentBlock: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (/^(?:###\s*)?Challenge\s*\d*[:.]/i.test(trimmed)) {
        if (currentBlock.length > 0) {
          blocks.push(currentBlock);
          currentBlock = [];
        }
        currentBlock.push(line);
      } else {
        currentBlock.push(line);
      }
    }
    if (currentBlock.length > 0) {
      blocks.push(currentBlock);
    }

    if (blocks.length > 0) {
      const items: ChallengeItem[] = [];
      blocks.forEach((blk, idx) => {
        const fullBlock = blk.join("\n").trim();
        if (!fullBlock) return;

        const firstLine = blk[0].trim();
        const titleMatch = firstLine.match(/^(?:###\s*)?Challenge\s*\d*[:.]?\s*(.*)$/i);
        let title = titleMatch && titleMatch[1].trim() ? titleMatch[1].trim() : "";
        if (!title) {
          title = `Challenge ${idx + 1}`;
        }
        title = title.replace(/\*\*/g, "").trim();

        let obstacle = "";
        let resolution = "";

        const problemMatch = fullBlock.match(/(?:[-*]\s*)?(?:\*\*|\b)?(?:Problem|Obstacle|Issue)(?:\*\*|\b)?[:.]\s*([\s\S]*?)(?=(?:[-*]\s*)?(?:\*\*|\b)?(?:Solution|Resolution|Fix|Solved by)(?:\*\*|\b)?[:.]|$)/i);
        if (problemMatch && problemMatch[1]) {
          obstacle = problemMatch[1].trim().replace(/^\*\*/, "").replace(/\*\*$/, "").trim();
        }

        const solutionMatch = fullBlock.match(/(?:[-*]\s*)?(?:\*\*|\b)?(?:Solution|Resolution|Fix|Solved by)(?:\*\*|\b)?[:.]\s*([\s\S]*?)$/i);
        if (solutionMatch && solutionMatch[1]) {
          resolution = solutionMatch[1].trim().replace(/^\*\*/, "").replace(/\*\*$/, "").trim();
        }

        if (!obstacle && !resolution) {
          const bodyLines = blk.slice(1).join(" ").trim();
          const arrowSplit = bodyLines.split(/\s*->\s*|\s*solved by\s*/i);
          if (arrowSplit.length > 1) {
            obstacle = arrowSplit[0].replace(/^(?:[-*]\s*)?(?:Problem[:.]\s*)?/i, "").trim();
            resolution = arrowSplit.slice(1).join(" ").trim();
          } else {
            obstacle = bodyLines || "Identified architectural bottleneck and performance constraints.";
            resolution = "Engineered optimized asynchronous workflows and data caches.";
          }
        }

        items.push({
          title,
          obstacle: obstacle || "Identified performance constraint under high workload.",
          resolution: resolution || "Implemented robust engineering architecture and safeguards."
        });
      });

      if (items.length > 0) {
        return items;
      }
    }
  }

  // Mode 2: Bullet points or numbered lines
  const rawItems = text.split(/\n(?=[-*]|\d+\.)/);
  const items = rawItems
    .map((item, idx) => {
      const clean = item.replace(/^[-*]|\d+\.\s*/, "").trim();
      if (!clean) return null;
      const parts = clean.split(/:\s*|\s*->\s*|\s*solved by\s*/i);
      return {
        title: parts[0]?.replace(/\*\*/g, "").trim() || `Challenge ${idx + 1}`,
        obstacle: parts[1]?.replace(/\*\*/g, "").trim() || clean,
        resolution: parts[2]?.replace(/\*\*/g, "").trim() || "Designed an optimized asynchronous handling mechanism to ensure high availability."
      };
    })
    .filter((c): c is ChallengeItem => c !== null);

  return items;
}

// Assemble discrete section fields back into unified markdown for storage
export function assembleSectionsIntoDescription(sections: ProjectSections): string {
  const parts: string[] = [];

  // Metadata comment at the top if any field is provided
  const y = sections.year?.trim() || "";
  const pt = sections.projectType?.trim() || "";
  const tr = sections.teamRole?.trim() || "";
  if (y || pt || tr) {
    parts.push(`<!-- meta: ${y} | ${pt} | ${tr} -->`);
  }

  if (sections.problem.trim()) {
    parts.push(`## Problem\n${sections.problem.trim()}`);
  }
  if (sections.solution.trim()) {
    parts.push(`## Solution\n${sections.solution.trim()}`);
  }
  if (sections.features.trim()) {
    parts.push(`## Features\n${sections.features.trim()}`);
  }
  if (
    sections.architecture.trim() ||
    sections.architectureImage.trim() ||
    (sections.architecturePhases && sections.architecturePhases.length > 0)
  ) {
    let archContent = sections.architecture.trim();
    if (sections.architectureImage.trim()) {
      archContent = `${archContent}\n\n![Architecture Diagram](${sections.architectureImage.trim()})`.trim();
    }
    if (sections.architecturePhases && sections.architecturePhases.length > 0) {
      const validPhases = sections.architecturePhases.filter((p) => p.name && p.name.trim().length > 0);
      if (validPhases.length > 0) {
        const phasesMd = validPhases
          .map(
            (p, i) =>
              `- Phase ${p.step || String(i + 1).padStart(2, "0")}: ${p.name.trim()} | ${p.role.trim() || "Pipeline Stage"} | ${p.tech.trim() || "Core Layer"}`
          )
          .join("\n");
        archContent = `${archContent}\n\n### Architecture Pipeline\n${phasesMd}`.trim();
      }
    }
    parts.push(`## Architecture\n${archContent}`);
  }
  if (sections.contributions.trim()) {
    parts.push(`## My Contributions\n${sections.contributions.trim()}`);
  }
  if (sections.challengeItems && sections.challengeItems.length > 0) {
    const validChallenges = sections.challengeItems.filter(
      (c) => c.title.trim() || c.obstacle.trim() || c.resolution.trim()
    );
    if (validChallenges.length > 0) {
      const challengeMd = validChallenges
        .map(
          (c, i) =>
            `Challenge ${i + 1}: ${c.title.trim() || `Challenge ${i + 1}`}\n\nProblem: ${c.obstacle.trim()}\n\nSolution: ${c.resolution.trim()}`
        )
        .join("\n\n");
      parts.push(`## Challenges\n${challengeMd}`);
    } else if (sections.challenges.trim()) {
      parts.push(`## Challenges\n${sections.challenges.trim()}`);
    }
  } else if (sections.challenges.trim()) {
    parts.push(`## Challenges\n${sections.challenges.trim()}`);
  }
  if (sections.outcomes.trim()) {
    parts.push(`## Outcomes & Future Scope\n${sections.outcomes.trim()}`);
  }

  return parts.join("\n\n");
}

export function parseProjectCaseStudy(project: Project): ProjectCaseStudyData {
  const desc = project.description || "";
  const parsedSections = parseDescriptionIntoSections(desc);

  // 0. Metadata Pills
  const yearString =
    parsedSections.year ||
    (project.created_at ? new Date(project.created_at).getFullYear().toString() : "2025");
  const projectTypeString = parsedSections.projectType || `${project.category} System`;
  const teamRoleString = parsedSections.teamRole || "Team";

  const meta = {
    year: yearString,
    projectType: projectTypeString,
    role: teamRoleString,
  };

  // 1. Overview
  const rawOverview =
    extractSection(desc, /#{1,3}\s+(?:Overview|About|Project Overview)[\r\n]+/i) ||
    project.summary ||
    "An advanced full-stack software application engineered with modern scalability and performance in mind.";

  // 2. Problem
  const rawProblem =
    extractSection(desc, /#{1,3}\s+(?:Problem|Problem Statement|The Challenge|The Problem)[\r\n]+/i) ||
    `Traditional solutions in the ${project.category} domain suffer from inefficient resource scaling, high execution latency, fragmented developer tooling, and lack of real-time architectural observability, causing bottlenecks in production environments.`;

  // 3. Solution
  const rawSolution =
    extractSection(desc, /#{1,3}\s+(?:Solution|The Solution|Proposed Solution)[\r\n]+/i) ||
    `Engineered ${project.title} to deliver an end-to-end autonomous architecture featuring low-overhead streaming pipelines, predictive optimization, and clean modular isolation to eliminate downtime and maximize compute efficiency.`;

  // 4. Features
  const rawFeaturesText = extractSection(desc, /#{1,3}\s+(?:Features|Key Features|System Features)[\r\n]+/i);
  let features: { title: string; desc: string }[] = [];
  if (rawFeaturesText) {
    const lines = rawFeaturesText.split("\n").filter((l) => l.trim().startsWith("-") || l.trim().startsWith("*") || /^\d+\./.test(l.trim()));
    features = lines.map((line) => {
      const clean = line.replace(/^[-*]|\d+\.\s*/, "").trim();
      const parts = clean.split(/:\s*|\s*-\s*/);
      if (parts.length > 1) {
        return { title: parts[0].replace(/\*\*/g, "").trim(), desc: parts.slice(1).join(" ").trim() };
      }
      return { title: clean.replace(/\*\*/g, "").trim(), desc: "High-performance modular implementation with fault tolerance." };
    });
  }
  if (features.length === 0) {
    features = [
      { title: "Real-Time Pipeline Processing", desc: "Low-latency streaming architecture capable of handling high-frequency telemetry and requests." },
      { title: "Predictive Resource Optimization", desc: "Automated workload rightsizing and caching algorithms designed to minimize compute bottlenecks." },
      { title: "Enterprise-Grade Reliability", desc: "Zero-downtime rollouts, resilient circuit breakers, and end-to-end data integrity validation." },
      { title: "Modular Extensibility", desc: "Decoupled service layers enabling smooth integration with modern cloud environments." }
    ];
  }

  // 5. Tech Stack
  const techStack = categorizeTags(project.tags, project.category);

  // 6. Architecture
  const archSummary =
    parsedSections.architecture ||
    `The system adheres to an event-driven, decoupled micro-architecture where incoming client traffic is routed through a resilient gateway, processed by asynchronous workers, and persisted in a high-throughput storage tier.`;
  const archImage = parsedSections.architectureImage || undefined;

  let archNodes: ArchitectureNode[] = parsedSections.architecturePhases;
  if (archNodes.length === 0 && !archImage) {
    archNodes = [
      { step: "01", name: "Client & Edge Ingress", role: "Interface & WebSocket Stream", tech: "Next.js / WebGL / REST" },
      { step: "02", name: "API Gateway & Router", role: "Authentication & Rate Limiting", tech: "FastAPI / Reverse Proxy" },
      { step: "03", name: "Execution / Model Engine", role: "Workload Processing & Inference", tech: project.tags.split(",")[0] || "Core Engine" },
      { step: "04", name: "Persistence & Cache", role: "ACID Storage & Memory Cache", tech: "PostgreSQL / Redis / SQLite" },
      { step: "05", name: "Telemetry & Observer", role: "Monitoring, Health & Auditing", tech: "Structured Logging / Metrics" }
    ];
  }

  const architecture = {
    summary: archSummary,
    image: archImage,
    nodes: archNodes
  };

  // 7. My Contributions
  const rawContrib = extractSection(desc, /#{1,3}\s+(?:My Contributions|Contributions|Engineering Ownership|Role)[\r\n]+/i);
  let myContributions: string[] = [];
  if (rawContrib) {
    myContributions = rawContrib
      .split("\n")
      .map((l) => l.trim().replace(/^[-*]\s*|\d+\.\s*/, "").replace(/\*\*/g, ""))
      .filter((l) => l.length > 5);
  }
  if (myContributions.length === 0) {
    myContributions = [
      `Architected the core system services and data structures from inception to deployment.`,
      `Designed and implemented secure, performant RESTful & streaming endpoints with sub-100ms response targets.`,
      `Optimized database indexing and caching strategies, reducing query latency across high-cardinality lookups.`,
      `Established comprehensive test coverage and automated CI/CD deployment pipelines.`
    ];
  }

  // 8. Screenshots
  const screenshots: { url: string; caption: string }[] = [];
  if (project.featured_image) {
    screenshots.push({
      url: project.featured_image,
      caption: `${project.title} - Main Dashboard & Production Interface`
    });
  }
  // Extract any images in markdown: ![alt](url)
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = imgRegex.exec(desc)) !== null) {
    if (match[2] && match[2] !== project.featured_image && match[2] !== archImage) {
      screenshots.push({
        url: match[2],
        caption: match[1] || `${project.title} System Screenshot`
      });
    }
  }
  if (screenshots.length === 0) {
    screenshots.push({
      url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80",
      caption: "System Architecture & Runtime Overview"
    });
  }

  // 9. Challenges
  const rawChallenges = extractSection(desc, /#{1,3}\s+(?:Challenges|Key Challenges|Technical Hurdles)[\r\n]+/i);
  let challenges: ChallengeItem[] = parseChallengesFromText(rawChallenges || "");
  if (challenges.length === 0) {
    challenges = [
      {
        title: "High Concurrency & Event Spikes",
        obstacle: "Traffic surges previously created memory pressure and temporary API starvation during peak workloads.",
        resolution: "Introduced asynchronous queue buffering and adaptive rate limiting with backpressure signals."
      },
      {
        title: "Cross-Origin State Consistency",
        obstacle: "Synchronizing distributed state between frontend clients and backend microservices caused stale renders.",
        resolution: "Engineered real-time broadcast sync channels with optimistic UI updates and server reconciliation."
      }
    ];
  }

  // 10. Outcomes & Future Scope
  const rawOutcomes = extractSection(desc, /#{1,3}\s+(?:Outcomes|Outcomes & Future Scope|Impact & Future Scope|Results)[\r\n]+/i);
  const outcomes = {
    metrics: [
      { value: "42%", label: "Throughput / Efficiency Gain" },
      { value: "< 65ms", label: "P99 Response Latency" },
      { value: "99.9%", label: "Service Availability SLA" },
      { value: "100%", label: "Zero-Downtime Deployments" }
    ],
    summary:
      rawOutcomes ||
      `Successfully deployed to staging and production environments, demonstrably reducing infrastructure overhead while accelerating developer velocity and delivering a reliable user experience.`,
    futureScope: [
      "Native edge execution support for geo-distributed deployments.",
      "Fine-tuned domain-specific AI models for automated anomaly detection.",
      "Multi-tenant isolation enhancements with fine-grained RBAC policies.",
      "Public SDK releases in Go, Rust, and TypeScript."
    ]
  };

  return {
    meta,
    overview: rawOverview,
    problem: rawProblem,
    solution: rawSolution,
    features,
    techStack,
    architecture,
    myContributions,
    screenshots,
    challenges,
    outcomes,
    githubUrl: project.github_url,
    demoUrl: project.demo_url,
    videoUrl: project.video_url
  };
}
