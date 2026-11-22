"use client";

import { useState, useEffect, useRef } from "react";
import { X, Terminal as TerminalIcon, Maximize2, Minimize2 } from "lucide-react";
import { Profile, Project, Skill, Experience, Certification, Education } from "@/types";
import { useRouter } from "next/navigation";

interface TerminalHUDProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  certifications: Certification[];
  education?: Education[];
}

interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

export default function TerminalHUD({
  isOpen,
  onClose,
  profile,
  projects,
  skills,
  experience,
  certifications,
  education = [],
}: TerminalHUDProps) {
  const router = useRouter();
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: "welcome",
      output: (
        <div className="text-foreground space-y-1">
          <p className="text-text-tan font-bold">
            Sanjitha E Developer Shell v2.4.0 [x86_64-pc-none-elf]
          </p>
          <p className="text-xs text-text-secondary">
            Type <span className="text-text-tan font-bold">help</span> to view available system commands.
          </p>
        </div>
      ),
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    let outputNode: React.ReactNode = null;

    switch (cmd) {
      case "help":
        outputNode = (
          <div className="space-y-1 text-xs">
            <p className="text-slate-400">Available commands:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
              <div><span className="text-emerald-400 font-mono font-bold">whoami</span> - Display developer profile</div>
              <div><span className="text-emerald-400 font-mono font-bold">education</span> - Academic background</div>
              <div><span className="text-emerald-400 font-mono font-bold">projects</span> - List published systems</div>
              <div><span className="text-emerald-400 font-mono font-bold">skills</span> - Display technical stack</div>
              <div><span className="text-emerald-400 font-mono font-bold">experience</span> - Career timeline</div>
              <div><span className="text-emerald-400 font-mono font-bold">certs</span> - Accredited credentials</div>
              <div><span className="text-emerald-400 font-mono font-bold">clear</span> - Clear terminal buffer</div>
              <div><span className="text-emerald-400 font-mono font-bold">exit</span> - Close terminal HUD</div>
            </div>
          </div>
        );
        break;

      case "whoami":
        outputNode = (
          <div className="text-xs space-y-1 text-slate-300">
            <p><span className="text-emerald-400 font-bold">Name:</span> {profile?.full_name}</p>
            <p><span className="text-emerald-400 font-bold">Title:</span> {profile?.title}</p>
            <p><span className="text-emerald-400 font-bold">Location:</span> {profile?.location}</p>
            <p><span className="text-emerald-400 font-bold">Status:</span> {profile?.open_to_work ? "Open to opportunities" : "Employed"}</p>
            <p><span className="text-emerald-400 font-bold">Bio:</span> {profile?.bio}</p>
          </div>
        );
        break;

      case "education":
        outputNode = (
          <div className="text-xs space-y-2 text-slate-300">
            {education.length > 0 ? (
              education.map((item) => (
                <div key={item.id} className="border-l-2 border-emerald-500/50 pl-2">
                  <p className="font-bold text-emerald-300">{item.degree}</p>
                  <p className="text-slate-400">{item.institution} ({item.period})</p>
                  <p className="text-slate-500 text-[11px]">Score: {item.metrics || "N/A"} | Tags: {item.tags}</p>
                </div>
              ))
            ) : (
              <>
                <div className="border-l-2 border-emerald-500/50 pl-2">
                  <p className="font-bold text-emerald-300">B.E. Computer Science Engineering (AI & ML)</p>
                  <p className="text-slate-400">KPR Institute of Engineering and Technology, Coimbatore (2024 — 2028)</p>
                  <p className="text-slate-500 text-[11px]">CGPA: 8.7/10 | Specialization: AI & ML</p>
                </div>
                <div className="border-l-2 border-cyan-500/50 pl-2">
                  <p className="font-bold text-cyan-300">HSC — Mathematics with Computer Science</p>
                  <p className="text-slate-400">Perambalur Govt Model School, Perambalur (2022 — 2024)</p>
                  <p className="text-slate-500 text-[11px]">Score: 88.5% | Mathematics & Computer Science</p>
                </div>
              </>
            )}
          </div>
        );
        break;

      case "projects":
        outputNode = (
          <div className="text-xs space-y-2">
            <p className="text-slate-400">Active Published Projects ({projects.length}):</p>
            {projects.map((p, idx) => (
              <div key={p.id} className="border-l-2 border-emerald-500/50 pl-2">
                <p className="font-bold text-emerald-300">[{idx + 1}] {p.title} ({p.category})</p>
                <p className="text-slate-400">{p.summary}</p>
                <p className="text-slate-500 text-[11px]">Tags: {p.tags}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "skills":
        outputNode = (
          <div className="text-xs space-y-1.5">
            <p className="text-slate-400">Proficiency Matrix:</p>
            {skills.map((s) => {
              const bars = "█".repeat(Math.round(s.proficiency / 10)) + "░".repeat(10 - Math.round(s.proficiency / 10));
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="w-40 text-slate-300 truncate">{s.name}</span>
                  <span className="text-emerald-400 font-mono">[{bars}]</span>
                  <span className="text-slate-500 font-mono">{s.proficiency}%</span>
                </div>
              );
            })}
          </div>
        );
        break;

      case "experience":
        outputNode = (
          <div className="text-xs space-y-2">
            {experience.map((e) => (
              <div key={e.id} className="border-l-2 border-cyan-500/50 pl-2">
                <p className="font-bold text-white">{e.role} @ <span className="text-emerald-400">{e.company}</span></p>
                <p className="text-slate-400">{e.start_date} – {e.end_date || "Present"} | {e.location}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "certs":
        outputNode = (
          <div className="text-xs space-y-1.5">
            {certifications.map((c) => (
              <div key={c.id}>
                <p className="text-emerald-300 font-bold">• {c.title}</p>
                <p className="text-slate-400 pl-3">Issuer: {c.issuer} | ID: {c.credential_id || "N/A"}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        setInputVal("");
        return;

      case "exit":
        onClose();
        setInputVal("");
        return;

      default:
        outputNode = (
          <p className="text-xs text-red-400">
            command not found: "{cmd}". Type <span className="text-cyan-400 font-bold">help</span> for commands.
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: inputVal, output: outputNode }]);
    setInputVal("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl h-[520px] rounded-2xl bg-dark-panel border border-border flex flex-col shadow-2xl overflow-hidden font-mono">
        {/* Terminal Title Bar */}
        <div className="px-4 py-3 bg-surface border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-btn-bg" />
            <span className="ml-2 text-xs text-text-secondary flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-text-tan" />
              <span>guest@sanjitha-portfolio:~</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-text-secondary hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Console Buffer */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed text-foreground">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.command !== "welcome" && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <span className="text-text-tan font-bold">guest@dev:~$</span>
                  <span className="text-foreground">{item.command}</span>
                </div>
              )}
              <div>{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Command Line Input */}
        <form
          onSubmit={handleCommand}
          className="p-3 bg-surface border-t border-border flex items-center gap-2"
        >
          <span className="text-text-tan text-xs font-bold">guest@dev:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help' or command..."
            className="flex-1 bg-transparent text-xs text-foreground focus:outline-none placeholder-text-secondary font-mono"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}

