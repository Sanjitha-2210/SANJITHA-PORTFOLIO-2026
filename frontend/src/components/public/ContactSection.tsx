"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/api";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      await submitContactForm(formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to deliver message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 max-w-4xl mx-auto relative">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-border relative overflow-hidden shadow-lg">
        {/* Subtle background glow */}
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-15 dark:opacity-25"
          style={{ background: "radial-gradient(circle, var(--text-tan) 0%, transparent 70%)" }}
        />

        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-text-tan font-mono text-xs tracking-wider uppercase mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Initiate Conversation
          </h2>
          <p className="text-sm text-text-secondary mt-2">
            Messages are routed directly into the Private Admin CMS inbox. Let&apos;s discuss Generative AI solutions, roles, or innovative projects.
          </p>
        </div>

        {status === "success" && (
          <div 
            className="p-4 rounded-xl border text-sm flex items-center gap-3 mb-8 animate-fade-in"
            style={{ 
              backgroundColor: "var(--tag-bg)", 
              borderColor: "var(--tag-border)", 
              color: "var(--foreground)" 
            }}
          >
            <CheckCircle2 className="w-5 h-5 text-text-tan flex-shrink-0" />
            <span>Thank you! Your dispatch was recorded in the database. I will review it shortly.</span>
          </div>
        )}

        {status === "error" && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-sm flex items-center gap-3 mb-8">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-text-secondary mb-2">
                Your Name <span className="text-text-tan">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ada Lovelace"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-text-tan text-foreground placeholder-text-secondary text-sm focus:outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary mb-2">
                Email Address <span className="text-text-tan">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ada@example.com"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-text-tan text-foreground placeholder-text-secondary text-sm focus:outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-text-secondary mb-2">
              Subject <span className="text-text-tan">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="GenAI Role / Architecture Consulting"
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-text-tan text-foreground placeholder-text-secondary text-sm focus:outline-none transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-text-secondary mb-2">
              Message <span className="text-text-tan">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Hi Sanjitha, I came across your portfolio and would love to connect..."
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-text-tan text-foreground placeholder-text-secondary text-sm focus:outline-none transition-all resize-none shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-btn-bg hover:bg-btn-hover text-btn-text font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <span>Dispatching...</span>
            ) : (
              <>
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
