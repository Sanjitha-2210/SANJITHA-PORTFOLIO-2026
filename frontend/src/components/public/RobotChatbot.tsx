"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, Send, Sparkles, RotateCw, 
  ExternalLink, GraduationCap, Code2, Briefcase, Mail 
} from "lucide-react";
import { Profile, Project, Skill, Experience, Certification, Education } from "@/types";

interface RobotChatbotProps {
  profile: Profile | null;
  projects?: Project[];
  skills?: Skill[];
  education?: Education[];
  experience?: Experience[];
  certifications?: Certification[];
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  action?: {
    label: string;
    targetId: string;
  };
  timestamp: string;
}

// Rich Markdown-Style Formatter for Clean, Beautiful Chat Bubbles
function FormattedChatText({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-foreground/95 dark:text-[#1F2A24]">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Detect bullet lines starting with • or -
        const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-");
        const cleanLine = isBullet ? trimmed.replace(/^[•\-]\s*/, "") : trimmed;

        // Parse inline bold (**...**) and inline code (`...`)
        const parts = cleanLine.split(/(\*\*.*?\*\*|`.*?`)/g);

        const renderedLine = parts.map((part, partIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={partIdx} className="font-extrabold text-foreground dark:text-[#17140E]">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <span
                key={partIdx}
                className="px-1.5 py-0.5 rounded-md bg-surface dark:bg-[#FAF7F0] border border-border dark:border-[#D6CFBF] font-mono text-[11px] text-text-tan dark:text-[#8C6D42] font-semibold"
              >
                {part.slice(1, -1)}
              </span>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2.5 pl-1 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-text-tan dark:bg-[#1E6B42] mt-2 flex-shrink-0 shadow-xs" />
              <div className="flex-1 leading-relaxed text-[13px] sm:text-sm">{renderedLine}</div>
            </div>
          );
        }

        return (
          <p key={lineIdx} className="leading-relaxed text-[13px] sm:text-sm">
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
}

export default function RobotChatbot({
  profile,
  projects = [],
  skills = [],
  education = [],
  experience = [],
  certifications = [],
}: RobotChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [greetingText, setGreetingText] = useState("Curious? Ask Aira.");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);

  const initialGreeting: ChatMessage = {
    id: "welcome",
    sender: "bot",
    text: `Hi, I'm Aira ,Your window into Sanjitha's world. 🤖\n\nAsk me anything about her projects, academic background at KPR Institute, technical skills, or get in touch!`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);

  // Periodic automatic spin and greeting dismiss
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 10000);

    const spinInterval = setInterval(() => {
      if (!isOpen) {
        triggerSpin();
      }
    }, 26000);

    const handleExternalOpen = (e: Event) => {
      const customEvt = e as CustomEvent<{ query?: string }>;
      setIsOpen(true);
      setShowGreeting(false);
      triggerSpin();
      if (customEvt.detail?.query) {
        handleSendMessage(customEvt.detail.query);
      }
    };

    window.addEventListener("open_chat_assistant", handleExternalOpen);

    return () => {
      clearTimeout(timer);
      clearInterval(spinInterval);
      window.removeEventListener("open_chat_assistant", handleExternalOpen);
    };
  }, [isOpen]);

  // Subtle mouse tracking for the head tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!robotRef.current) return;
      const rect = robotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) / window.innerWidth;
      const dy = (e.clientY - centerY) / window.innerHeight;
      setMouseOffset({
        x: Math.max(-12, Math.min(12, dx * 24)),
        y: Math.max(-8, Math.min(8, dy * 16)),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const triggerSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1200);
  };

  const handleRobotClick = () => {
    triggerSpin();
    setIsOpen((prev) => !prev);
    setShowGreeting(false);
  };

  const generateBotReply = (query: string): { text: string; action?: { label: string; targetId: string } } => {
    const q = query.toLowerCase().trim();

    // 1. Education
    if (q.includes("education") || q.includes("college") || q.includes("school") || q.includes("degree") || q.includes("study") || q.includes("cgpa")) {
      return {
        text: `🎓 Sanjitha is pursuing **B.E. Computer Science Engineering (AI & ML)** at **KPR Institute of Engineering and Technology, Coimbatore** (2024 — 2028) with an outstanding **CGPA of 8.7/10**.\n\nShe completed her **HSC in Mathematics with Computer Science** at **Perambalur Govt Model School** (2022 — 2024) scoring **88.5%**!`,
        action: { label: "View Chapters of Learning", targetId: "education" }
      };
    }

    // 2. Projects
    if (q.includes("project") || q.includes("work") || q.includes("build") || q.includes("portfolio")) {
      const topProjects = projects.slice(0, 3).map(p => `• **${p.title}** (${p.category}): ${p.summary}`).join("\n\n");
      return {
        text: `🚀 Here are some of Sanjitha's notable works:\n\n${topProjects || "• **AuraSphere**: Autonomous Cloud Orchestrator\n• **HyperPulse**: Low-Latency Financial Visualizer\n• **CogniFlow**: Multimodal Agentic Workflow Engine"}\n\nAll projects feature end-to-end AI architectures and production-grade deployments.`,
        action: { label: "Explore All Projects", targetId: "projects" }
      };
    }

    // 3. Skills & Tech Stack
    if (q.includes("skill") || q.includes("tech") || q.includes("stack") || q.includes("language") || q.includes("python") || q.includes("fastapi") || q.includes("react")) {
      return {
        text: `⚡ Sanjitha specializes in **Generative AI & Autonomous Agents**, **Python / FastAPI**, **React & Next.js 15**, **TypeScript**, **Tailwind CSS**, and modern cloud infrastructure (Docker, Kubernetes).\n\nShe builds responsive, high-performance web systems integrated with large language models and multi-agent pipelines!`,
        action: { label: "Inspect Skills Matrix", targetId: "skills" }
      };
    }

    // 4. Contact / Hire
    if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("reach") || q.includes("message")) {
      return {
        text: `📬 You can reach Sanjitha directly at **sanjitha.e.dev@gmail.com**, or drop a message right in the contact section below. She is open to impactful engineering opportunities!`,
        action: { label: "Go to Contact Form", targetId: "contact" }
      };
    }

    // 5. Resume
    if (q.includes("resume") || q.includes("cv") || q.includes("download")) {
      return {
        text: `📄 You can view and download Sanjitha's updated resume directly from the top navigation or the hero section button!`,
        action: { label: "View Resume", targetId: "hero" }
      };
    }

    // 6. Experience
    if (q.includes("experience") || q.includes("career") || q.includes("job")) {
      return {
        text: `💼 Sanjitha has rich experience designing scalable distributed web platforms, agentic AI microservices, and modern frontend interfaces with sub-second responsiveness.`,
        action: { label: "View Experience", targetId: "experience" }
      };
    }

    // 7. General whoami
    if (q.includes("who are you") || q.includes("who is sanjitha") || q.includes("about") || q.includes("sanjitha")) {
      return {
        text: `Sanjitha E is a **GenAI Application Developer** passionate about engineering intelligent solutions using Generative AI, Machine Learning, and modern web architectures.`,
        action: { label: "Read Full Bio", targetId: "hero" }
      };
    }

    // Default intelligent fallback
    return {
      text: `That's a great question! Sanjitha is an AI & ML engineer specializing in modern generative architectures, intelligent chatbots, and cloud engineering.\n\nFeel free to ask about her **education**, **projects**, or **tech stack**!`,
      action: { label: "Jump to Projects", targetId: "projects" }
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateBotReply(query);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: reply.text,
        action: reply.action,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex flex-col items-end pointer-events-none">
      {/* 1. Chat Dialog Window - Inverted Theme: Dark Mode renders with #F3EFE6 light card and dark text */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-[calc(100vw-2rem)] sm:w-[430px] h-[580px] max-h-[85vh] rounded-3xl glass-panel bg-panel-bg/95 dark:bg-[#F3EFE6] dark:text-[#1F2A24] dark:border-[#D6CFBF] backdrop-blur-2xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-surface-card dark:bg-[#EAE4D7] border-b border-border dark:border-[#D6CFBF] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* Mini Robot Avatar in Header */}
              <div 
                onClick={triggerSpin}
                className="w-10 h-10 rounded-2xl bg-btn-bg/20 dark:bg-[#D6CFBF] border border-btn-bg/40 dark:border-[#B5AA96] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-xs"
                title="Click to spin Aira!"
              >
                <Sparkles className="w-5 h-5 text-text-tan dark:text-[#8C6D42]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-foreground dark:text-[#1F2A24] tracking-tight">Aira AI</h3>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-[#1E6B42]/15 text-emerald-400 dark:text-[#1E6B42] text-[11px] font-mono font-semibold border border-emerald-500/25 dark:border-[#1E6B42]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-[#1E6B42] animate-pulse"></span>
                    Online
                  </span>
                </div>
                <p className="text-xs text-text-secondary dark:text-[#52665B] font-mono mt-0.5">Portfolio Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={triggerSpin}
                className="p-2 rounded-xl hover:bg-surface dark:hover:bg-[#D6CFBF]/60 text-text-secondary dark:text-[#1F2A24] hover:text-foreground transition-colors"
                title="Spin Aira 360°"
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-surface dark:hover:bg-[#D6CFBF]/60 text-text-secondary dark:text-[#1F2A24] hover:text-foreground transition-colors"
                title="Minimize chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2.5 bg-surface/50 dark:bg-[#E2DDD0]/80 border-b border-border/60 dark:border-[#D6CFBF] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-mono">
            <button
              onClick={() => handleSendMessage("Tell me about your education")}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-card dark:bg-[#FAF7F0] hover:bg-surface-card-hover dark:hover:bg-[#EAE4D7] border border-border dark:border-[#D6CFBF] text-text-tan dark:text-[#1F2A24] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Education</span>
            </button>
            <button
              onClick={() => handleSendMessage("Show me your best projects")}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-card dark:bg-[#FAF7F0] hover:bg-surface-card-hover dark:hover:bg-[#EAE4D7] border border-border dark:border-[#D6CFBF] text-text-tan dark:text-[#1F2A24] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Projects</span>
            </button>
            <button
              onClick={() => handleSendMessage("What skills and tech stack do you use?")}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-card dark:bg-[#FAF7F0] hover:bg-surface-card-hover dark:hover:bg-[#EAE4D7] border border-border dark:border-[#D6CFBF] text-text-tan dark:text-[#1F2A24] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Skills</span>
            </button>
            <button
              onClick={() => handleSendMessage("How can I contact Sanjitha?")}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-card dark:bg-[#FAF7F0] hover:bg-surface-card-hover dark:hover:bg-[#EAE4D7] border border-border dark:border-[#D6CFBF] text-text-tan dark:text-[#1F2A24] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          </div>

          {/* Messages Area - Rendered in rich formatted Markdown style */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-4 leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-btn-bg text-btn-text rounded-tr-xs font-medium text-[13px] sm:text-sm shadow-xs"
                      : "bg-surface-card dark:bg-[#EAE4D7] border border-border dark:border-[#D6CFBF] dark:text-[#1F2A24] rounded-tl-xs"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <FormattedChatText content={msg.text} />
                  )}
                  
                  {msg.action && (
                    <button
                      onClick={() => scrollToSection(msg.action!.targetId)}
                      className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-btn-bg/20 dark:bg-[#1B3B2B] hover:bg-btn-bg/30 text-text-tan dark:text-[#EDE8DC] font-bold text-xs font-mono border border-btn-bg/35 dark:border-[#1B3B2B] transition-colors shadow-xs"
                    >
                      <span>{msg.action.label}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-text-secondary dark:text-[#52665B] mt-1.5 px-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-surface-card dark:bg-[#EAE4D7] border border-border dark:border-[#D6CFBF] rounded-2xl px-4 py-2.5 w-18 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-text-tan dark:bg-[#8C6D42] animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-text-tan dark:bg-[#8C6D42] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-text-tan dark:bg-[#8C6D42] animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3.5 bg-surface-card dark:bg-[#EAE4D7] border-t border-border dark:border-[#D6CFBF]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Aira about education, skills, projects..."
                className="w-full pl-4 pr-12 py-3 rounded-2xl bg-surface dark:bg-[#FAF7F0] border border-border dark:border-[#D6CFBF] text-foreground dark:text-[#1F2A24] text-xs sm:text-sm placeholder:text-text-secondary dark:placeholder:text-[#52665B] focus:outline-none focus:border-text-tan dark:focus:border-[#8C6D42] transition-colors font-mono"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="absolute right-2 p-2 rounded-xl bg-btn-bg dark:bg-[#1B3B2B] text-btn-text dark:text-[#EDE8DC] hover:bg-btn-hover dark:hover:bg-[#142D21] disabled:opacity-40 disabled:hover:bg-btn-bg transition-all shadow-xs"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Robot Avatar & Speech Bubble - Scaled up for extra prominence */}
      <div className="pointer-events-auto flex flex-col items-center select-none group">
        {/* Floating Greeting Tooltip Bubble */}
        {!isOpen && showGreeting && (
          <div 
            onClick={handleRobotClick}
            className="mb-3 px-4 py-2 rounded-2xl bg-surface-card/95 backdrop-blur-md border border-text-tan/40 text-text-tan text-xs sm:text-[13px] font-mono font-semibold shadow-xl hover:border-text-tan cursor-pointer flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <Sparkles className="w-4 h-4 text-text-tan animate-pulse" />
            <span>{greetingText}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGreeting(false);
              }}
              className="text-text-secondary hover:text-foreground ml-1 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* The Animated Floating Robot (Scaled up from 78/86px to 94/104px) */}
        <div
          ref={robotRef}
          onClick={handleRobotClick}
          className="relative cursor-pointer flex flex-col items-center justify-center p-1 transition-transform duration-300 group-hover:scale-110"
          title="Click to chat with Aira!"
        >
          {/* Ambient Glow behind Robot */}
          <div className="absolute w-24 h-24 rounded-full bg-emerald-500/25 dark:bg-emerald-400/30 blur-2xl pointer-events-none -z-10 animate-robot-glow"></div>

          {/* Robot SVG with 3D Flip capability */}
          <div
            className={`w-[92px] h-[92px] sm:w-[102px] sm:h-[102px] animate-robot-float transition-all ${
              isSpinning ? "animate-robot-spin" : ""
            }`}
            style={{
              transform: isSpinning 
                ? undefined 
                : `perspective(650px) rotateX(${-mouseOffset.y}deg) rotateY(${mouseOffset.x}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-lg"
            >
              <defs>
                {/* Forest metallic gradient for robot helmet */}
                <linearGradient id="robotBodyGrad" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#dceae2" />
                  <stop offset="50%" stopColor="#a3c4b2" />
                  <stop offset="100%" stopColor="#416b55" />
                </linearGradient>

                {/* Dark visor gradient */}
                <linearGradient id="visorGrad" x1="30" y1="25" x2="70" y2="55" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0c1813" />
                  <stop offset="100%" stopColor="#183125" />
                </linearGradient>

                {/* Glowing Emerald / Cyan Eye Gradient */}
                <linearGradient id="glowEyeGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6ee7b7" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>

                {/* Ear earpiece gradient */}
                <linearGradient id="earGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#244838" />
                  <stop offset="100%" stopColor="#152b21" />
                </linearGradient>
              </defs>

              {/* Antenna on Top Right */}
              <path
                d="M 68 20 L 76 8"
                stroke="#416b55"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="77" cy="7" r="3" fill="#10b981" className="animate-pulse" />

              {/* Head / Helmet */}
              <ellipse
                cx="50"
                cy="36"
                rx="28"
                ry="24"
                fill="url(#robotBodyGrad)"
                stroke="#2d5240"
                strokeWidth="1.5"
              />

              {/* Left Earpiece */}
              <rect
                x="19"
                y="30"
                width="5"
                height="12"
                rx="2.5"
                fill="url(#earGrad)"
                stroke="#1b3b2b"
                strokeWidth="1"
              />

              {/* Right Earpiece */}
              <rect
                x="76"
                y="30"
                width="5"
                height="12"
                rx="2.5"
                fill="url(#earGrad)"
                stroke="#1b3b2b"
                strokeWidth="1"
              />

              {/* Curved Headset Boom Mic */}
              <path
                d="M 77 37 Q 78 52 57 52"
                stroke="#34d399"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="56" cy="52" r="2.5" fill="#10b981" className="animate-pulse" />

              {/* Dark Visor */}
              <ellipse
                cx="50"
                cy="37"
                rx="20"
                ry="15"
                fill="url(#visorGrad)"
                stroke="#10b981"
                strokeWidth="0.8"
              />

              {/* Left Glowing Eye (Blinking) */}
              <rect
                x="40"
                y="31"
                width="4.5"
                height="9"
                rx="2.25"
                fill="url(#glowEyeGrad)"
                className="animate-robot-blink"
              />

              {/* Right Glowing Eye (Blinking) */}
              <rect
                x="55.5"
                y="31"
                width="4.5"
                height="9"
                rx="2.25"
                fill="url(#glowEyeGrad)"
                className="animate-robot-blink"
              />

              {/* Happy Smiling Mouth */}
              <path
                d="M 46 44 Q 50 48 54 44"
                stroke="#EDE8DC"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />

              {/* Contoured Torso / Pod Body */}
              <path
                d="M 38 60 C 38 56 62 56 62 60 C 64 68 62 76 50 76 C 38 76 36 68 38 60 Z"
                fill="url(#robotBodyGrad)"
                stroke="#2d5240"
                strokeWidth="1.2"
              />

              {/* Glowing Chest Indicator Badge */}
              <circle cx="53" cy="65" r="2.5" fill="#34d399" className="animate-pulse" />

              {/* Left Floating Hand / Flipper */}
              <ellipse
                cx="28"
                cy="64"
                rx="5"
                ry="8"
                fill="url(#robotBodyGrad)"
                stroke="#2d5240"
                strokeWidth="1"
                transform="rotate(-25 28 64)"
              />

              {/* Right Floating Hand / Flipper */}
              <ellipse
                cx="72"
                cy="64"
                rx="5"
                ry="8"
                fill="url(#robotBodyGrad)"
                stroke="#2d5240"
                strokeWidth="1"
                transform="rotate(25 72 64)"
              />

              {/* Bottom Thruster Ring */}
              <ellipse
                cx="50"
                cy="78"
                rx="4.5"
                ry="2.5"
                fill="#34d399"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* Floating Shadow Below (Breathing opposite to float) */}
          <div className="w-14 sm:w-16 h-3 rounded-full bg-black/40 dark:bg-black/65 blur-[3px] animate-robot-shadow -mt-1"></div>
        </div>
      </div>
    </div>
  );
}