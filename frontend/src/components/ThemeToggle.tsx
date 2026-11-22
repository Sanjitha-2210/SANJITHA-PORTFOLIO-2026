"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full border border-border opacity-0" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Light and Dark Mode"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 bg-surface-card hover:bg-surface-card-hover border border-border text-foreground hover:scale-105 shadow-sm text-xs font-medium cursor-pointer"
      title={`Current: ${isDark ? "Dark Mode" : "Light Mode"}. Click to toggle.`}
    >
      {isDark ? (
        <>
          <Moon className="w-3.5 h-3.5 text-text-tan transition-transform duration-300 -rotate-12" />
          <span className="hidden sm:inline text-text-tan font-mono text-[11px]">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-btn-bg transition-transform duration-300 rotate-0" />
          <span className="hidden sm:inline text-btn-bg font-mono text-[11px]">Light</span>
        </>
      )}
    </button>
  );
}
