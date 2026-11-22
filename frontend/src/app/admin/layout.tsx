"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { adminGetMessages, getCurrentUser, autoRenewSession } from "@/lib/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthorized(true);
      return;
    }

    const verifySession = async () => {
      // If no token in localStorage, attempt auto-renewal
      if (!isAuthenticated()) {
        const renewed = await autoRenewSession();
        if (!renewed) {
          router.replace("/");
          return;
        }
      }

      // Check if token is actively accepted by backend
      try {
        await getCurrentUser();
        setAuthorized(true);
      } catch (err) {
        console.warn("Stored admin token was rejected. Auto-renewing session...");
        const renewed = await autoRenewSession();
        if (renewed) {
          setAuthorized(true);
        } else {
          router.replace("/");
          return;
        }
      }

      // Fetch unread count for sidebar badge
      adminGetMessages()
        .then((msgs) => {
          const unread = msgs.filter((m) => !m.is_read).length;
          setUnreadCount(unread);
        })
        .catch(() => {});
    };

    verifySession();
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary font-mono text-sm">
        Authenticating session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      <AdminSidebar unreadCount={unreadCount} />
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
