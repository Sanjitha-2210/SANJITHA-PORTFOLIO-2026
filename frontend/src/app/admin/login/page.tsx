"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { setAuthToken, isAuthenticated } from "@/lib/auth";
import { isGateUnlocked } from "@/components/admin/AdminSecretDoor";
import { Shield, KeyRound, User, Lock, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import AmbientAurora from "@/components/public/AmbientAurora";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Security gate check: only accessible if unlocked via Ctrl+Shift+A or triple-click
  useEffect(() => {
    const isPermitted = isGateUnlocked() || isAuthenticated();
    if (!isPermitted) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login(username, password);
      setAuthToken(res.access_token);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid administrative credentials");
    } finally {
      setLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setUsername("admin");
    setPassword("admin123456");
  };

  return (
    <div className="relative min-h-screen bg-background bg-ambient-aurora flex items-center justify-center p-4 transition-colors duration-300 overflow-hidden">
      <AmbientAurora />
      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-border shadow-xl relative overflow-hidden">
          {/* Top Corner Toggle */}
          <div className="absolute top-5 right-5">
            <ThemeToggle />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-btn-bg/15 border border-border text-text-tan mx-auto flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground">Administrator Portal</h1>
            <p className="text-xs text-text-secondary mt-1 font-mono">
              Authenticate to manage portfolio content
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center gap-2.5 mb-6">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-text-secondary mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border focus:border-text-tan text-foreground placeholder-text-secondary text-sm focus:outline-none transition-all shadow-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="enter password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border focus:border-text-tan text-foreground placeholder-text-secondary text-sm focus:outline-none transition-all shadow-sm font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-btn-bg hover:bg-btn-hover disabled:opacity-50 text-btn-text font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-btn-text border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Helper Pill */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <button
              type="button"
              onClick={fillDefaultCredentials}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-text-secondary hover:text-foreground transition-colors bg-surface px-3 py-1.5 rounded-lg border border-border shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5 text-text-tan" />
              <span>Click to auto-fill default credentials (admin)</span>
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-xs text-text-secondary hover:text-foreground font-mono transition-colors"
            >
              ← Back to Public Showcase
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
