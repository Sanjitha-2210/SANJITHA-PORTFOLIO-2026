"use client";

import BokehParticles from "./BokehParticles";

export default function AmbientAurora() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base Subtle Vignette */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-60 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 106, 60, 0.08), transparent 75%)",
        }}
      />

      {/* Orb 1: Warm Amber / Gold Glow - Top Right (highlights Hero & Profile Card) */}
      <div
        className="absolute -top-24 -right-24 sm:-top-32 sm:-right-24 w-[500px] h-[500px] sm:w-[680px] sm:h-[680px] rounded-full blur-[100px] sm:blur-[130px] opacity-35 dark:opacity-40 animate-aurora-drift-1 transition-all duration-1000"
        style={{
          background:
            "radial-gradient(circle, var(--text-tan) 0%, rgba(212, 176, 124, 0.45) 40%, transparent 70%)",
        }}
      />

      {/* Orb 2: Deep Emerald / Forest Glow - Top Left (depth behind title & intro) */}
      <div
        className="absolute top-12 -left-32 sm:top-24 sm:-left-40 w-[420px] h-[420px] sm:w-[600px] sm:h-[600px] rounded-full blur-[110px] sm:blur-[140px] opacity-25 dark:opacity-45 animate-aurora-drift-2 transition-all duration-1000"
        style={{
          background:
            "radial-gradient(circle, #1E6B42 0%, var(--btn-bg) 45%, transparent 75%)",
        }}
      />

      {/* Orb 3: Soft Radiant Gold / Sage Bloom - Center-Right (Projects & Skills) */}
      <div
        className="absolute top-[42%] -right-48 w-[450px] h-[450px] sm:w-[620px] sm:h-[620px] rounded-full blur-[120px] sm:blur-[150px] opacity-20 dark:opacity-35 animate-aurora-drift-1 transition-all duration-1000"
        style={{
          background:
            "radial-gradient(circle, var(--text-tan) 0%, rgba(36, 58, 47, 0.5) 50%, transparent 75%)",
          animationDelay: "-6s",
        }}
      />

      {/* Orb 4: Rich Forest Pine - Center-Left (Experience Timeline) */}
      <div
        className="absolute top-[68%] -left-36 w-[480px] h-[480px] sm:w-[650px] sm:h-[650px] rounded-full blur-[110px] sm:blur-[140px] opacity-25 dark:opacity-40 animate-aurora-drift-2 transition-all duration-1000"
        style={{
          background:
            "radial-gradient(circle, #243A2F 0%, #16221D 50%, transparent 75%)",
          animationDelay: "-4s",
        }}
      />

      {/* Orb 5: Warm Amber Horizon - Bottom Center (Certifications & Contact) */}
      <div
        className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-[600px] h-[400px] sm:w-[850px] sm:h-[500px] rounded-full blur-[130px] sm:blur-[160px] opacity-30 dark:opacity-35 animate-aurora-pulse transition-all duration-1000"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--text-tan) 0%, rgba(30, 107, 66, 0.4) 45%, transparent 70%)",
        }}
      />

      {/* Layer 2: Ambient Floating Bokeh Embers with Scroll Parallax */}
      <BokehParticles />
    </div>
  );
}

