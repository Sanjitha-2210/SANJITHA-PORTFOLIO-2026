import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl border border-border shadow-xl space-y-5">
        <div className="w-14 h-14 rounded-full bg-btn-bg/15 text-text-tan flex items-center justify-center mx-auto">
          <Compass className="w-7 h-7 animate-pulse-slow" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono text-text-tan tracking-widest uppercase">
            Error 404
          </span>
          <h1 className="text-2xl font-bold tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            The page you are looking for doesn't exist or has been relocated.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-btn-bg text-btn-text hover:bg-btn-hover font-semibold text-xs transition-all shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

