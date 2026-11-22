"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Router Error caught by error.tsx:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <div className="p-8 rounded-2xl bg-surface-card border border-red-500/30 max-w-lg space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-red-400">Application Error Encountered</h2>
        <p className="text-xs font-mono text-text-secondary bg-surface p-3 rounded-lg text-left overflow-auto max-h-40 border border-border">
          {error?.message || "Unknown error occurred"}
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-btn-bg text-btn-text hover:bg-btn-hover font-semibold text-xs transition-all shadow"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

