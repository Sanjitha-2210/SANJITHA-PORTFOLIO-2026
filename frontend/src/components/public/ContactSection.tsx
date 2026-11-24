"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/api";
import { 
  Phone, Mail, MapPin, Copy, Check, Download, 
  Linkedin, Github, Globe, Twitter, Send, CheckCircle2, AlertCircle 
} from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Copy to clipboard feedback states
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const phoneText = "+91 9047980462";
  const emailText = "sanjithamageshwar@gmail.com";
  const locationText = "Coimbatore, Tamil Nadu";

  const handleCopy = (text: string, type: "phone" | "email") => {
    navigator.clipboard.writeText(text);
    if (type === "phone") {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleDownloadVCard = () => {
    const vCardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:E;Sanjitha;;;",
      "FN:Sanjitha E",
      "ORG:GenAI Application Developer",
      "TITLE:GenAI Application Developer",
      `TEL;TYPE=CELL:${phoneText}`,
      `EMAIL;TYPE=INTERNET:${emailText}`,
      `ADR;TYPE=HOME:;;${locationText};;;India`,
      "URL:https://sanjitha-portfolio-2026.vercel.app",
      "END:VCARD",
    ].join("\n");

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Sanjitha_E.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      // Map to backend schema: name, email, subject, message
      const subject = formData.phone
        ? `Portfolio Inquiry from ${formData.firstName} (Phone: ${formData.phone})`
        : `Portfolio Inquiry from ${formData.firstName}`;
      
      const messageBody = formData.phone
        ? `${formData.message}\n\nContact Phone: ${formData.phone}`
        : formData.message;

      await submitContactForm({
        name: formData.firstName,
        email: formData.email,
        subject: subject,
        message: messageBody,
      });

      setStatus("success");
      setFormData({ firstName: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to deliver message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-24 px-4 max-w-6xl mx-auto relative scroll-mt-20">
      {/* Centered Heading matching UI design */}
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
          Reach Me Here
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-2 font-mono">
          Have an idea, project, or opportunity? Let&apos;s build something meaningful together.
        </p>
      </div>

      {/* Main Grid: 2 Side-by-side cards matching image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* ======================================================== */}
        {/* LEFT CARD: Contact Information                           */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 rounded-3xl bg-surface-card border border-border p-6 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          {/* Subtle ambient corner glow */}
          <div 
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-30"
            style={{ background: "radial-gradient(circle, var(--text-tan) 0%, transparent 70%)" }}
          />

          <div className="relative z-10 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Contact Information
            </h3>

            {/* Contact entries with dividers */}
            <div className="space-y-4 pt-1">
              {/* Phone */}
              <div className="flex items-center justify-between pb-3.5 border-b border-border/70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center flex-shrink-0 text-text-tan">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground tracking-wide font-mono">
                    {phoneText}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(phoneText, "phone")}
                  className="p-2 rounded-lg bg-surface hover:bg-surface-card-hover border border-border text-text-secondary hover:text-text-tan transition-all cursor-pointer relative"
                  title="Copy Phone Number"
                >
                  {copiedPhone ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between pb-3.5 border-b border-border/70">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center flex-shrink-0 text-text-tan">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground truncate font-mono">
                    {emailText}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(emailText, "email")}
                  className="p-2 rounded-lg bg-surface hover:bg-surface-card-hover border border-border text-text-secondary hover:text-text-tan transition-all cursor-pointer relative flex-shrink-0"
                  title="Copy Email Address"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 pb-2">
                <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center flex-shrink-0 text-text-tan">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {locationText}
                </span>
              </div>
            </div>

            {/* Social Media section */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                Social Media
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface hover:bg-btn-bg border border-border hover:border-text-tan flex items-center justify-center text-text-secondary hover:text-btn-text transition-all duration-300 hover:scale-110 shadow-xs"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface hover:bg-btn-bg border border-border hover:border-text-tan flex items-center justify-center text-text-secondary hover:text-btn-text transition-all duration-300 hover:scale-110 shadow-xs"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://sanjitha-portfolio-2026.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface hover:bg-btn-bg border border-border hover:border-text-tan flex items-center justify-center text-text-secondary hover:text-btn-text transition-all duration-300 hover:scale-110 shadow-xs"
                  title="Website Portfolio"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface hover:bg-btn-bg border border-border hover:border-text-tan flex items-center justify-center text-text-secondary hover:text-btn-text transition-all duration-300 hover:scale-110 shadow-xs"
                  title="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Action: Download vCard */}
          <div className="pt-8 relative z-10">
            <button
              type="button"
              onClick={handleDownloadVCard}
              className="w-full py-3 px-4 rounded-2xl bg-surface hover:bg-surface-card-hover border border-border hover:border-text-tan text-foreground font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-xs hover:scale-[1.02] cursor-pointer"
            >
              <Download className="w-4 h-4 text-text-tan" />
              <span>Download vCard</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT CARD: Contact Form                                 */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 rounded-3xl bg-surface-card border border-border p-6 sm:p-8 flex flex-col justify-between shadow-lg relative">
          
          {status === "success" && (
            <div 
              className="p-4 rounded-2xl border text-xs sm:text-sm flex items-center gap-3 mb-6 animate-fade-in"
              style={{ 
                backgroundColor: "var(--tag-bg)", 
                borderColor: "var(--tag-border)", 
                color: "var(--foreground)" 
              }}
            >
              <CheckCircle2 className="w-5 h-5 text-text-tan flex-shrink-0" />
              <span>Thank you! Your message has been sent successfully. I will get back to you soon.</span>
            </div>
          )}

          {status === "error" && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs sm:text-sm flex items-center gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: First Name* */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">
                First Name<span className="text-text-tan">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-2xl bg-surface border border-border focus:border-text-tan text-foreground placeholder:text-text-secondary/60 text-xs sm:text-sm focus:outline-none transition-all shadow-xs"
              />
            </div>

            {/* Row 2: Your Email* and Phone Number* */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Your Email<span className="text-text-tan">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="yourname@email.com"
                  className="w-full px-4 py-3 rounded-2xl bg-surface border border-border focus:border-text-tan text-foreground placeholder:text-text-secondary/60 text-xs sm:text-sm focus:outline-none transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Phone Number<span className="text-text-tan">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 rounded-2xl bg-surface border border-border focus:border-text-tan text-foreground placeholder:text-text-secondary/60 text-xs sm:text-sm focus:outline-none transition-all shadow-xs font-mono"
                />
              </div>
            </div>

            {/* Row 3: Your Message* */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">
                Your Message<span className="text-text-tan">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here..."
                className="w-full px-4 py-3 rounded-2xl bg-surface border border-border focus:border-text-tan text-foreground placeholder:text-text-secondary/60 text-xs sm:text-sm focus:outline-none transition-all resize-none shadow-xs"
              />
            </div>

            {/* Row 4: Submit Button and *Required fields */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-btn-bg text-btn-text hover:bg-btn-hover font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                {submitting ? (
                  <span>SUBMITTING...</span>
                ) : (
                  <>
                    <span>SUBMIT</span>
                    <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <span className="text-[11px] font-mono text-text-secondary">
                *Required fields
              </span>
            </div>
          </form>

        </div>

      </div>
    </section>
  );
}
