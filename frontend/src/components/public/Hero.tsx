"use client";

import { useState } from "react";
import { Profile } from "@/types";
import { Download, ArrowRight, Sparkles, X, Bot, CornerDownLeft } from "lucide-react";
import ProfileCard from "./ProfileCard";

interface HeroProps {
  profile: Profile | null;
  onOpenTerminal: () => void;
}

export default function Hero({ profile, onOpenTerminal }: HeroProps) {
  const name = profile?.full_name || "Sanjitha E";
  const title = profile?.title || "GenAI Application Developer";
  const bio =
    profile?.bio ||
    "I build GenAI applications that turn language models and data into tools people can actually use.";

  // Assistant query & answer state
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "What are you working on now?",
    "Show me your best project",
    "How can I contact you?",
  ];

  const handleAskAssistant = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    setActiveQuestion(trimmed);
    setAssistantQuery(trimmed);
    setIsTyping(true);
    setAssistantAnswer(null);

    const q = trimmed.toLowerCase();
    let reply = "";

    if (q.includes("working on") || q.includes("current") || q.includes("now")) {
      reply =
        "Right now, I'm building autonomous AI agents and fine-tuning LLM pipelines with RAG for high-throughput enterprise systems, utilizing FastAPI, Python, and Next.js.";
    } else if (q.includes("best project") || q.includes("top project") || q.includes("show me")) {
      reply =
        "My spotlight project is AuraSphere — an AI-powered autonomous orchestrator leveraging predictive ML models to slash cloud costs by 42%. Check out the Projects section below for architecture and live demos!";
    } else if (q.includes("contact") || q.includes("reach") || q.includes("email") || q.includes("hire")) {
      reply =
        `You can reach me directly at ${profile?.email || "sanjitha.e.dev@gmail.com"}, connect on LinkedIn, or send a message using the Contact section below. I'm always open to discussing exciting opportunities!`;
    } else if (q.includes("skill") || q.includes("stack") || q.includes("technolog")) {
      reply =
        "My primary stack includes Generative AI, LLMs, AI Agents, RAG, Python, FastAPI, Machine Learning, Next.js, and TypeScript.";
    } else {
      reply = `Thanks for asking! I'm ${name}, a ${title} focused on building intelligent solutions using Generative AI and modern web architectures. Feel free to explore my projects below or launch CLI Mode (~) for deep system queries!`;
    }

    setTimeout(() => {
      setAssistantAnswer(reply);
      setIsTyping(false);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("open_chat_assistant", { detail: { query: trimmed } }));
      }
    }, 300);
  };

  return (
    <section className="relative pt-24 sm:pt-28 pb-8 sm:pb-12 min-h-[calc(100vh-4rem)] flex items-start px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient light orbs */}
      <div 
        className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-30" 
        style={{ background: "radial-gradient(circle, var(--text-tan) 0%, transparent 70%)" }}
      />
      <div 
        className="absolute top-32 right-10 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none opacity-15 dark:opacity-25" 
        style={{ background: "radial-gradient(circle, var(--btn-bg) 0%, transparent 70%)" }}
      />

      {/* Main Grid: Left = Content, Right = Profile Card - Aligned to top */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full">
        
        {/* Left Column: Text & Assistant (Col 1 to 7) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10 space-y-5 sm:space-y-6">
          
          {/* Top Pill Badge matching image: ✧ Turning ideas into intelligent solutions | */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tag-bg border border-tag-border text-tag-text text-xs sm:text-sm font-mono backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-text-tan" />
            <span className="font-semibold tracking-wide">Turning ideas into intelligent solutions</span>
            <span className="inline-block w-0.5 h-4 bg-text-tan animate-pulse" />
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
              Hi, I&apos;m{" "}
              <span className="text-gradient-name">
                {name}
              </span>
            </h1>
            <p className="mt-2.5 text-2xl sm:text-3xl lg:text-[40px] font-extrabold text-foreground tracking-tight leading-tight">
              {title}
            </p>
            {/* Signature Accent Line */}
            <div 
              className="w-20 sm:w-24 h-2 rounded-full mt-4" 
              style={{ background: "linear-gradient(to right, var(--name-grad-from), var(--name-grad-to))" }}
            />
          </div>

          {/* Description - Value statement */}
          <p className="text-base sm:text-lg lg:text-[19px] text-text-secondary max-w-2xl leading-relaxed whitespace-pre-line">
            {bio}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            {/* Download Resume Button */}
            <a
              href={profile?.resume_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-btn-bg text-btn-text hover:bg-btn-hover font-bold text-sm sm:text-base transition-all shadow-md flex items-center gap-2.5 group"
            >
              <Download className="w-4.5 h-4.5 transition-transform group-hover:-translate-y-0.5" />
              <span>Download Resume</span>
            </a>

            {/* Contact Button */}
            <a
              href="#contact"
              className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-surface-card hover:bg-surface-card-hover border border-border hover:border-text-tan text-foreground font-bold text-sm sm:text-base transition-all shadow-sm flex items-center gap-2.5 group"
            >
              <span>Contact Me</span>
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* "ASK MY PORTFOLIO ASSISTANT" Section */}
          <div className="w-full max-w-xl pt-3 space-y-3">
            {/* Header: Green pulse indicator + label */}
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs sm:text-[13px] font-mono font-bold tracking-widest uppercase text-text-tan">
                Ask my portfolio assistant
              </span>
            </div>

            {/* Prompt input box with right arrow button */}
            <div className="relative flex items-center rounded-2xl border border-border bg-surface-card/70 backdrop-blur-md p-2 sm:p-2.5 shadow-sm focus-within:border-text-tan/80 transition-all">
              <input
                type="text"
                value={assistantQuery}
                onChange={(e) => setAssistantQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAskAssistant(assistantQuery);
                }}
                placeholder="Ask about my projects, skills or experience..."
                className="w-full bg-transparent px-3.5 py-2 text-sm sm:text-base text-foreground placeholder:text-text-secondary/70 focus:outline-none"
              />
              <button
                onClick={() => handleAskAssistant(assistantQuery)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-btn-bg text-btn-text hover:bg-btn-hover flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 shadow-sm"
                title="Submit question"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Three Suggested Question Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskAssistant(q)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all shadow-xs cursor-pointer active:scale-95 text-left ${
                    activeQuestion === q
                      ? "bg-text-tan/20 border-text-tan text-text-tan"
                      : "bg-surface-card hover:bg-surface-card-hover border-border hover:border-text-tan text-text-secondary hover:text-foreground"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Interactive Response Bubble */}
            {(isTyping || assistantAnswer) && (
              <div className="mt-2 p-4 rounded-2xl border border-border bg-surface-card/90 backdrop-blur-md shadow-md animate-in fade-in slide-in-from-top-2 duration-300 relative">
                <button
                  onClick={() => {
                    setAssistantAnswer(null);
                    setActiveQuestion(null);
                  }}
                  className="absolute top-3 right-3 text-text-secondary hover:text-foreground p-1 transition-colors"
                  title="Close response"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-text-tan/15 border border-text-tan/30 text-text-tan flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-xs font-mono font-semibold text-text-tan">
                      {activeQuestion}
                    </p>
                    {isTyping ? (
                      <div className="flex items-center gap-1.5 mt-2 py-1">
                        <span className="w-2 h-2 rounded-full bg-text-tan animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-text-tan animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-text-tan animate-bounce [animation-delay:0.4s]" />
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-foreground mt-1.5 leading-relaxed">
                        {assistantAnswer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Profile Card (Col 8 to 12) - Aligned to top */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end items-start relative z-10 w-full">
          {/* Subtle ambient light glow behind card */}
          <div 
            className="absolute inset-4 rounded-3xl blur-3xl pointer-events-none opacity-20 dark:opacity-30" 
            style={{ background: "radial-gradient(circle, var(--text-tan) 0%, transparent 70%)" }}
          />

          <ProfileCard profile={profile} />
        </div>

      </div>
    </section>
  );
}
