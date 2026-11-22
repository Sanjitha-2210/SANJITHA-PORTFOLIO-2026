"use client";

import { useEffect, useState } from "react";
import { Message } from "@/types";
import { adminGetMessages, adminToggleMessageRead, adminDeleteMessage } from "@/lib/api";
import { Mail, MailOpen, Trash2, Clock, Reply } from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const data = await adminGetMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (id: number) => {
    try {
      const updated = await adminToggleMessageRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await adminDeleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-extrabold text-foreground">Inquiries & Messages Inbox</h1>
        <p className="text-xs text-text-secondary font-mono mt-1">
          Direct dispatches sent via the public website contact portal
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-surface-card">
          <Mail className="w-8 h-8 text-text-secondary mx-auto mb-3" />
          <p className="text-text-secondary text-xs">Your inbox is currently clear.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-all ${
                msg.is_read
                  ? "bg-surface/50 border-border text-text-secondary"
                  : "bg-surface-card border-text-tan/40 text-foreground shadow-md"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => handleToggleRead(msg.id)}
                    className="cursor-pointer"
                    title={msg.is_read ? "Mark as unread" : "Mark as read"}
                  >
                    {msg.is_read ? (
                      <MailOpen className="w-4 h-4 text-text-secondary hover:text-text-tan" />
                    ) : (
                      <Mail className="w-4 h-4 text-text-tan" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-foreground">{msg.name}</h3>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs font-mono text-text-tan hover:underline"
                  >
                    {msg.email}
                  </a>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-text-secondary">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(msg.created_at)}</span>
                  </div>

                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "Portfolio Inquiry")}`}
                    className="p-1.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-foreground"
                    title="Reply via Email"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {msg.subject && (
                <div className="text-xs font-semibold text-text-tan font-mono mb-2">
                  Topic: {msg.subject}
                </div>
              )}

              <p className="text-xs text-foreground leading-relaxed whitespace-pre-line bg-surface p-4 rounded-xl border border-border">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
