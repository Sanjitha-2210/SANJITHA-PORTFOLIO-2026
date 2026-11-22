"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { unlockAdminGate } from "@/components/admin/AdminSecretDoor";
import { Sparkles, ArrowUp } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const router = useRouter();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Option 2: Secret Easter Egg Trigger
  // Triple-clicking or 3 quick taps on the copyright text opens the admin portal
  const handleSecretTrigger = () => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      unlockAdminGate();
      router.push("/admin/login");
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1200);
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border py-10 px-4 sm:px-8 max-w-7xl mx-auto text-xs text-text-secondary font-mono transition-colors select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        {/* Left: Copyright with Secret Easter Egg Trigger (Triple-click / 3 taps to unlock Admin) */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-text-tan flex-shrink-0" />
          <span
            onClick={handleSecretTrigger}
            className="cursor-default text-text-secondary hover:text-foreground transition-colors duration-200"
            title=""
          >
            © {new Date().getFullYear()} Sanjitha E. All rights reserved.
          </span>
        </div>

        {/* Right: Clean Public Links (Zero Admin hints) */}
        <div className="flex items-center gap-6 text-text-secondary">
          <Link href="/projects" className="hover:text-text-tan transition-colors">
            Projects
          </Link>
          <Link href="/certificates" className="hover:text-text-tan transition-colors">
            Certificates
          </Link>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-text-tan transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
