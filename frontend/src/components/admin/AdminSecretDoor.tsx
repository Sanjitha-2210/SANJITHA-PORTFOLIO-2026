"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export const UNLOCK_KEY = "admin_gate_unlocked";

export function unlockAdminGate() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(UNLOCK_KEY, "true");
  }
}

export function isGateUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(UNLOCK_KEY) === "true";
}

export default function AdminSecretDoor() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret key combination:
      // 1. Ctrl + Shift + A (Windows/Linux) or Cmd + Shift + A (Mac)
      // 2. Alt + Shift + A
      const isModifier = (e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey;
      const isAKey = e.key === "A" || e.key === "a";

      if (isModifier && isAKey) {
        e.preventDefault();
        unlockAdminGate();
        if (pathname?.startsWith("/admin")) {
          return;
        }
        router.push("/admin/login");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, pathname]);

  return null;
}
